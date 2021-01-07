/// <reference types="node" />
import { MxRecord } from 'dns';
export interface Config {
    email: string;
    addresses?: MxRecord[];
    fromErmail: string;
    timeout: number;
}
export declare const DefaultConfig: Config;
