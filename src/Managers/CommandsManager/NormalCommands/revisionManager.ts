import { Client } from "discord.js"
import { Message, MessageEmbed } from "discord.js"
import emojis from "../../../assets/emojis"
import roles from "../../../assets/roles"
import {config} from "../../../config"

export interface kargs {
    name: string,
    infoCommandOptions?: infoCommandOptions,
    commandOptions?: commandOptions,
    channelAndGuildOptions?: channelAndGuildOptions
}

interface channelAndGuildOptions {
    onlyGuild?: boolean
    nsfw?: boolean
    lowStaff?: boolean
    mediumStaff?: boolean
    highStaff?: boolean
    developer?: boolean
}

interface commandOptions {
    aliases?: string[],
    status?: boolean,
    expectedArgs: number,
    expectedArgsMin: number,
    cooldown?: number
}

interface infoCommandOptions {
    usage: string,
    examples: string[],
    description: string,
}

/**
 * The main class of the revision of the commands.
 */

export class revisionManager {
    client: Client
    config: typeof config
    name: string
    infoOptions: infoCommandOptions
    commandOptions: commandOptions
    channelAndGuildOptions: channelAndGuildOptions
    /**
     * The constructor of the revision of the commands.
     */

    constructor(client: Client, kargs: kargs) {
        this.client = client;
        this.config = config
        this.name = kargs.name;
        this.infoOptions = kargs.infoCommandOptions;
        this.commandOptions = kargs.commandOptions;
        this.channelAndGuildOptions = kargs.channelAndGuildOptions;
    }

    async revision(message: Message) {
        /**
         * @constant de - The default embed to send errors or warnings.
         */

        function de(text: string) {return message.reply({embeds: [new MessageEmbed().setDescription(`${emojis.internal_error} __***${de}***__`).setColor(`PURPLE`)]})}

        // Estable options to skip errors.
        if (!this.name) throw TypeError(`[OB] El nombre del comando no puede estar vacío.`);
        if (!this.infoOptions.description) throw TypeError(`[OB] La descripción del comando no puede estar vacía.`);
        if (!this.infoOptions.usage) throw TypeError(`[OB] El uso del comando no puede estar vacío.`);
        if (!this.infoOptions.examples[0]) throw TypeError(`[OB] Los ejemplos del comando no pueden estar vacíos.`);

        // Guild Options
        if (this.channelAndGuildOptions.developer && config.bot.owner !== message.author.id) return de(`Este comando es exclusivo para mis programadores.`);
        if (this.channelAndGuildOptions.highStaff && !message.member.roles.cache.has(roles.creator)) {if (!message.member.roles.cache.has(roles.owner)) return de(`Este comando es exclusivo para miembros del staff.`);}
        if (this.channelAndGuildOptions.mediumStaff && !message.member.permissions.has(`MANAGE_GUILD`)) return de(`Este comando es exclusivo para administradores`);
        if (this.channelAndGuildOptions.lowStaff && !message.member.permissions.has(`MANAGE_MESSAGES`)) return de(`Este comando es exclusivo para moderadores`);
        if (this.channelAndGuildOptions.onlyGuild && !message.guild) return de(`Este comando solo puede ser usado en un servidor.`);
        //@ts-expect-error
        if (this.channelAndGuildOptions.nsfw && !message.channel.nsfw) return de(`Este comando solo puede ser usado en un canal NSFW.`);

        // Command Options
        if (this.commandOptions.expectedArgsMin > this.commandOptions.expectedArgs) throw TypeError(`El número de argumentos es incorrecto.`);
        if (this.commandOptions.expectedArgsMin > 0 && message.content.split(` `).slice(1).length < this.commandOptions.expectedArgsMin) return message.reply({embeds: [new MessageEmbed().setDescription(`${emojis.internal_error} __***Este comando necesita de más argumentos***__\n\n\`\`\`${this.infoOptions.usage}\n${this.infoOptions.examples.map(x => `${x}\n`)}\`\`\``).setColor(`PURPLE`)]});
        if (this.commandOptions.status && config.bot.owner !== message.author.id) return de(`Este comando está en desarrollo.`);
        if (this.commandOptions.cooldown && this.commandOptions.cooldown > 0 && config.bot.owner !== message.author.id) {
            const cooldown = this.commandOptions.cooldown;
            const cooldowns = this.client.cooldowns.get(message.author.id);
            if (cooldowns) {if (cooldowns.command !== this.name) {this.client.cooldowns.set(message.author.id, {command: this.name});
            setTimeout(() => {
                        this.client.cooldowns.delete(message.author.id);
                    }, cooldown * 1000);
                } else {
                    return de(`Este comando esta en cooldown, espera aaa.`);
                }
            }
        }

        return true;
    }
}


/**
 * The constructor of the commands.
 */
export class botCommand {
    name: string
    infoCommandOptions: infoCommandOptions
    commandOptions: commandOptions
    channelAndGuildOptions: channelAndGuildOptions

    /**
     * @typedef {Object} botCommandOptions - The options for the command.
     * @property {string} name - The name of the command.
     * @property {infoCommandOptions} infoCommandOptions - The info of the command.
     * @property {commandOptions} commandOptions - The options of the command.
     * @property {channelAndGuildOptions} channelAndGuildOptions - The options of the channel and guild.
     */

    /**
     * @param {kargs} options - The options of the command.
     */

    constructor(data = {} as kargs) {
        this.setup(data)
    }
    
    /**
     * @method setup - Sets up the command.
     * @param {kargs} options - The options of the command.
     */
    setup(data) {
        const d = data as kargs;
        /**
         * The name of the command
         * @type {string}
         */

        this.name = d.name ?? null;

        /**
         * The description of the command
         * @type {string}
         */

        this.infoCommandOptions.description = d.infoCommandOptions.description ?? null;

        /**
         * The usage of the command
         * @type {string}
         */

        this.infoCommandOptions.usage = d.infoCommandOptions.usage ?? null;

        /**
         * The examples of the command
         * @type {string[]}
         */

        this.infoCommandOptions.examples = d.infoCommandOptions.examples ?? null;

        /**
         * The aliases of the command
         * @type {string[]}
         */

        this.commandOptions.aliases = d.commandOptions.aliases ?? [];

        /**
         * The status of the command
         * @type {boolean}
         */

        this.commandOptions.status = d.commandOptions.status ?? false;

        /**
         * The expected args of the command
         * @type {number}
         */

        this.commandOptions.expectedArgs = d.commandOptions.expectedArgs ?? 0;

        /**
         * The expected args min of the command
         * @type {number}
         */

        this.commandOptions.expectedArgsMin = d.commandOptions.expectedArgsMin ?? 0;

        /**
         * The cooldown of the command
         * @type {number}
         */

        this.commandOptions.cooldown = d.commandOptions.cooldown ?? 10;

        /**
         * The only guild of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.onlyGuild = d.channelAndGuildOptions.onlyGuild ?? true;

        /**
         * The nsfw of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.nsfw = d.channelAndGuildOptions.nsfw ?? false;

        /**
         * The low staff of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.lowStaff = d.channelAndGuildOptions.lowStaff ?? false;

        /**
         * The medium staff of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.mediumStaff = d.channelAndGuildOptions.mediumStaff ?? false;

        /**
         * The high staff of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.highStaff = d.channelAndGuildOptions.highStaff ?? false;

        /**
         * The developer of the command
         * @type {boolean}
         */

        this.channelAndGuildOptions.developer = d.channelAndGuildOptions.developer ?? false;
    }

    /**
     * Set the name of the command.
     * @param {string} name - The name of the command.
     * @returns {this} - The command.
     */

    setName(name: string) {
        this.name = name;
        return this;
    }

    /**
     * Set the info of the command.
     * @param {infoCommandOptions} infoCommandOptions - The info of the command.
     */

    setInfoOptions(infoCommandOptions: infoCommandOptions) {
        this.infoCommandOptions = infoCommandOptions;
        return this;
    }

    /**
     * Set the options of the command.
     * @param {commandOptions} commandOptions - The options of the command.
     */

    setCommandOptions(commandOptions: commandOptions) {
        this.commandOptions = commandOptions;
        return this;
    }

    /**
     * Set the options of the channel and guild.
     * @param {channelAndGuildOptions} channelAndGuildOptions - The options of the channel and guild.
     * @returns {this} - The command.
     * @memberof botCommand
     */

    setChannelAndGuildOptions(channelAndGuildOptions: channelAndGuildOptions) {
        this.channelAndGuildOptions = channelAndGuildOptions;
        return this;
    }

    /**
     * Get the json data of the command
     * @returns {object} - The json data of the command.
     */
    
    toJSON() {
        return {
            name: this.name,
            infoOptions: this.infoCommandOptions && {
                description: this.infoCommandOptions.description,
                usage: this.infoCommandOptions.usage,
                examples: this.infoCommandOptions.examples,
            },
            commandOptions: this.commandOptions && {
                aliases: this.commandOptions.aliases,
                status: this.commandOptions.status,
                expectedArgs: this.commandOptions.expectedArgs,
                expectedArgsMin: this.commandOptions.expectedArgsMin,
                cooldown: this.commandOptions.cooldown,
            },
            channelAndGuildOptions: this.channelAndGuildOptions && {
                onlyGuild: this.channelAndGuildOptions.onlyGuild,
                nsfw: this.channelAndGuildOptions.nsfw,
                lowStaff: this.channelAndGuildOptions.lowStaff,
                mediumStaff: this.channelAndGuildOptions.mediumStaff,
                highStaff: this.channelAndGuildOptions.highStaff,
                developer: this.channelAndGuildOptions.developer,
            }
        }
    }
}