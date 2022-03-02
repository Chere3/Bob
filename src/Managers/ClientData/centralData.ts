import { Client } from "discord.js"
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import Captain from "captainjs"


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

        const data = {
            client: discordJSClient
        }

        return data
    }

    /**
     * @method Makes the bot cache.
     */

    makeCache() {
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
            global.prettyConsole.error(a)
        })
    }

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
        })

        return global.consola
    }


}