import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";

/**
 * @method uploadSlashCommands - Uploads the slash commands to the server.
 * @param {any[]} commands - The commands to upload.
 * @author Cheree
 * @returns {Promise<void>}
 * @example
 * uploadSlashCommands([
 * {
 * name: "test",
 * description: "test",
 * usage: "test",
 * },
 * ]);
 */

export async function uploadSlashCommands(slashCommands: any[]) {
  const clientId = "864917800010514432";
  const guildId = "912858763126538281";

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  try {
    console.log(`Estoy subiendo los (/) commands al servidor espera.`);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: slashCommands,
    });

    return `Los (/) commands se subieron correctamente.`;
  } catch (e) {
    return `Error al subir los (/) commands: ${e}`;
  }
}

/**
 * @method constructSlashCommand - Constructs a slash command.
 */

export async function constructSlashCommand() {
  const commands = [];
  const files = require("fs")
    .readdir(`../../../slash-commands`)
    .filter((file) => file.endsWith(".ts"));

  for (const file of files) {
    const command = require(`../../../slash-commands/${file}`);
    commands.push(command.data.ToJSON());
  }

  await uploadSlashCommands(commands);
}
