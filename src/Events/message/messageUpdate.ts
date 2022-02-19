import { Client, Message } from 'discord.js';
import { getTestMode } from '../../Util/managers/littleManagers/cacheManager';
import { editSnipeCore } from '../../Util/managers/littleManagers/editSnipeManager';
export const run = async (client: Client, message: Message, editedMessage: Message) => {
    if (getTestMode() == true) return;
    if (message.partial) message.fetch();
    if (message.author.bot) return;
    if (getTestMode() == true) return;
    editSnipeCore(message, editedMessage);
}