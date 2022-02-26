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
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
const channelManager_1 = require("../../../Util/managers/channelManager");
const snipeManager_1 = require("../../../Util/managers/littleManagers/snipeManager");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const emojis_1 = require("../../../Util/constants/emojis");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "snipe",
            description: "Muestra el ultimo mensaje borrado en ese canal.",
            category: "info",
            cooldown: 5,
            aliases: ["snipes", "sniper"],
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            var snipes = yield (yield (0, channelManager_1.getDBChannel)(base.channel.id)).snipes;
            const universalEmbed = new discord_js_1.MessageEmbed().setColor("PURPLE");
            var args = Number(base.args[0]) || Number(base.args[1]) || 1;
            if (args > snipes.length)
                args = snipes.length;
            if (args < 1)
                args = 1;
            if (isNaN(Number(base.args[0]))) {
                if (base.args[0] === "list" || base.flags[0] === "list") {
                    return base.client.commands.get("snipelist").run(base);
                }
                else if (base.flags[0] == "edit") {
                    return base.client.commands.get("editsnipe").run(base);
                }
                else {
                    var canal = (yield (0, apiUtil_1.getChannel)(base.args[0], base.message)) || base.message.channel;
                    const nsfw = canal.nsfw == true ? true : canal.name.includes("🔞") ? true : false;
                    const nsfww = base.message.channel.nsfw == true ? true : base.message.channel.name.includes("🔞") ? true : false;
                    if (nsfw == true && nsfww == false)
                        return base.message.channel.send({ embeds: [universalEmbed.setDescription(`> __*** ⚠ Hey. No puedes snipear canales NSFW en canales marcados como SFW. ***__\n\n> **Y el canal ${canal} es NSFW.**`)] });
                    snipes = yield (yield (0, channelManager_1.getDBChannel)(canal.id)).snipes;
                }
            }
            if (args > snipes.length)
                return base.message.reply({ embeds: [universalEmbed.setAuthor(`No hay suficientes mensajes borrados.`).setDescription(`El snipe ${args} ${canal == undefined ? "no existe aun" : `no existe aun en <#${canal.id}>`}`)] });
            if (!snipes.length) {
                return base.message.reply({ embeds: [universalEmbed.setDescription("**No hay mensajes borrados en este canal.**").setDescription(`No hay mensaje borrados en ${canal}`).setImage(null).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)] });
            }
            else {
                const archivos = (0, snipeManager_1.combineAll)(snipes[args - 1].messageAttachments, snipes[args - 1].messageStickers);
                if (!archivos.length) {
                    return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setImage(null).setFooter(`Snipe ${args}`)] });
                }
                else if (archivos.length == 1) {
                    if (archivos[0].includes(".mp4") || archivos.includes(".webm")) {
                        return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}\n\n**[Archivo](${archivos[0]})**`).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar)] });
                    }
                    return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)] });
                }
                else if (archivos.length > 1) {
                    const m1 = yield base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)], components: [base.ar(base.b("SECONDARY", ">>", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("SECONDARY", "<<", "left", false, emojis_1.emojis.left_arrow))] });
                    const collector = [];
                    for (let i = 0; i < archivos.length; i++) {
                        collector.push(new discord_js_1.MessageEmbed().setColor(`PURPLE`).setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[i] || null).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`));
                    }
                    var page = 0;
                    const aw1 = yield m1.createMessageComponentCollector({
                        time: 60000,
                        componentType: "BUTTON",
                        max: 20
                    });
                    aw1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                        const cc = c;
                        if (cc.member.id !== base.message.author.id)
                            return cc.reply({ content: `PENDING PRIVATE INSTANCE, ADD.`, ephemeral: true });
                        if (cc.customId == "right") {
                            if (page !== 0) {
                                --page;
                                cc.update({ embeds: [collector[page]] });
                            }
                            else {
                                page = [collector.length - 1];
                                cc.update({ embeds: [collector[page]] });
                            }
                        }
                        else if (cc.customId == "left") {
                            if (page < collector.length - 1) {
                                page++;
                                cc.update({ embeds: [collector[page]] });
                            }
                            else {
                                page = 0;
                                cc.update({ embeds: [collector[page]] });
                            }
                        }
                    }));
                    aw1.on("end", () => {
                        m1.edit({ embeds: [m1.embeds[0]], components: [base.ar(base.b("SECONDARY", ">>", "right", true, emojis_1.emojis.right_arrow), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("SECONDARY", "<<", "left", true, emojis_1.emojis.left_arrow))] });
                    });
                }
            }
        });
    }
}
exports.default = NameCommand;
