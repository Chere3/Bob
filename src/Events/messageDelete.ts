import { Client, Message } from 'discord.js';
import { snipeCore } from '../Util/Functions/managers/littleManagers/snipeManager';
export const run =async  (bot: Client, message: Message) => {
    if (message.author.bot) return;
    if (message.partial) message.fetch();
    if (message.channel.type === 'DM') return;

    await snipeCore(message);
}