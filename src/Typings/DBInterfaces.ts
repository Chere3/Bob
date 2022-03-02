import { MessageEmbed } from "discord.js";

export interface snipes {
    messageID: string
    messageAuthor: string
    messageAuthorAvatar: string
    messageContent: string | null
    messageAttachments: string[] | []
    messageEmbeds: MessageEmbed[] | []
    messageTimestamp: number
    messageStickers: string[]
}

export interface editsnipes {
    messageID?: string
    messageAuthor?: string
    messageAuthorAvatar?: string
    messageContent?: string
    messageAttachments?: string[] | [] | null
    messageLink?: string
    messageEmbeds?: MessageEmbed[] | [] | null
    messageTimestamp?: number
    messageStickers?: string[] | [] | null
}

export interface DBChannel {
    id: string
    registeredAt: number
    snipes: snipes[] | []
    editsnipes: editsnipes[] | []
}

export interface social {
    hugs: number
    kisses: number
    pats: number
    happy: number
    sad: number
    angry: number
    love: number
    hate: number
    confused: number
    bored: number
    scared: number
    fucks: number
    licks: number
    sucks: number
}
