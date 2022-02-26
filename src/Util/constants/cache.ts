import { instances } from "./instances";
import { ban, muted } from "./moderationDataManager";

export interface cacheStructure {
    test: boolean // if the bot is in test mode or not.
    muted: muted[]; // the muted users.
    warns: cachedWarn[];
    bans: ban[];
    instances: instances;
}

export interface cachedWarn {
    id: string;
    case: string;
    expiration: number;
}

export type cachetype = "test" | "warns" | "muted" | "instances"; 