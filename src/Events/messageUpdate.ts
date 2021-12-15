import { Client, Message } from 'discord.js';
import { editSnipeCore } from '../Util/Functions/managers/littleManagers/editSnipeManager';
export const run = async (client: Client, message: Message, editedMessage: Message) => {
    if (message.author.bot) return;
    editSnipeCore(message, editedMessage);
}