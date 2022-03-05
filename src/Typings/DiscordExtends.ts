import { Client, WebSocketManager } from "discord.js";
import { JsonDB } from "node-json-db";
import * as Sentry from "@sentry/node";
import {config} from "../config";

export interface FYPBot {
    completeClient: Client,
    WS: WebSocketManager,
    sentry: typeof Sentry
    cache: JsonDB,
    DB: undefined
    config: typeof config
}