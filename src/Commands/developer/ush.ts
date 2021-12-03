import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import {
  constructSlashCommand,
  uploadSlashCommands,
} from "../../Util/Functions/managers/slashCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "ush",
      description: "Sube los slash commands al servidor.",
      dev: true,
    });
  }

  async run(base: TempContext) {
    const a = constructSlashCommand().catch((a) => {
      base.message.reply(`\`\`\`${a}\`\`\``);
    });
  }
}
