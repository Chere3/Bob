// @ts-nocheck

import { Client } from "discord.js"
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import Captain from "captainjs"
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import { FYPBot } from "../../Typings/DiscordExtends";
import { config } from "../../config";
import mongoose from "mongoose";


/**
 * @class clientConstructor - This class construct the client.
 * @param {any} The nodejs process.
 */

export class clientConstructor {

    process: NodeJS.Process

    /**
     * @constructor constructs the client with his constructor
     */

    constructor(process: NodeJS.Process) {
        this.process = process
    }

    /**
     * @method makeClient - Makes the discord.js client.
     */

    makeClient() {
        const discordJSClient = new Client({
            intents: ["DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING","GUILDS","GUILD_BANS","GUILD_EMOJIS_AND_STICKERS","GUILD_INTEGRATIONS","GUILD_INVITES","GUILD_MEMBERS","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","GUILD_PRESENCES","GUILD_VOICE_STATES","GUILD_WEBHOOKS"],
            allowedMentions: {repliedUser: false, parse: ["users"]}
        });

        global.consola.log("| Discord.js client created |")

        const data = {
            client: discordJSClient
        }

        return data
    }

    /**
     * @method Makes the bot cache.
     */

    makeCache() {
        global.consola.log("| Cache created |")
        return new JsonDB(new Config("cache", true, true, "/"))
    }

    /**
     * @method Catchs the errors capted in process.
     */

    catchErrors() {
        this.process.on('rejectionHandled', async (a) => {
            this.makeConsola().error(a)
        });

        this.process.on("uncaughtException", async (a) => {
            this.makeConsola().error(a.name);
            this.makeConsola().error(a.message);
            console.error(a.stack);
        });

        this.process.on('unhandledRejection', async (a) => {
            this.makeConsola().error(a)
        })
    }

    /**
     * @method Creates the global consola.
     */

    makeConsola() {
        global.consola = new Captain.Console({
            use_colors: true,
            debug: false,
            format: "§8[§d%time%§8] [%prefix%§8] §7%message%",
            log_prefix: "§aLog",
            warn_prefix: "§eWarn",
            error_prefix: "§cError",
            info_prefix: "§bInfo",
            debug_prefix: "§bDebug",
        }) as any

        global.consola.log("| Consola created |")

        return global.consola as any
    }

    /**
     * @method Makes the DB.
     */

    async makeDB() {
        global.consola.log("| Connected to the DB |")
        return mongoose.connect(config.authData.DBS.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true})
    }

    /**
     * @method Makes the sentry client.
     */

    async makesSentry() {
        const {version} = require("../../../package.json");

        global.consola.log("| Sentry initialized |")

        Sentry.init({
            dsn: process.env.SENTRY,
            integrations: [
                new Sentry.Integrations.Http({tracing: true}),
                new Tracing.Integrations.Mongo({
                    useMongoose: true
                })
            ],
            tracesSampleRate: 1.0,
            debug: true,
            release: version
        })

        return Sentry
    }

    /**
     * @method The central start data.
     */

    async centralData() {
        const client = await this.makeClient()
        const cache = await this.makeCache()
        const db = await this.makeDB()
        const sentry = await this.makesSentry()
        const consola = await this.makeConsola()
        const errors = await this.catchErrors()
        const ready = await client.client.login(this.process.env.TOKEN)

        return {
            completeClient: client.client,
            gateaway: client.client.ws,
            sentry: sentry,
            cache: cache,
            database: db,
            config: config
        } as FYPBot
    }
}


export default clientConstructor