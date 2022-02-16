import { Client, TextChannel } from 'discord.js';
import { muteManager } from '../../Util/managers/moderationManager';

export const run = async (Bot: Client, timestamp: number) => {
    await new muteManager(null, Bot.guilds.cache.get(`912858763126538281`).me, "El tiempo del mute acabó.").automaticUnmute();
}