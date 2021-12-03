import { Client, MessageEmbed } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import {
  getD,
  getFinalResult,
  getRandomCategorieImage,
} from "../../Util/Functions/managers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "hug",
      description: "Abraza a alguien con este comando.",
      category: "social",
    });
  }

  async run(base: TempContext) {
    const a = await getFinalResult(base.message, "hug");

    const embed = new MessageEmbed()
      .setAuthor(a.description)
      .setImage(a.image)
      .setColor("ORANGE");

    return base.message.reply({ embeds: [embed] });
  }
}
