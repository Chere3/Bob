import { Collection, Client, MessageEmbed } from "discord.js";
import { config } from "./config";
import { handlers } from "./Util/Functions/handlers";
import Captain from "captainjs";
import login from "./Database/login";
import "./Typings";
import superagent from "superagent";

global.prettyConsole = new Captain.Console({
  use_colors: true,
  debug: false,
  format: "§8[§d%time%§8] [%prefix%§8] §7%message%",
  log_prefix: "§aLog",
  warn_prefix: "§eWarn",
  error_prefix: "§cError",
  info_prefix: "§bInfo",
  debug_prefix: "§bDebug",
});

const TempoClient = new Client({
  intents: [
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
    "GUILDS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_INVITES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_PRESENCES",
    "GUILD_VOICE_STATES",
    "GUILD_WEBHOOKS",
  ],
  allowedMentions: { repliedUser: false, parse: ["users"] },
});

TempoClient.slashCommands = new Collection();
TempoClient.commands = new Collection();
TempoClient.cleverCooldown = new Collection();

handlers(TempoClient);

TempoClient.login(config.auth.token).then((x) => {
  login.then(() => {
    global.prettyConsole.log(`La base de datos 1 esta lista.`);
  });
});

process.on("rejectionHandled", async (a) => {
  global.prettyConsole.error(a);

  const embed = new MessageEmbed()
    .setAuthor(`Error.`)
    .setDescription(`\`\`\`fix\n ${a}\`\`\``)
    .setTimestamp()
    .setColor("RED");
  await superagent
    .post(process.env.AUTH_LOGS)
    .send({ embeds: [embed] })
    .catch(async () => {
      await superagent
        .post(process.env.AUTH_R_LOGS)
        .send({ embeds: [embed] })
        .catch(async () => {
          await superagent
            .post(process.env.AUTH_RR_LOGS)
            .send({ embeds: [embed] })
            .catch(() => {
              console.log(
                `No pude enviar el mensaje de la webhook debido a un error.`
              );
            });
        });
    });
});

process.on("uncaughtException", async (a) => {
  global.prettyConsole.error(a.name);
  global.prettyConsole.error(a.message);
  console.log(a.stack);

  const embed = new MessageEmbed()
    .setAuthor(`Error.`)
    .setDescription(`\`\`\`fix\n ${a.name}\`\`\``)
    .setTimestamp()
    .setColor("RED");
  await superagent
    .post(process.env.AUTH_LOGS)
    .send({ embeds: [embed] })
    .catch(async () => {
      await superagent
        .post(process.env.AUTH_R_LOGS)
        .send({ embeds: [embed] })
        .catch(async () => {
          await superagent
            .post(process.env.AUTH_RR_LOGS)
            .send({ embeds: [embed] })
            .catch(() => {
              console.log(
                `No pude enviar el mensaje de la webhook debido a un error.`
              );
            });
        });
    });
});

process.on("unhandledRejection", async (a) => {
  global.prettyConsole.error(a);
  const embed = new MessageEmbed()
    .setAuthor(`Error.`)
    .setDescription(`\`\`\`fix\n ${a}\`\`\``)
    .setTimestamp()
    .setColor("RED");
  await superagent
    .post(process.env.AUTH_LOGS)
    .send({ embeds: [embed] })
    .catch(async () => {
      await superagent
        .post(process.env.AUTH_R_LOGS)
        .send({ embeds: [embed] })
        .catch(async () => {
          await superagent
            .post(process.env.AUTH_RR_LOGS)
            .send({ embeds: [embed] })
            .catch(() => {
              console.log(
                `No pude enviar el mensaje de la webhook debido a un error.`
              );
            });
        });
    });
});
