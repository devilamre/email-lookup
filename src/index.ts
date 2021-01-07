import { Config, DefaultConfig } from './@types/Config';
import { Command, CommandState } from './@types/Command';
import { Response } from './@types/Response';
import { resolveMx, MxRecord } from "dns";
import { Socket } from 'net';

export async function verify(params: Config): Promise<Response> {
    const { email } = { ...DefaultConfig, ...params };
    const domain: string = email.split('@')[1];

    const addresses: MxRecord[] = await resolveExchangeServers(domain);
    return checkEmail({ ...params, addresses });
}

export async function verifyExistence(email: string): Promise<Response> {
    const params: Config = {
        ...DefaultConfig,
        email
    };
    return verify(params);
}

export function resolveExchangeServers(domain: string): Promise<MxRecord[]> {
    return new Promise((resolve, reject) => {
        resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) reject(err || `No host found for domain: ${domain}`);
            else resolve(addresses);
        });
    });
}

function checkEmail(params: Config): Promise<Response> {
    return new Promise((resolve, reject) => {
        const CARRIGE_RETURN: string = '\r\n';
        const defaultMxRecord: MxRecord = { exchange: 'no exchange server', priority: 0 };
        const { addresses, email, fromErmail, timeout } = params;
        const fromHost = fromErmail.split('@')[1];

        const smtpHost: MxRecord = addresses?.sort((first, second) => first.priority - second.priority)[0] || defaultMxRecord;

        const commands: Command[] = [
            { cmd: `HELO ${fromHost}`, executed: false },
            { cmd: `MAIL FROM:<${fromErmail}>`, executed: false },
            { cmd: `RCPT TO:<${email}>`, executed: false },
            { cmd: `QUIT`, executed: false }
        ].map(x => {
            x.cmd += CARRIGE_RETURN;
            return x;
        });

        const socket = new Socket();
        const commandState: CommandState = { current: null };

        const errorHandler = (errorType: string) => (error: Error): void => {
            reject({ error, errorType });
        };

        const writeNextCommand = (): void => {
            const command: Command = commands.find(x => !x.executed) || { cmd: 'No command', executed: false };
            if (command) {
                socket.write(command.cmd);
                command.executed = true;
                commandState.current = command;
            }
        }

        const quit = (success: boolean, error: string): void => {
            const quitCommand = commands[commands.length - 1];
            socket.write(quitCommand.cmd);
            socket.end();
            socket.destroy();
            resolve({ success, error });
        }

        const onDataRecieved = (data: string | Buffer): void => {
            if (data.toString()[0] !== '2')
                quit(false, [commandState.current?.cmd, data].join('\n'));
            else if (commands.filter(x => x.executed).length === 3)
                quit(true, '');
            writeNextCommand();
        }

        // socket.setEncoding('utf8'); // should be ascii or utf8 in order to recieve data as string
        socket.setTimeout(timeout || 5000);

        socket.on('error', errorHandler('error'));
        socket.on('timeout', errorHandler('timeout'));
        // socket.on('connect', writeNextCommand);

        socket.on('data', onDataRecieved);

        socket.connect(25, smtpHost.exchange);
    });
}
