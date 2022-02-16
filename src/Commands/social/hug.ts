import { Client, MessageEmbed } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import {
  getD,
  getFinalResult,
} from "../../Util/managers/littleManagers/socialCommandsManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "hug",
      description: "Abraza a alguien con este comando.",
      category: "social",
      cooldown: 10,
    });
  }

  async run(base: TempContext) {
    try {
      var a = await getFinalResult(base.message, "hug");
    } catch (e) {
      if (e == "TypeError: NAN_USER") {
        return base.message.reply(
          "Para usar este comando debes de mencionar a alguien.\n`Respondiendo al mensaje de la persona que quieres abrazar | Mencionandola | Poniendo su ID | Poniendo su usuario | Poniendo su tag | Poniendo su apodo`"
        );
      } else if (e == "TypeError: EQUAL_AUTHOR") {
        return base.message.reply(`No te puedes abrazar a ti mismo.`);
      }
    }

    const embed = new MessageEmbed()
      .setAuthor(a.description)
      .setImage(a.image)
      .setFooter(
        `${a.userS.username} lleva ${a.user} abrazos recibidos.`,
        a.userS.displayAvatarURL()
      )
      .setColor("PURPLE");

    return base.message.reply({ embeds: [embed] });
  }
}
