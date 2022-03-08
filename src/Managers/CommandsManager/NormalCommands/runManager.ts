import { Client, Message, MessageEmbed } from "discord.js";
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

    get reply() {
        return this.message.reply
    }

    get send() {
        return this.message.channel.send
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