import { Client } from "discord.js";
import { warnManager } from '../../Util/managers/moderationManager';

export const run = async (Bot: Client, timestamp: number) => {
    await new warnManager(null, Bot.guilds.cache.get(`912858763126538281`).me, null, true).automaticWarnDelete()
}