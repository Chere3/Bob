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
import handlers from "./handler";


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
            global.consola.error(a)
        });

        this.process.on("uncaughtException", async (a) => {
            global.consola.error(a.name);
            global.consola.error(a.message);
            console.error(a.stack);
        });

        this.process.on('unhandledRejection', async (a) => {
            global.consola.error(a)
        })
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
     * @method Makes the command and get up to the collections
     */

    async makeHandler(client: Client) {
        handlers(client)
        global.consola.log(`| Putted all the commands in collection |`)
    }

    /**
     * @method The central start data.
     */

    async centralData() {
        const client = await this.makeClient()
        const cache = await this.makeCache()
        const db = await this.makeDB()
        const sentry = await this.makesSentry()
        const handler = await this.makeHandler(client)
        const errors = await this.catchErrors()
        const ready = await client.client.login(this.process.env.TOKEN)

        const catcher = Sentry.startTransaction({
            op: "centralCatcher",
            name: "centralError"
        })

        global.consola.log("| Central Error catcher initialited |")

        return {
            completeClient: client.client,
            gateaway: client.client.ws,
            sentry: sentry,
            catcher: catcher,
            cache: cache,
            database: db,
            config: config
        } as FYPBot
    }
}


export default clientConstructor