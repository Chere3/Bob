import { Client, MessageEmbed } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { emojis } from "../../Util/constants/emojis";
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
          `> ${emojis.zdo_tonto} __**Para usar este comando debes de mencionar a alguien**__\n\`\`\`!hug ${base.member.displayName}\n!hug <@usuario>\`\`\``
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
