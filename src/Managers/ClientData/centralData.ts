// @ts-nocheck

import { Client } from "discord.js"
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import Captain from "captainjs"
import { FYPBot } from "../../Typings/DiscordExtends";
import { config } from "../../config";


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
     * @method The central start data.
     */

    async centralData() {
        const client = await this.makeClient()
        const cache = await this.makeCache()
        const consola = await this.makeConsola()
        const errors = await this.catchErrors()
        const ready = await client.client.login(this.process.env.TOKEN)

        return {
            completeClient: client.client,
            WS: client.client.ws,
            cache: cache,
            DB: undefined,
            config: config
        } as FYPBot
    }
}


export default clientConstructor