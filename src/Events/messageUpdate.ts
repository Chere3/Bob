import { Client, Message } from 'discord.js';
import { getTestMode } from '../Util/Functions/managers/littleManagers/cacheManager';
import { editSnipeCore } from '../Util/Functions/managers/littleManagers/editSnipeManager';
export const run = async (client: Client, message: Message, editedMessage: Message) => {
    if (message.author.bot) return;
    if (getTestMode() == true) return;
    editSnipeCore(message, editedMessage);
}