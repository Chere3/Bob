import { Client, Message } from 'discord.js';
import { getTestMode } from '../Util/Functions/managers/littleManagers/cacheManager';
import { snipeCore } from '../Util/Functions/managers/littleManagers/snipeManager';
export const run =async  (bot: Client, message: Message) => {
    if (getTestMode() == true) return;
    if (message.author.bot) return;
    if (message.partial) message.fetch();
    if (message.channel.type === 'DM') return;

    await snipeCore(message);
}