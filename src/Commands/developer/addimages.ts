import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { imagesDB } from "../../Util/constants/imagesDB";
import {
  addImage,
  addImages,
} from "../../Util/Functions/managers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "addimages",
      description: "Adds images to the hug command",
      dev: true,
    });
  }

  async run(base: TempContext) {
    try {
      await addImages(base.args.slice(1), base.args[0] as imagesDB);

      return base.message.reply(
        `Se han subido \`${base.args.length}\` imagenes a la base de datos del comando \`${base.args[0]}\``
      );
    } catch (e) {
      base.message.reply(`Ha ocurrido un error: \`${e}\``);
    }
  }
}
