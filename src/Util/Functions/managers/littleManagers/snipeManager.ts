import { Message, MessageSelectMenu, MessageActionRow } from 'discord.js';
import superagent from "superagent";
import { imageAPI } from '../../../constants/imagesDB';
import { getDBChannel } from "../channelManager";
import { checkImage } from "./socialCommandsManager";
import { channelModel, snipes, DBChannel } from '../../../../Database/schemas/Channel';

/**
 * @function detectAndMoveImages - Detects and moves images from the message to the bot's image folder.
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the images have been moved.
 * @author Seth Hollingsead
 * @version 1.0.0
 * @example
 * detectAndMoveImages(message);
 */

export async function detectAndMoveImages(message: Message) {
  if (message.attachments.size == 0 && message.embeds.length == 0) return [];

  var array = []
  const attachments = message.attachments.map(attachment => attachment);
  const embeds = message.embeds.filter(embed => embed.type == "image");

  for (const embed of embeds) {
    array.push(embed.url);
  }

    for (const attachment of attachments) {
        try {
        await checkImage(attachment.proxyURL)
        const image = await uploadImageToA(attachment.proxyURL)

        array.push(image.url)
        } catch (error) {
            array.push(attachment.proxyURL)
        } 
    }

    return array
}

/**
 * @function detectAndMoveStickers - Detects and moves stickers from the message to the bot's image folder.
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the stickers have been moved.
 * @author Cheree
 * @version 1.0.0
 * 
 */

export async function detectAndMoveStickers(message: Message) {
    if (message.stickers.size == 0) return [];
    
    var array = []
    const stickers = message.stickers.map(attachment => attachment);
    
    for (const sticker of stickers) {
        try {
            await sticker.fetch()
        await checkImage(sticker.url)
        const image = await uploadImageToA(sticker.url)
    
        array.push(image.url)
        } catch (error) {
        array.push(sticker.url)
        }
    }
    
    return array
}

/**
 * @function detectEmbeds - Detects and moves embeds from the message to the bots
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the embeds have been moved.
 * @author Cheree
 * @version 1.0.0
 * @example
 * detectEmbeds(message);
 */

export function detectEmbeds(message: Message) {
    if (message.embeds?.length == 0) return [];
    return message.embeds
}

/**
 * @function uploadImageToAPI - Uploads images to the API.
 * @param {string} imageURL - The image URL to be uploaded.
 * @returns {Promise<void>} - Returns a promise that resolves when the image has been uploaded.
 * @author Cheree
 * @version 1.0.0
 * @example
 * uploadImageToAPI(imageURL);
 */

export async function uploadImageToA(imageURL: string) {
  try {
      const a = await superagent.get(
        `https://api.imgbb.com/1/upload?key=${process.env.API_IMGS}&image=${imageURL}`
      )
    return a.body.data as imageAPI
  } catch (error) {
    throw error;
  }
}

/**
 * @method addSnipe - Adds a snipe to the database of that channel.
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been added.
 * @author cheree
 * @version 1.0.0
 * @example
 * addSnipe(message);
 */

export async function addSnipe(message: Message) {
  const channel = await getDBChannel(message.channel.id);
  const attachments = await detectAndMoveImages(message);
  const stickers = await detectAndMoveStickers(message);

  const array = []

  for (const snipe of channel.snipes) {
    array.push(snipe)
  }
  
  await array.unshift({
    messageID: message.id,
    messageAuthor: message.member.nickname || message.author.username,
    messageAuthorAvatar: message.author.displayAvatarURL(),
    messageContent: message.content,
    messageAttachments: attachments,
    messageEmbeds: detectEmbeds(message),
    messageStickers: stickers,
    messageTimestamp: message.createdTimestamp,
  })

  return channelModel.findOneAndUpdate({id: message.channel.id}, {snipes: array})
}

/**
 * @function deleteLastSnipe - Deletes the last snipe in the database of that channel.
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
 * @author cheree
 * @version 1.0.0
 * @example
 * deleteLastSnipe(message);
 */

export async function deleteLastSnipe(message: Message) {
  const channel = await getDBChannel(message.channel.id);
  const array = []

  for (const snipe of channel.snipes) {
    array.push(snipe)
  }

  if (array.length == 24) {
    array.pop()
  } else if (array.length > 24) {
    // if have more of 26 snipes, deletes the values from the array until I get to 25 again
    while (array.length > 24) {
      array.pop()
    }

    return channelModel.findOneAndUpdate({id: message.channel.id}, {snipes: array})
  }
}

/**
 * @method snipeCore - The core of the snipe command.
 * @param {Message} message - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
 * @author cheree
 * @version 1.0.0
 * @example
 * snipeCore(message);
 */

export async function snipeCore(message: Message) {
  await deleteLastSnipe(message);
  return await addSnipe(message) as DBChannel;
}

/**
 * @method moab - Borra TODOS los snipes de un canal.
 * @param {Message} id  - The message to be checked.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
 * @author cheree
 * @version 1.0.0
 */

export async function moab(id: string) {
  const channel = await getDBChannel(id);
  const array = []
  return channelModel.findOneAndUpdate({id: id}, {snipes: array})
}

/**
 * @function combineAll - Combines all the attachments, stickers into one array.
 * @param {string[]} stickerArray - The array of stickers.
 * @param {string[]} imageArray - The array of images.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
 * @author cheree
 * @version 1.0.0
 * @example
 * combineAll(stickerArray, imageArray);
 */

  export function combineAll(stickerArray: string[], imageArray: string[]) {
    var array = []
    for (const sticker of stickerArray) {
      array.push(sticker)
    }
    for (const image of imageArray) {
      array.push(image)
    }
    return array
  }

  /**
   * @method constructMenu - Constructs the menu for the snipe command.
   * @param {Message} message - The message to be checked.
   * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
   * @author cheree
   * @version 1.0.0
   * @example
   * constructMenu(message);
   */

  export async function constructMenu(message: Message) {
    const channel = await (await getDBChannel(message.channel.id)).snipes
    const array = []


    var page = 0;

    for (const snipe of channel) {
      page = page + 1
      const valor = {
        label: `${page} - ${snipe.messageAuthor}`,
        description: `${snipe.messageContent?.slice(0, 30) || snipe.messageAttachments[0]?.slice(0, 30) || snipe.messageStickers[0]?.slice(0, 30) || "."}... `,
        value: `${page - 1}`
      }

      array.push(valor)
    }

    while (array.length > 24) {
      array.pop()
    }

    const menu = new MessageSelectMenu().addOptions(array).setCustomId("si").setPlaceholder(`Selecciona un mensaje`)

    const action = new MessageActionRow().addComponents(menu)

    return action

  }

