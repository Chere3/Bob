import { Client, MessageEmbed } from "discord.js";

import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import {
  parseEval,
  parseQuery,
  parseType,
  separeTexto,
} from "../../Util/Functions/utils/textUtil";
import { dbUtil, snipeUtil, socialCommandUtil, textUtil, allUtil, cacheUtil, moderationutil, APIUtil } from '../../Util/constants/evalUtil';

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
    const su = snipeUtil;
    const scu = socialCommandUtil;
    const dbu = dbUtil
    const tu = textUtil;
    const mu = moderationutil;
    const cu = cacheUtil;
    const all = allUtil;
    const apu = APIUtil
    const { query, flags } = parseQuery(base.args);

    if (!query.length) return;
    let input = query.join(" ");

    const embed = new MessageEmbed().setAuthor({name: `🧠 Calculado.`});
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

      embed.setFooter({text: `Tipo: ${type} | Ping: ${base.client.ws.ping}ms`});
      embed.setColor(0x002c2f33);

      return base.channel.send({ embeds: [embed] });
    } catch (error) {
      if (error.length > 6000) {
        const text = separeTexto(error, 5000);
        const embeds = []
        for (const error of text) {
          embeds.push(new MessageEmbed().setDescription(`\`\`\`js\n${error}\`\`\``));
        }
      } else {
        embed.setDescription("```js\n" + error + "```");
      }
      embed.setFooter({text: `Tipo: ${parseType(error)} | Ping: ${base.client.ws.ping}ms`});
      return base.channel.send({ embeds: [embed] });
    }
  }
}
