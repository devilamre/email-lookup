/// <reference types="node" />
import { Config } from './@types/Config';
import { Response } from './@types/Response';
import { MxRecord } from 'dns';
export declare function verify(params: Config): Promise<Response>;
export declare function verifyExistence(email: string): Promise<Response>;
export declare function resolveExchangeServers(domain: string): Promise<MxRecord[]>;
