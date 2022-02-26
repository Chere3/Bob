import { snipes } from "../../Database/schemas/Channel";
import { modLog, warn } from "../../Database/schemas/User";

export interface instances {
    snipe: snipeInstance[];
    modLog: modLog[];
    warn: warn[];
}

export interface snipeInstance {
    userID: string;
    originalMessage: string;
    repliedMessage: string;
    actualSnipe: number;
    cachedSnipes: snipes[];
}

export interface modlogsInstance {
    userID: string;
    originalMessage: string;
    repliedMessage: string;
    actualModlog: number;
    actualPage: number
    cachedModLogs: modLog[][];
}

export interface warnsInterface {
    userID: string;
    originalMessage: string;
    repliedMessage: string;
    actualWarn: number;
    actualPage: number;
    cacheWarns: warn[][];
}

export type instancesType = "snipe" | "modlog" | "warn";
export const instancesType: instancesType[] = ["snipe", "modlog", "warn"];