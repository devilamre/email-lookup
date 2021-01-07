import { MxRecord } from 'dns';

export interface Config {
    email: string,
    addresses?: MxRecord[],
    fromErmail: string,
    timeout: number
}

export const DefaultConfig: Config = { email: 'Larry.Page@google.com', fromErmail: 'Sergey.Brin@google.com', timeout: 5000 }
