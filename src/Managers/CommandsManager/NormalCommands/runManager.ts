import { Client, Message } from "discord.js";
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
        return this.member
    }

    get members() {
        return this.guild.members.cache
    }
}