import { Client, Message } from 'discord.js';
import { getTestMode } from '../../Util/managers/littleManagers/cacheManager';
import { snipeCore } from '../../Util/managers/littleManagers/snipeManager';
export const run =async  (bot: Client, message: Message) => {
    if (message.author.bot) return;
    if (message.partial) message.fetch();
    if (message.channel.type === 'DM') return;

    await snipeCore(message);
}