import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { addDescription } from "../../Util/Functions/managers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "addpatdescription",
      dev: true,
    });
  }

  async run(base: TempContext) {
    if (!base.args[0])
      return base.message.reply(`Te hacen falta argumentos para este comando.`);

    try {
      await addDescription(base.args.join(" "), "pat");
      base.message.reply(`Descripción añadida correctamente.`);
    } catch (e) {
      base.message.reply(`Ha ocurrido un error.\n\`\`\`${e}\`\`\``);
    }
  }
}
