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
const emojis_1 = require("../../../Util/constants/emojis");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const textUtil_1 = require("../../../Util/Functions/utils/textUtil");
const channelManager_1 = require("../../../Util/managers/channelManager");
const snipeManager_1 = require("../../../Util/managers/littleManagers/snipeManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "snipelist",
            description: "Muestra la lista de snipes. [sub comando de snipe.]",
            category: "info",
            aliases: ["snipes"],
            usage: (prefix) => "snipelist [canal]",
            example: (prefix) => "snipelist [canal]",
        });
    }
    run(base) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            var comando = base.message.content.split(" ")[0];
            const cont = (base.message.content.includes(this.name) && !base.flags.includes("list")) == true ? base.args : (_a = base.args) === null || _a === void 0 ? void 0 : _a.slice(1);
            const channel = base.args[0] ? (_b = (yield (0, apiUtil_1.getChannel)(cont.join(" "), base.message))) !== null && _b !== void 0 ? _b : base.channel : base.channel;
            var snipes = yield (yield (0, channelManager_1.getDBChannel)(channel.id)).snipes;
            const nsfw = channel.nsfw == true ? true : channel.name.includes(`🔞`) == true ? true : false;
            const nsfww = base.channel.nsfw == true ? true : base.channel.name.includes(`🔞`) == true ? true : false;
            const universalEmbed = new discord_js_1.MessageEmbed().setColor("PURPLE");
            if (nsfw == true && nsfww == false)
                return base.message.reply({ embeds: [universalEmbed.setDescription(`> ${emojis_1.emojis.zdo_tonto} __**No puedes ver los mensajes borrados de un canal nsfw, estando en un canal SFW**__\n\n> __**El canal ${channel} es un canal NSFW.**__`)] });
            if (snipes.length < 2)
                return base.message.reply({ embeds: [universalEmbed.setDescription(`> __**Se necesitan por lo menos 2 mensajes borrados para que este comando funcione, y este canal solo tiene ${snipes.length} mensajes borrados registrados.**__`)] });
            const menu = yield (0, snipeManager_1.constructMenu)(base.message);
            const m1 = yield base.message.reply({ components: [menu], embeds: [universalEmbed.setAuthor({ name: snipes[0].messageAuthor, iconURL: snipes[0].messageAuthorAvatar }).setDescription(snipes[0].messageContent).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[0].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setImage((_c = snipes[0].messageAttachments[0]) !== null && _c !== void 0 ? _c : null).setTimestamp(snipes[0].messageTimestamp)] });
            const aw1 = yield m1.createMessageComponentCollector({ max: 25, time: 60000 });
            aw1.on("collect", (a) => __awaiter(this, void 0, void 0, function* () {
                var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                const mm = a;
                if (a.isButton() == true)
                    return;
                const value = Number(mm.values[0]);
                const archivos = (0, snipeManager_1.combineAll)(snipes[value].messageAttachments, snipes[value].messageStickers);
                if (mm.member.id !== base.message.member.id) {
                    var m2 = yield mm.reply({ components: [menu.setComponents(menu.components[0].setCustomId(a.channel.id))], embeds: [universalEmbed.setAuthor({ name: snipes[0].messageAuthor, iconURL: snipes[0].messageAuthorAvatar }).setDescription(snipes[0].messageContent).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[0].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setImage((_d = snipes[0].messageAttachments[0]) !== null && _d !== void 0 ? _d : null).setTimestamp(snipes[0].messageTimestamp)], ephemeral: true, fetchReply: true });
                    if (!archivos.length) {
                        mm.update({ embeds: [universalEmbed.setDescription((_e = snipes[value].messageContent) !== null && _e !== void 0 ? _e : "ㅤ").setImage(null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                    }
                    else if (archivos.length == 1) {
                        if (archivos[0].includes(".mp4")) {
                            mm.update({ embeds: [universalEmbed.setDescription(`${(_f = snipes[value].messageContent) !== null && _f !== void 0 ? _f : "ㅤ"}\n\n__**[Vídeo borrado](${archivos[0]})**__`).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                        }
                        else {
                            mm.update({ embeds: [universalEmbed.setDescription((_g = snipes[value].messageContent) !== null && _g !== void 0 ? _g : "ㅤ").setImage((_h = archivos[0]) !== null && _h !== void 0 ? _h : null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                        }
                    }
                    else if (archivos.length > 1) {
                        const m2 = yield mm.update({ embeds: [universalEmbed.setDescription((_j = snipes[value].messageContent) !== null && _j !== void 0 ? _j : "ㅤ").setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow), base.db, base.db, base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow)), menu] });
                        const collector = [];
                        for (let i = 0; i < archivos.length; i++) {
                            collector.push(new discord_js_1.MessageEmbed().setColor(`PURPLE`).setDescription((_k = snipes[value].messageContent) !== null && _k !== void 0 ? _k : "ㅤ").setImage((_l = archivos[i]) !== null && _l !== void 0 ? _l : null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp));
                        }
                        var page = 0;
                        const aw1 = yield m1.createMessageComponentCollector({ time: 60000, componentType: "BUTTON", max: 20 });
                        yield aw1.on("collect", (a) => __awaiter(this, void 0, void 0, function* () {
                            const cc = a;
                            if (cc.member.id !== base.message.author.id)
                                return cc.reply({ content: `PRIVATE INSTANCE MISSING TYPE 2`, ephemeral: true });
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
                    }
                }
                if (!archivos.length) {
                    mm.update({ embeds: [universalEmbed.setDescription((_m = snipes[value].messageContent) !== null && _m !== void 0 ? _m : "ㅤ").setImage(null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                }
                else if (archivos.length == 1) {
                    if (archivos[0].includes(".mp4")) {
                        mm.update({ embeds: [universalEmbed.setDescription(`${(_o = snipes[value].messageContent) !== null && _o !== void 0 ? _o : "ㅤ"}\n\n__**[Vídeo borrado](${archivos[0]})**__`).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                    }
                    else {
                        mm.update({ embeds: [universalEmbed.setDescription((_p = snipes[value].messageContent) !== null && _p !== void 0 ? _p : "ㅤ").setImage((_q = archivos[0]) !== null && _q !== void 0 ? _q : null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)] });
                    }
                }
                else if (archivos.length > 1) {
                    const m2 = yield mm.update({ embeds: [universalEmbed.setDescription((_r = snipes[value].messageContent) !== null && _r !== void 0 ? _r : "ㅤ").setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp)], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow), base.db, base.db, base.b("SECONDARY", ".", "left", false, emojis_1.emojis.left_arrow)), menu] });
                    const collector = [];
                    for (let i = 0; i < archivos.length; i++) {
                        collector.push(new discord_js_1.MessageEmbed().setColor(`PURPLE`).setDescription((_s = snipes[value].messageContent) !== null && _s !== void 0 ? _s : "ㅤ").setImage((_t = archivos[i]) !== null && _t !== void 0 ? _t : null).setAuthor({ name: snipes[value].messageAuthor, iconURL: snipes[value].messageAuthorAvatar }).setFooter({ text: `Borrado ${(0, textUtil_1.timeDifference)(Date.now(), snipes[value].messageTimestamp)}`, iconURL: `https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/282/alarm-clock_23f0.png` }).setTimestamp(snipes[value].messageTimestamp));
                    }
                    var page = 0;
                    const aw1 = yield m1.createMessageComponentCollector({ time: 60000, componentType: "BUTTON", max: 20 });
                    yield aw1.on("collect", (a) => __awaiter(this, void 0, void 0, function* () {
                        const cc = a;
                        if (cc.member.id !== base.message.author.id)
                            return cc.reply({ content: `PRIVATE INSTANCE MISSING TYPE 2`, ephemeral: true });
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
                }
            }));
        });
    }
}
exports.default = NameCommand;
