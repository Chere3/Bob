import { Client } from 'discord.js';
import { banManager } from '../../Util/managers/moderationManager';
export const run = async (Bot:Client, timestamp:number) => {
    await new banManager(null, Bot.guilds.cache.get("912858763126538281").me, `Automoderador: El tiempo del ban se acabó.`).automaticUnban();
}