import { Message, MessageEmbed } from "discord.js";
import superagent from "superagent";

/**
 * @method cooldownCleverBot - El encargado de organizar todo lo que sería el tema de cleverbot dentro del bot.
 * @param {Message} message - El mensaje donde el usuario puso el mensaje.
 * @return {boolean} false si el usuario no tiene cooldown, error si si tiene el cooldown y ha sido detectado en él.
 * @example
 * cooldownClverbot(message);
 */

export function cooldownCleverBot(message: Message) {
  // Create a cooldown using the discord.js collections and user id
  const cooldown = message.client.cleverCooldown.has(message.author.id);

  if (cooldown == true) {
    return true;
  } else {
    return createCooldown(message);
  }
}

/**
 * @function createCooldown - Crea un cooldown para el usuario.
 * @param {Message} message - El mensaje donde el usuario puso el mensaje.
 * @return {Collection} La coleccion de cooldowns.
 * @example
 * createCooldown(message);
 */

export function createCooldown(message: Message) {
  message.client.cleverCooldown.set(message.author.id, Date.now());

  setTimeout(async () => {
    message.client.cleverCooldown.delete(message.author.id);
    await (await message.channel.messages.fetch())
      .filter((x) => x.embeds[0]?.author?.name == "¡Espera humano!")
      .map((x) => x.delete().catch(() => {}));
  }, 2500);
}

/**
 * @method MasterCleverbot - Crea lo que sería el cleverbot y hace todas las conexiones para su representación.
 * @param {Message} message - El mensaje donde el usuario puso el mensaje.
 * @return {Message} El mensaje de respuesta.
 * @example
 * MasterCleverbot(message);
 */

export async function MasterCleverbot(message: Message) {
  await message.channel.fetch();

  const embed = new MessageEmbed()
    .setDescription(
      `Debes de esperar algo de tiempo.. no quieres que explote, ¿o si? 🙄`
    )
    .setColor(`ORANGE`);

  if ((cooldownCleverBot(message) as any) == true) {
    return message.reply({ embeds: [embed.setAuthor("¡Espera humano!")] });
  } else {
    cooldownCleverBot(message);
    const text = await getCleverbot(message.content);

    if (text == " ")
      return message.reply({
        embeds: [
          embed.setDescription(`¡Humano!, deja de mandar cosas raras! 😭🙄`),
        ],
      });

    return message.reply({
      embeds: [embed.setDescription(text)],
    });
  }
}

/**
 * @method Formatea el texto que se le da para que sea mas legible a cleverbot.
 * @param {string} text
 * @returns {string}
 */

export function formatText(text: string) {
  // replace discord emojis
  text = text.replace(/<a?:(.*?):(\d{17,19})>/g, "$1");
  // replace emojis
  text = text.replace(
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
    ""
  );
  // replace discord mentions
  text = text.replace(/<@!?[0-9]{18}>/g, "");
  // replace discord roles
  text = text.replace(/<@&[0-9]{18}>/g, "");
  // replace discord channels
  text = text.replace(/<#[0-9]{18}>/g, "");
  // ignore accents
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return text;
}

/**
 * @method getCleverbotText Obtiene una respuesta de cleverbot al mensaje que se le da.'
 * @param {string} text
 * @returns {Promise<string>}
 * @example
 * getCleverbotText('Hola')
 */

export async function getCleverbot(text: string) {
  const texto = formatText(text);
  const a = await superagent
    .get(`https://apiv2.spapi.ga/misc/clever?text=${texto}`)
    .catch((a) => {
      throw Error(a);
    });

  return a.body.response || " ";
}
