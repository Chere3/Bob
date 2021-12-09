import { Channel, Client, GuildMember, Message, TextChannel, ThreadChannel, User, VoiceChannel } from "discord.js";
import superagent from "superagent";
import { findBestMatch } from "./generalUtil";

export interface ApiUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: string | null;
}

/**
 * @function getApiUser Obtiene un usuario de la API de discord.
 * @param query ID del usuario.
 * @returns {ApiUser | null} resultado de la búsqueda, puede ser un usuario o null si no se encuentra ningun usuario.
 * @example
 * getApiuser(`852588734104469535`)
 */

export async function getApiUser(query: string) {
  if (!query || query.length == 0)
    throw TypeError(
      `El segundo argumento tiene que ser una string o número [STRING] or [NUMBER]`
    );

  // Discord ID
  if (!query.match(/\d{16,22}$/gi))
    throw TypeError(`${query} no es un snowflake.`);
  const a = await superagent
    .get(`https://discord.com/api/v9/users/${query}`)
    .set(`Authorization`, `Bot ${process.env.TOKEN}`)
    .then((x) => x.body)
    .catch(() => {
      throw TypeError(`La id que has dado es invalida.`);
    });

  return a;
}

/**
 * @function validate Valida tu versión de discord.js para poder funcionar.
 * @example validate();
 */

export async function validate() {
  try {
    require.resolve("discord.js");
  } catch (error) {
    throw new Error(
      "No se ha encontrado ninguna versión de discord.js en tu carpeta."
    );
  }

  // Check Node.js version.
  let checkNodeJSVersion = require("semver").satisfies(process.version, ">=16");
  if (!checkNodeJSVersion) {
    throw new Error(
      "Necesitas la versión de node 16 o más nueva para poder usar esta función."
    );
  }

  // Check Discord.js version.
  let checkDiscordJSVersion = require("semver").satisfies(
    require(require
      .resolve("discord.js")
      .replace("src/index.js", "package.json")).version,
    ">=13.0.0"
  );
  if (!checkDiscordJSVersion) {
    throw new Error(
      "Necesitas la versión 13 de discord o sus parecidos para poder funcionar"
    );
  }
}

/**
 * @function getPerson Obtiene un usuario del servidor, y si no se encuentra, lo busca en el cliente, y si no se encuentra, lo busca en la API.
 * @param {string} ID El ID del usuario.
 * @param {string} Mencion Mencion del usuario.
 * @param {Client} client El cliente de discord.
 * @returns {User | GuildMember | null} El usuario o miembro del servidor o null si no se encuentra el usuario.
 * @example
 * // Obtiene a la persona del servidor o de la api.
 * const user = await getPerson("ID o Mención", client);
 */

export async function getPerson(person: string, message: Message) {
  var persona: User | null;
  try {
    if (
      person.startsWith("<@!") ||
      (person.startsWith("<@") && person.endsWith(">"))
    ) {
      const id = person.replace(/[<@!>]/g, "");
      const user: User | null = await message.client.users.fetch(`${id}`, {
        force: true,
      });

      persona = user;
    } else if (person.match(/\d{16,22}$/gi)) {
      const user: User | null = await message.client.users.fetch(`${person}`, {
        force: true,
      });

      persona = user;
    }

    // Discord Tag
    else if (person.match(/^.{1,32}(#)+\d{4}$/gim)) {
      let finale = await message.client.users.cache.find(
        (x) => x.tag === person
      );
      persona = finale;
    }

    //Username
    else if (person.match(/^.{1,32}$/gi)) {
      let mappingUsername = await message.client.users.cache
        .map((x) => x.username)
        .filter(function (x) {
          return x != null;
        });
      let similarFound = findBestMatch(person, mappingUsername).bestMatch
        .target;
      let userRegex = new RegExp(similarFound, "i");
      let finale = await message.client.users.cache.find((x) =>
        userRegex.test(x.username)
          ? x.username === similarFound
          : x.username === similarFound
      );
      persona = finale;
    } else {
      persona = message.mentions.repliedUser;
    }
  } catch (error) {
    persona = message.mentions.repliedUser;
  }

  return persona;
}

/**
 * @function getChannel Obtiene un canal del servidor
 * @param {string} ID El ID del canal | Mención del canal | Nombre del canal.
 * @param {Client} client El cliente de discord.
 * @returns {Message | null} El canal o null si no se encuentra el canal.
 * @example
 * // Obtiene un canal del servidor.
 * const channel = await getChannel("ID o Mención", client);
 */

export async function getChannel(channel: string, message: Message) {
var canal: Channel | null;

try {

  // With discord mention.

  if (channel.startsWith("<#") && channel.endsWith(">")) {
    const id = channel.replace(/[<#>]/g, "");
    const canall = await message.client.channels.fetch(id) as TextChannel | VoiceChannel | ThreadChannel;

    canal = canall;


    // Witch discord ID.
  } else if (channel.match(/\d{16,22}$/gi)) {
    const canall = await message.client.channels.fetch(channel) as TextChannel | VoiceChannel | ThreadChannel;

    canal = canall;

    // With channel name
  } else if (channel.match(/^.{1,64}$/gi)) {
    let mappingChannel = await message.client.channels.cache
      .map((x) => x.name)
      .filter(function (x) {
        return x != null;
      });
    let similarFound = findBestMatch(channel, mappingChannel).bestMatch
      .target;
    let channelRegex = new RegExp(similarFound, "i");
    let finale = await message.client.channels.cache.find((x) =>
      channelRegex.test(x.name)
        ? x.name === similarFound
        : x.name === similarFound
    ) as TextChannel | VoiceChannel | ThreadChannel;
    canal = finale;
  } else {
    canal = null
  }
} catch (error) {
  canal = null;
}

return canal
}


/**
 * @function SearchUser Busca un usuario en el servidor y en la API de discord.
 * @param client Cliente de discord.js del bot.
 * @param query ID del usuario | Tag del usuario | Nombre de usuario | Apodo del usuario
 * @returns {User | null} resultado de la búsqueda, puede ser un usuario o null si no se encuentra ningun usuario.
 * @example
 *
 * SearchUser(client, `cheree`)
 */

export async function SearchUser(client: Client, query: string) {
  if (client.constructor.name !== "Client")
    throw TypeError(
      `El primer argumento tiene que ser el cliente del bot. [CLIENT]`
    );
  if (!query || query.length == 0)
    throw TypeError(
      `El segundo argumento tiene que ser una string o número [STRING] or [NUMBER]`
    );

  await validate();

  var cache = client.users;
  var final;

  // Discord ID
  if (query.match(/\d{16,22}$/gi)) {
    let result = await cache.fetch(query, { force: true }).catch(() => {});
    if (result == undefined) {
      const user: ApiUser = await getApiUser(`${query}`).catch(() => {});
      if (user !== undefined) final = user;
      else final = null;
    } else final = result;
  } else if (
    query.startsWith("<@!") ||
    (query.startsWith("<@") && query.endsWith("<"))
  ) {
    const id = query.replace(/[<@!>]/g, "");
    const user: User | null = await client.users.fetch(`${id}`, {
      force: true,
    });

    final = user || null;
  }

  // Discord Tag
  else if (query.match(/^.{1,32}(#)+\d{4}$/gim)) {
    let finale = await cache.cache.find((x) => x.tag === query);
    final = finale;
  }

  //Username
  else if (query.match(/^.{1,32}$/gi)) {
    let mappingUsername = await cache.cache
      .map((x) => x.username)
      .filter(function (x) {
        return x != null;
      });
    let similarFound = findBestMatch(query, mappingUsername).bestMatch.target;
    let userRegex = new RegExp(similarFound, "i");
    let finale = await cache.cache.find((x) =>
      userRegex.test(x.username)
        ? x.username === similarFound
        : x.username === similarFound
    );
    final = finale;
  }

  // Unknown
  else if (!final) {
    final = null;
  }

  return final as User | null;
}

/**
 * @function getColor Obtiene el color como una imagen del color que se le de.
 * @param {string} color Color que se desea obtener.
 * @returns {string} La imagen del color.
 * @example
 * // Obtiene el color como una imagen.
 * const color = getColor("#ffffff");
 */

export async function getColor(color: string) {
  if (!color) throw TypeError(`El primer argumento es obligatorio.`);
  if (typeof color !== "string")
    throw TypeError(
      `El primer argumento debe de ser el hex color de un color obligatoriamente. [STRING]`
    );

  if (color.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
    return `https://singlecolorimage.com/get/${color}/600x240`;
  } else {
    throw TypeError(`El color no es válido.`);
  }
}
