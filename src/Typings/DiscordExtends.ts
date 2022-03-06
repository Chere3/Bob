import { Client, WebSocketManager } from "discord.js";
import { JsonDB } from "node-json-db";
import * as Sentry from "@sentry/node";
import {config} from "../config";
import mongoose from "mongoose";
import { Transaction } from "@sentry/tracing";

export interface FYPBot {
    completeClient: Client,
    WS: WebSocketManager
    sentry: typeof Sentry
    catcher: Transaction
    cache: JsonDB
    DB: typeof mongoose
    config: typeof config
}

export interface cooldownCommand {
    command: string,
}