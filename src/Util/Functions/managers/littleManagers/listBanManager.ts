import { BanOptions, GuildBan, Message, TextChannel } from 'discord.js';

/**
 * @function formatBans - Formats the bans in a list.
 * @param {Message} message - The message object.
 * @author Cheree
 * @version 1.0.0
 * @returns {array} - The formatted list of bans separated for each 10 bans.
 */

export async function formatBans(message: Message) {
  const array = [];

  const bans = await message.guild.bans.fetch();

  // for each ten bans, push a part of the list of bans to the array.
  // the list have, user id, and reason of the ban in a string.

    for (let i = 0; i < bans.size; i += 15) {
        const temp = [];
        for (let j = i; j < i + 15; j++) {
            if (j < bans.size) {
                temp.push(`${bans.map(x => x)[j].user.id} - ${bans.map(x => x)[j].reason}`);
            }
        }
        array.push(temp);
    }


  return array;
}

/**
 * @function updateListWithNewBan - Updates the list of bans with a new ban.
 * @param {GuildBan} ban - The ban object.
 * @return {Promise<Message>} - The edited message or the new message.
 * @author Cheree
 * @version 1.0.0
 */

export async function updateListWithNewBan(ban: GuildBan) {
    // Search the message with the list of bans in the especific channel.
    const channel = await (await ban.guild.channels.cache.find(x => x.name === 'bans')) as TextChannel;
    
    // Filter the messages with the list of bans, filtering the author and the content of the embeds of that messages.
    const messages = await channel.messages.cache.filter(x => x.embeds.length > 0 && x.embeds[0].author.name.includes('Lista de baneos'));

    // get the messages of list of bans, this messages, check the content of description of embeds, with regex check how many bans are in the list.
    // if have more of 15 bans, the message will be created with the new ban if not, the message will be edited.
    const listMessages = await messages.map(async x => {
        const bans = x.embeds[0].description.match(/\d{18}/g);
        if (bans !== null && bans.length > 15) {
            return await x.edit(`a`)
        }})
}
