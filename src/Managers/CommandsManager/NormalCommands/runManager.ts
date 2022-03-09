import { Client, Message, MessageEmbed, MessageOptions, MessagePayload, ReplyOptions } from "discord.js";
import emojis from "../../../assets/emojis";
import { config } from "../../../config";

export class run {
    message: Message
    client: Client
    config: typeof config
    args: string[]
    flags: string[]

    constructor(message: Message) {
        this.message = message
        this.client = message.client
        this.config = config
        this.args = [];
        this.flags = [];
    }

    get channel() {
        return this.message.channel
    }

    get author() {
        return this.message.author
    }

    reply(a: string  | MessagePayload | ReplyOptions) {
        return this.message.reply(a)
    }

    send(a: string | MessagePayload | MessageOptions) {
        return this.message.channel.send(a)
    }

    get guild() {
        return this.message.guild
    }

    get member() {
        return this.message.member
    }

    get members() {
        // @ts-ignore
        return this.message.guild.members.cache
    }

    de(text: string) {return this.message.reply({embeds: [new MessageEmbed().setDescription(`${emojis.internal_error} __***${text}***__`).setColor(`PURPLE`)]})}
}