import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import {
  addImage,
  addImages,
} from "../../Util/Functions/managers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "addhugimages",
      description: "Adds images to the hug command",
      dev: true,
    });
  }

  async run(base: TempContext) {
    try {
      await addImages(base.args, "hug");

      return base.message.reply(
        `Se han subido \`${base.args.length}\` imagenes a la base de datos del abrazo.`
      );
    } catch (e) {
      base.message.reply(`Ha ocurrido un error: \`${e}\``);
    }
  }
}
