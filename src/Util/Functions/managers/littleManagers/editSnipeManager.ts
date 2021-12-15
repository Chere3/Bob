import { Message } from "discord.js";
import { getDBChannel } from "../channelManager";
import { uploadImageToA } from "./snipeManager";
import { checkImage } from "./socialCommandsManager";
import { channelModel, DBChannel } from "../../../../Database/schemas/Channel";

/**
 * @function getAttachments - Get the attachments of the edited message.
 * @param {Message} message - The message to be checked.
 * @param {Message} editedMessage - The edited message.
 * @returns {Promise<Array<Attachment>>} - Returns an array of attachments.
 * @author Cheree
 * @version 1.0.0
 * @example
 * getAttachments(message, editedMessage);
 */

export async function getAttachments(message: Message, editedMessage: Message) {
  if (message.attachments.size == 0 && editedMessage.attachments.size == 0)
    return [];
  if (message.attachments.size == editedMessage.attachments.size) return [];

  const attachments = message.attachments.map((attachment) => attachment);
  const editedAttachments = editedMessage.attachments.map(
    (attachment) => attachment
  );

  var array = [];

  for (const attachment of attachments) {
    if (
      editedAttachments.find(
        (editedAttachment) => editedAttachment.proxyURL == attachment.proxyURL
      )
    ) {
    } else {
      try {
        await checkImage(attachment.url);
        const image = await uploadImageToA(attachment.proxyURL);

        array.push(image.url);
      } catch (error) {
        array.push(attachment.proxyURL);
      }
    }
  }

  return array;
}

/**
 * @function detectAndMoveEmbrds - Detects and moves embeds from the message to the bots
 * @param {Message} message - The message to be checked.
 * @param {Message} editedMessage - The edited message.
 * @returns {Promise<void>} - Returns a promise that resolves when the embeds have been moved.
 * @author Cheree
 * @version 1.0.0
 * @example
 * detectAndMoveEmbeds(message, editedMessage);
 */

export async function detectAndMoveEmbeds(
  message: Message,
  editedMessage: Message
) {
  if (message.embeds.length == 0 && editedMessage.embeds.length == 0) return [];

  var array = [];
  const embeds = message.embeds.map((embed) => embed);
  const editedEmbeds = editedMessage.embeds.map((embed) => embed);

  for (const embed of embeds) {
    if (editedEmbeds.find((editedEmbed) => editedEmbed == embed)) {
    } else {
      array.push(embed);
    }
  }

  return array;
}

/**
 * @method addSnipe | Añade un snipe a la base de datos de los snipes editados.
 * @param {Message} message - El mensaje donde el usuario puso el mensaje.
 * @param {Message} editedMessage - El mensaje editado.
 * @returns {Promise<void>} - Returns a promise that resolves when the snipe has been deleted.
 * @author cheree
 * @version 1.0.0
 * @example
 * addSnipe(message);
 */

export async function addSnipe(message: Message, editedMessage: Message) {
  const channel = await getDBChannel(message.channel.id);
  const attachments = await getAttachments(message, editedMessage);
  const embeds = await detectAndMoveEmbeds(message, editedMessage);

  const array = [];

  for (const snipe of channel.editsnipes) {
    array.push(snipe);
  }

  await array.unshift({
    messageID: message.id,
    messageAuthor: message.member.nickname || message.member.user.username,
    messageAuthorAvatar: message.author.avatarURL(),
    messageContent: message.content,
    messageAttachments: attachments,
    messageEmbeds: embeds,
    messageTimestamp: message.createdTimestamp,
  });

  return channelModel.findOneAndUpdate(
    { id: message.channel.id },
    { editsnipes: array }
  );
}

export async function deleteSnipe(message: Message) {
  const channel = await getDBChannel(message.channel.id);
  const array = [];

  if (channel == undefined) return;

  for (const snipe of channel.editsnipes) {
    array.push(snipe);
  }

  if (array.length == 24) {
    array.pop();
  } else if (array.length > 24) {
    while (array.length > 24) {
      array.pop();
    }
  }

  return channelModel.findOneAndUpdate(
    { id: message.channel.id },
    { editsnipes: array }
  );
}

export async function editSnipeCore(message: Message, editedMessage: Message) {
  await deleteSnipe(message).catch((error) => console.log(error));
  return (await addSnipe(message, editedMessage)) as DBChannel;
}
