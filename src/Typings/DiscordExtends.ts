import { Client, WebSocketManager } from "discord.js";
import { JsonDB } from "node-json-db";
import {config} from "../config";

export interface FYPBot {
    completeClient: Client,
    WS: WebSocketManager,
    cache: JsonDB,
    DB: undefined
    config: typeof config
}