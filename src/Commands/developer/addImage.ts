import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { imagesDB } from "../../Util/constants/imagesDB";
import { addImage } from "../../Util/Functions/managers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "addimage",
      description: "Agrega una imagen a la base de datos",
      dev: true,
    });
  }

  async run(base: TempContext) {
    if (!base.args[0] || !base.args[1])
      return base.message.reply(`Faltan argumentos para este comando.`);

    try {
      const link = base.args[1];
      const type = base.args[0];
      await addImage(link, type as imagesDB);

      base.message.reply(
        `La imagen ${link} ha sido agregada con exito a la base de datos.`
      );
    } catch (error) {
      base.message.reply(`\`\`\`${error}\`\`\``);
    }
  }
}
