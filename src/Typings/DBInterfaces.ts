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

export interface DBUser {
    id: string
    registeredAt: number
    social: social
}

export interface images {
    id: string,
    hug: string[],
    kiss: string[],
    pats: string[],
    happy: string[],
    sad: string[],
    angry: string[],
    love: string[],
    hate: string[],
    confused: string[],
    bored: string[],
    scared: string[],
    fucks: string[],
    licks: string[],
    sucks: string[]
}

export interface descriptions {
    id: string,
    hug: string[],
    kiss: string[],
    pats: string[],
    happy: string[],
    sad: string[],
    angry: string[],
    love: string[],
    hate: string[],
    confused: string[],
    bored: string[],
    scared: string[],
    fucks: string[],
    licks: string[],
    sucks: string[]
}

