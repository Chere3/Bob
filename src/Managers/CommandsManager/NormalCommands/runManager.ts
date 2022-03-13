import { Client, Message, MessageActionRow, MessageButton, MessageEmbed, MessageOptions, MessagePayload, ReplyOptions } from "discord.js";
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

    get defaultPaginator() {
        const b1 = new MessageButton().setCustomId(`right`).setEmoji(emojis.right_arrow).setStyle(`SECONDARY`)
        const b2 = new MessageButton().setCustomId(`left`).setEmoji(emojis.left_arrow).setStyle(`SECONDARY`);
        const b3 = new MessageButton().setCustomId(`B`).setEmoji(emojis.rs_inivisble).setStyle(`SECONDARY`).setLabel(`.`).setDisabled(true);
        const b4 = new MessageButton().setCustomId(`A`).setEmoji(emojis.rs_inivisble).setStyle(`SECONDARY`).setLabel(`.`).setDisabled(true);

        return new MessageActionRow().addComponents(b1, b3, b4 ,b2);
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