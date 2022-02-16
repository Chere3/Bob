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
const channelManager_1 = require("../../Util/managers/channelManager");
const editSnipeManager_1 = require("../../Util/managers/littleManagers/editSnipeManager");
const apiUtil_1 = require("../../Util/Functions/utils/apiUtil");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "editsnipe",
            description: "Muestra los mensajes editados",
            category: "info",
            aliases: ["editsniper", "snipeedit", "snipeeditsnipe"],
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            var snipes = yield (yield (0, channelManager_1.getDBChannel)(base.channel.id)).editsnipes;
            const universalEmbed = new discord_js_1.MessageEmbed().setColor("ORANGE");
            var args = Number(base.args[0]) || Number(base.args[1]) || 1;
            if (isNaN(Number(base.args[0]))) {
                if (base.args[0] === "list") {
                    if (snipes.length < 2)
                        return base.message.reply({ embeds: [universalEmbed.setAuthor(`No hay suficientes mensajes editados.`).setDescription(`El snipe 2 no existe aún.`)] });
                    const menu = yield (0, editSnipeManager_1.constructMenu)(base.message);
                    const m1 = yield base.message.reply({ components: [menu], embeds: [universalEmbed.setAuthor(snipes[0].messageAuthor, snipes[0].messageAuthorAvatar).setDescription(`${snipes[0].messageContent}`).setFooter(`Snipe 1.`).setImage(snipes[0].messageAttachments[0] || null).setTimestamp(snipes[0].messageTimestamp)] });
                    const aw1 = yield m1.createMessageComponentCollector({ max: 25, time: 60000 });
                    return aw1.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        const mm = m;
                        if (mm.member.id !== base.message.member.id)
                            return mm.reply({ content: `Hey!, solo el autor del mensaje puede hacer esto.`, ephemeral: true });
                        const value = Number(mm.values[0]);
                        const archivos = snipes[value].messageAttachments;
                        if (!archivos.length) {
                            mm.update({ embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}`).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${value + 1}`)] });
                        }
                        else if (archivos.length == 1) {
                            if (archivos[0].includes(".mp4")) {
                                mm.update({ embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}\n\n**[Archivo](${archivos[0]})**`).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${args + 1}`).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar)] });
                            }
                            mm.update({ embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${args + 1}`)] });
                        }
                        else if (archivos.length > 1) {
                            const m2 = yield mm.update({ embeds: [universalEmbed.setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[0] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${value + 1}`)], components: [base.ar(base.b("PRIMARY", ">>", "right"), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("PRIMARY", "<<", "left"))] });
                            const collector = [];
                            for (let i = 0; i < archivos.length; i++) {
                                collector.push(new discord_js_1.MessageEmbed().setDescription(`${snipes[value].messageContent || "ㅤ"}`).setImage(archivos[i] || null).setAuthor(snipes[value].messageAuthor, snipes[value].messageAuthorAvatar).setTimestamp(snipes[value].messageTimestamp).setFooter(`Snipe ${value + 1}`).setColor("ORANGE"));
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
                                    return cc.reply({ content: `HEY! Solo el autor del mensaje puede hacer esto.`, ephemeral: true });
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
                                m1.edit({ embeds: [m1.embeds[0]], components: [base.ar(base.b("PRIMARY", ">>", "right", true), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("PRIMARY", "<<", "left", true))] });
                            });
                        }
                    }));
                }
                else {
                    const canal = (yield (0, apiUtil_1.getChannel)(base.args[0], base.message)) || base.message.channel;
                    snipes = yield (yield (0, channelManager_1.getDBChannel)(canal.id)).editsnipes;
                }
            }
            if (args > snipes.length)
                return base.message.reply({ embeds: [universalEmbed.setAuthor(`No hay suficientes mensajes editados.`).setDescription(`El snipe ${args} no existe aún.`)] });
            if (!snipes.length) {
                return base.message.reply({ embeds: [universalEmbed.setDescription("**No hay mensajes editados en este canal.**").setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)] });
            }
            else {
                const archivos = snipes[args - 1].messageAttachments;
                if (!archivos.length) {
                    return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)], components: [base.ar(base.l(`Ir al mensaje`, snipes[args - 1].messageLink))] });
                }
                else if (archivos.length == 1) {
                    if (archivos[0].includes(".mp4")) {
                        return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}\n\n**[Archivo](${archivos[0]})**`).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar)], components: [base.ar(base.l(`Ir al mensaje`, snipes[args - 1].messageLink))] });
                    }
                    return base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0]).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)], components: [base.ar(base.l(`Ir al mensaje`, snipes[args - 1].messageLink))] });
                }
                else if (archivos.length > 1) {
                    const m1 = yield base.message.reply({ embeds: [universalEmbed.setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[0]).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`)], components: [base.ar(base.b("PRIMARY", ">>", "right"), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("PRIMARY", "<<", "left"), base.l(`Ir al mensaje`, snipes[args - 1].messageLink))] });
                    const collector = [];
                    for (let i = 0; i < archivos.length; i++) {
                        collector.push(new discord_js_1.MessageEmbed().setDescription(`${snipes[args - 1].messageContent || "ㅤ"}`).setImage(archivos[i]).setAuthor(snipes[args - 1].messageAuthor, snipes[args - 1].messageAuthorAvatar).setTimestamp(snipes[args - 1].messageTimestamp).setFooter(`Snipe ${args}`).setColor("ORANGE"));
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
                            return cc.reply({ content: `HEY! Solo el autor del mensaje puede hacer esto.`, ephemeral: true });
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
                        m1.edit({ embeds: [m1.embeds[0]], components: [base.ar(base.b("PRIMARY", ">>", "right", true), base.b("SECONDARY", "ㅤ", "aaa", true), base.b("SECONDARY", "ㅤ", "bbb", true), base.b("PRIMARY", "<<", "left", true))] });
                    });
                }
            }
        });
    }
}
exports.default = NameCommand;