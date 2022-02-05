import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { addDescription } from "../../Util/managers/littleManagers/socialCommandsManager";
import { imagesDB } from "../../Util/constants/imagesDB";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "adddescription",
      dev: true,
    });
  }

  async run(base: TempContext) {
    if (!base.args[0])
      return base.message.reply(`Te hacen falta argumentos para este comando.`);

    try {
      await addDescription(
        base.args.slice(1).join(" "),
        base.args[0] as imagesDB
      );
      base.message.reply(`Descripción añadida correctamente.`);
    } catch (e) {
      base.message.reply(`Ha ocurrido un error.\n\`\`\`${e}\`\`\``);
    }
  }
}
