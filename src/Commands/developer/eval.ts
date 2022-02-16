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
import { emojis } from "../../Util/constants/emojis";

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

    const embed = new MessageEmbed().setAuthor({name: `🧠 Calculado.`}).setDescription(`a`)
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
        const separado = separeTexto(output, 4000);
        const embeds = [];
        var i = 0;
        for (let textito of separado) {
          embeds.push(new MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({name: `🧠 Calculado.`}).setDescription(`\`\`\`js\n${textito}\`\`\``).setFooter(`Ping: ${base.client.ws.ping} | Tipo: ${type} | Página ${i + 1} de ${separado.length}`));
          i = i + 1
        }

        var pagee: any = 0;
        const m1 = await base.message.channel.send({embeds: [new MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({name: `🧠 Calculado.`}).setDescription(`\`\`\`js\n${separado[0]}\`\`\``).setFooter(`Ping: ${base.client.ws.ping} | Tipo: ${type} | Página 1 de ${separado.length}`)], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis.left_arrow))]});
        const aw1 = await m1.createMessageComponentCollector({componentType: "BUTTON", time: 60000});

        return aw1.on("collect", (a) => {
          if (a.customId == "left") {
            if (page !== 0) {
              --page;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis.left_arrow))]});
            } else {
              page = [embeds.length - 1];
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis.left_arrow))]});
            }
          } else if (a.customId == "right") {
            if (page < embeds.length - 1) {
              page++;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis.left_arrow))]});
            } else {
              page = 0;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis.left_arrow))]});
            }
          }
        })

      } else {
        embed.setDescription("```js\n" + output + "```");
      }

      embed.setFooter({text: `Tipo: ${type} | Ping: ${base.client.ws.ping}ms`});
      embed.setColor(0x002c2f33);

      return base.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      if (error.length > 6000) {
        const text = separeTexto(error, 5000);
        const embeds = []
        for (let caca of text) {
          let i = 0; if (i < text.length) {i++;}
          embeds.push(new MessageEmbed().setDescription(`\`\`\`js\n${caca}\`\`\``).setFooter({text: `Tipo: ${parseType(error)} | Ping: ${base.client.ws.ping}ms | Página: ${i + 1} de ${text.length}`}).setColor(0x002c2f33));
        }

        var page: any = 0

        const m1 = await base.channel.send({embeds: [new MessageEmbed().setDescription(`\`\`\`js\n${text[0]}\`\`\``).setFooter({text: `Tipo: ${parseType(error)} | Ping: ${base.client.ws.ping}ms | Página: 1 de ${text.length}`}).setColor(0x002c2f33)], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", ".", "left", false, emojis.left_arrow))]});
        const aw1 = await m1.createMessageComponentCollector({componentType: "BUTTON", time: 60000, filter: (x) => x.member.id == base.message.member.id});

        aw1.on("collect", (a) => {
          if (a.customId == "right") {
            if (page !== 0) {
              --page;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis.left_arrow))]});
            } else {
              page = [embeds.length - 1];
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis.left_arrow))]});
            }
          } else if (a.customId == "left") {
            if (page < embeds.length - 1) {
              page++;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis.left_arrow))]});
            } else {
              page = 0;
              a.update({embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis.left_arrow))]});
            }
          }
        })
      } else {
        embed.setDescription("```js\n" + error + "```");
      }
      embed.setFooter({text: `Tipo: ${parseType(error)} | Ping: ${base.client.ws.ping}ms`});
      return base.channel.send({ embeds: [embed] });
    }
  }
}
