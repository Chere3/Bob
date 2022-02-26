"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const textUtil_1 = require("../../Util/Functions/utils/textUtil");
const evalUtil_1 = require("../../Util/constants/evalUtil");
const emojis_1 = require("../../Util/constants/emojis");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Saca un eval del código.",
            category: "dev",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const su = evalUtil_1.snipeUtil;
            const scu = evalUtil_1.socialCommandUtil;
            const dbu = evalUtil_1.dbUtil;
            const tu = evalUtil_1.textUtil;
            const mu = evalUtil_1.moderationutil;
            const cu = evalUtil_1.cacheUtil;
            const all = evalUtil_1.allUtil;
            const apu = evalUtil_1.APIUtil;
            const { query, flags } = (0, textUtil_1.parseQuery)(base.args);
            if (!query.length)
                return;
            let input = query.join(" ");
            const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `🧠 Calculado.` }).setDescription(`a`);
            try {
                if (flags.includes("async")) {
                    input = `(async () => { ${input} })()`;
                }
                if (flags.includes("delete"))
                    base.message.delete();
                let { evaled, type } = yield (0, textUtil_1.parseEval)(eval(input));
                let depth = `0`;
                if (flags.some((input) => input.includes("depth"))) {
                    depth = flags.find((number) => number.includes("depth")).split("=")[1];
                    depth = parseInt(`${depth}`, 10);
                }
                if (flags.includes("silent"))
                    return;
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled, { depth });
                let output = evaled
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
                if (output.length > 4096) {
                    const separado = (0, textUtil_1.separeTexto)(output, 4000);
                    const embeds = [];
                    var i = 0;
                    for (let textito of separado) {
                        embeds.push(new discord_js_1.MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({ name: `🧠 Calculado.` }).setDescription(`\`\`\`js\n${textito}\`\`\``).setFooter(`Ping: ${base.client.ws.ping} | Tipo: ${type} | Página ${i + 1} de ${separado.length}`));
                        i = i + 1;
                    }
                    var pagee = 0;
                    const m1 = yield base.message.channel.send({ embeds: [new discord_js_1.MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({ name: `🧠 Calculado.` }).setDescription(`\`\`\`js\n${separado[0]}\`\`\``).setFooter(`Ping: ${base.client.ws.ping} | Tipo: ${type} | Página 1 de ${separado.length}`)], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis_1.emojis.left_arrow))] });
                    const aw1 = yield m1.createMessageComponentCollector({ componentType: "BUTTON", time: 60000 });
                    return aw1.on("collect", (a) => {
                        if (a.customId == "left") {
                            if (page !== 0) {
                                --page;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                            else {
                                page = [embeds.length - 1];
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                        }
                        else if (a.customId == "right") {
                            if (page < embeds.length - 1) {
                                page++;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                            else {
                                page = 0;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "right", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "left", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                        }
                    });
                }
                else {
                    embed.setDescription("```js\n" + output + "```");
                }
                embed.setFooter({ text: `Tipo: ${type} | Ping: ${base.client.ws.ping}ms` });
                embed.setColor(0x002c2f33);
                return base.channel.send({ embeds: [embed] });
            }
            catch (error) {
                console.log(error);
                if (error.length > 6000) {
                    const text = (0, textUtil_1.separeTexto)(error, 5000);
                    const embeds = [];
                    for (let caca of text) {
                        let i = 0;
                        if (i < text.length) {
                            i++;
                        }
                        embeds.push(new discord_js_1.MessageEmbed().setDescription(`\`\`\`js\n${caca}\`\`\``).setFooter({ text: `Tipo: ${(0, textUtil_1.parseType)(error)} | Ping: ${base.client.ws.ping}ms | Página: ${i + 1} de ${text.length}` }).setColor(0x002c2f33));
                    }
                    var page = 0;
                    const m1 = yield base.channel.send({ embeds: [new discord_js_1.MessageEmbed().setDescription(`\`\`\`js\n${text[0]}\`\`\``).setFooter({ text: `Tipo: ${(0, textUtil_1.parseType)(error)} | Ping: ${base.client.ws.ping}ms | Página: 1 de ${text.length}` }).setColor(0x002c2f33)], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", "⠀", "..", true), base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow))] });
                    const aw1 = yield m1.createMessageComponentCollector({ componentType: "BUTTON", time: 60000, filter: (x) => x.member.id == base.message.member.id });
                    aw1.on("collect", (a) => {
                        if (a.customId == "right") {
                            if (page !== 0) {
                                --page;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                            else {
                                page = [embeds.length - 1];
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                        }
                        else if (a.customId == "left") {
                            if (page < embeds.length - 1) {
                                page++;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                            else {
                                page = 0;
                                a.update({ embeds: [embeds[page]], components: [base.ar(base.b("SECONDARY", "..", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", "⠀", ".", true), base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow))] });
                            }
                        }
                    });
                }
                else {
                    embed.setDescription("```js\n" + error + "```");
                }
                embed.setFooter({ text: `Tipo: ${(0, textUtil_1.parseType)(error)} | Ping: ${base.client.ws.ping}ms` });
                return base.channel.send({ embeds: [embed] });
            }
        });
    }
}
exports.default = NameCommand;
