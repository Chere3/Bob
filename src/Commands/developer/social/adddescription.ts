import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { addDescription } from "../../../Util/managers/littleManagers/socialCommandsManager";
import { imagesDB } from "../../../Util/constants/imagesDB";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "adddescription",
      dev: true,
    });
  }

  async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> __**Debes de ingresar el valor al que le quieres agregar la descripción.**__`);
    if (!base.args[1]) return base.message.reply(`> __**Debes de ingresar la descripción a agregar.**__`);

    try {
      await addDescription(
        base.args.slice(1).join(" "),
        base.args[0] as imagesDB
      );
      base.message.reply(`> __**Descripción agregada con éxito.**__\n\nEjemplos de visualización:\n\`\`\`${base.args.slice(1).join(" ").replace(`{author}`, `@${base.member.displayName}`).replace(`{user}`, `@${base.guild.me.displayName}`)}\`\`\``);
    } catch (e) {
      base.message.reply(`Ha ocurrido un error.\n\`\`\`${String(e).slice(6)}\`\`\``);
    }
  }
}
