import { MessageEmbed, ShardingManager } from "discord.js";
import superagent from "superagent";
import { config } from "./config";
import Captain from "captainjs";
import path from "path";
import "./Typings";

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

const Manager = new ShardingManager(path.join(`${__dirname}/main.ts`), {
  totalShards: "auto",
  token: config.auth.token,
  execArgv: ["node_modules/ts-node/dist/bin.js"],
});

Manager.spawn();

Manager.on("shardCreate", (shard) => {
  global.prettyConsole.log(`La shard ${shard.id + 1} fue creada.`);

  shard.on("disconnect", () =>
    global.prettyConsole.log(`La shard ${shard.id + 1} se desconecto.`)
  );
  shard.on("reconnecting", () =>
    global.prettyConsole.log(`Shard ${shard.id + 1} resumida.`)
  );
  shard.on("ready", () =>
    global.prettyConsole.log(`La shard ${shard.id + 1} esta lista.`)
  );
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
