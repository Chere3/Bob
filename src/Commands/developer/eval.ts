import { Client, MessageEmbed } from "discord.js";
import { inspect } from "util";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { imagesModel } from "../../Database/schemas/Images";
import {
  checkDescription,
  getFinalResult,
  getIntNumber1,
} from "../../Util/Functions/managers/littleManagers/socialCommandsManager";
import {
  addImage,
  checkImage,
  getDBDescriptions,
  getDBImages,
  getRandomCategorieImage,
  sortImages,
} from "../../Util/Functions/managers/littleManagers/socialCommandsManager";
import {
  parseEval,
  parseQuery,
  parseType,
  separeTexto,
} from "../../Util/Functions/utils/textUtil";
import {
  MasterCleverbot,
  formatText,
} from "../../Util/Functions/managers/littleManagers/cleverbotManager";
import {
  addSnipe,
  constructMenu,
  detectAndMoveImages,
  detectAndMoveStickers,
  detectEmbeds,
  uploadImageToA,
} from "../../Util/Functions/managers/littleManagers/snipeManager";
import { getChannel } from "../../Util/Functions/utils/apiUtil";
import { getDBChannel } from "../../Util/Functions/managers/channelManager";
import { formatBans } from "../../Util/Functions/managers/littleManagers/listBanManager";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "eval",
      description: "Saca un eval del código.",
      category: "dev",
      dev: true,
    });
  }

  async run(base: TempContext) {
    const checkearImagen = checkImage;
    const imgadd = addImage;
    const imagenes = getDBImages;
    const imgs = imagesModel;
    const sortear = sortImages;
    const getImage = getRandomCategorieImage;
    const getD = getDBDescriptions;
    const intnumber = getIntNumber1;
    const checkD = checkDescription;
    const separe = separeTexto;
    const result = getFinalResult;
    const clrCore = MasterCleverbot;
    const uplImg = uploadImageToA;
    const upl = detectAndMoveImages;
    const upt = detectAndMoveStickers;
    const upy = detectEmbeds;
    const format = formatText;
    const addsnipe = addSnipe;
    const getCh = getChannel
    const dbchannel = getDBChannel
    const constructmenu = constructMenu
    const list = formatBans
    const { query, flags } = parseQuery(base.args);

    if (!query.length) return;
    let input = query.join(" ");

    const embed = new MessageEmbed().setAuthor(`🧠 Calculado.`);
    try {
      if (flags.includes("async")) {
        input = `(async () => { ${input} })()`;
      }

      if (flags.includes("delete")) base.message.delete();
      let { evaled, type } = await parseEval(eval(input));
      let depth = `0` as any;

      if (flags.some((input) => input.includes("depth"))) {
        depth = flags.find((number) => number.includes("depth")).split("=")[1];
        depth = parseInt(`${depth}`, 10);
      }

      if (flags.includes("silent")) return;
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth });
      let output = evaled
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

      if (output.length > 4096) {
        separeTexto(output, 4000).map((x) => {
          base.channel.send({
            embeds: [embed.setDescription(`\`\`\`javascript\n${x}\`\`\``)],
          });
        });
      } else {
        embed.setDescription("```js\n" + output + "```");
      }

      embed.setFooter(`Tipo: ${type} | Ping: ${base.client.ws.ping}ms`);
      embed.setColor(0x002c2f33);

      return base.channel.send({ embeds: [embed] });
    } catch (error) {
      if (error.length > 6000) {
        separeTexto(error, 5000).map((x) => {
          base.channel.send({
            embeds: [embed.setDescription(`\`\`\`javascript\n${x}\`\`\``)],
          });
        });
      } else {
        embed.setDescription("```js\n" + error + "```");
      }
      embed.setFooter(
        `Tipo: ${parseType(error)} | Ping: ${base.client.ws.ping}ms`
      );
      return base.channel.send({ embeds: [embed] });
    }
  }
}
