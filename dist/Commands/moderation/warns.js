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
const emojis_1 = require("../../Util/constants/emojis");
const apiUtil_1 = require("../../Util/Functions/utils/apiUtil");
const DBUtil_1 = require("../../Util/Functions/utils/DBUtil");
const generalUtil_1 = require("../../Util/Functions/utils/generalUtil");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "warns",
            description: "Muestra los warns de un usuario",
            category: "dev",
            aliases: ["cases", "warnss"],
            staff: true,
            dev: true
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = (yield (0, apiUtil_1.getMember)(base.args.join(" "), base.message).catch(() => { })) || base.member;
            const warns = yield (yield (0, DBUtil_1.getUserDB)(member.id)).warnsHistory;
            if (!warns || warns.length === 0)
                return base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag}** no tiene warns__`);
            const embed = new discord_js_1.MessageEmbed().setDescription(`${constructWarns(warns).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, yield base.avatar(member.id)).setColor(`PURPLE`);
            if (warns.length < 10) {
                const m1 = yield base.message.reply({ embeds: [embed], components: [base.ar(constructMenu(warns))] });
                const w1 = m1.createMessageComponentCollector({ time: 60000, max: 15, componentType: "SELECT_MENU" });
                w1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                    const cc = c;
                    if (cc.member.id !== base.member.id)
                        return cc.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                    const b = Number(cc.values[0]);
                    const embed = new discord_js_1.MessageEmbed().setAuthor(base.Getmember(warns[b].id).constructor.name == "GuildMember" ? base.Getmember(warns[b].id).user.username : base.Getmember(warns[b].id).username, yield base.avatar(warns[b].id)).setThumbnail(yield base.avatar(warns[b].moderator)).setDescription(`${emojis_1.emojis.razon} __**Razón**:__ ${warns[b].reason}\n${emojis_1.emojis.oso_policia} __**Moderador**:__${base.Getmember(warns[b].moderator)}\n⏰ __**El:**__ **<t:${String(warns[b].warnedAt).slice(0, -3)}>**\n🔩 __**ID del caso:**__\`\`\`fix\n${warns[b].case}\`\`\``).setColor(`PURPLE`);
                    yield cc.update({ embeds: [embed] });
                }));
            }
            else {
                const ws = (0, generalUtil_1.separateArray)(warns, 10);
                const m1 = yield base.message.reply({ embeds: [embed.setDescription(constructWarns(ws[0]).slice(9))], components: [base.ar(constructMenu(ws[0])), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow))] });
                const emds = [];
                for (let i = 0; i < ws.length; i++) {
                    emds.push(new discord_js_1.MessageEmbed().setDescription(`${constructWarns(ws[i], i).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, yield base.avatar(member.id)).setColor(`PURPLE`).setFooter(`El usuario tiene ${warns.length} warns en total.`));
                }
                var p = 0;
                const aw1 = m1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                const aw2 = m1.createMessageComponentCollector({ componentType: "BUTTON", max: 15, time: 60000 });
                aw1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                    if (c.member.id !== base.member.id)
                        return c.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                    const ar = ws[p];
                    const b = Number(c.values[0]);
                    const e = new discord_js_1.MessageEmbed().setAuthor(base.Getmember(ar[b].id).constructor.name == "GuildMember" ? base.Getmember(ar[b].id).user.username : base.Getmember(ar[b].id).username, yield base.avatar(ar[b].id)).setThumbnail(yield base.avatar(ar[b].moderator)).setDescription(`${emojis_1.emojis.razon} __**Razón**:__ ${ar[b].reason}\n${emojis_1.emojis.oso_policia} __**Moderador**:__${base.Getmember(ar[b].moderator)}\n⏰ __**El:**__ **<t:${String(ar[b].warnedAt).slice(0, -3)}>**\n🔩 __**ID del caso:**__\`\`\`fix\n${ar[b].case}\`\`\``).setColor(`PURPLE`);
                    c.update({ embeds: [e], components: [base.ar(constructMenu(ws[p], p))] });
                }));
                aw2.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                    const cc = c;
                    if (cc.member.id !== base.member.id)
                        return cc.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                    if (cc.customId == "right") {
                        if (p !== 0) {
                            --p;
                            cc.update({ embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow))] });
                        }
                        else {
                            p = [emds.length - 1];
                            cc.update({ embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow))] });
                        }
                    }
                    else if (cc.customId == "left") {
                        if (p < emds.length - 1) {
                            p++;
                            cc.update({ embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow))] });
                        }
                        else {
                            p = 0;
                            cc.update({ embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow))] });
                        }
                    }
                }));
            }
            function constructWarns(warns, page = 0) {
                var owo;
                var num = 1;
                if (page > 0) {
                    num = page * 10 + 1;
                }
                for (let i = 0; i < warns.length; i++) {
                    if (warns[i].reason.length >= 20) {
                        var reason = warns[i].reason.slice(0, 20) + "...";
                    }
                    else {
                        reason = warns[i].reason;
                    }
                    owo += `${emojis_1.emojis.razon} **${num}** - ${reason} - ${base.client.users.cache.get(warns[i].moderator) || warns[i].moderator}\n\n`;
                    num = num + 1;
                }
                return owo;
            }
            function constructMenu(modlogs, page = 0) {
                var _a;
                var a = [];
                var number = 0;
                var nn = 0;
                if (page > 0) {
                    number = page * 10 + 1;
                }
                for (const log of modlogs) {
                    const option = {
                        value: `${nn}`,
                        label: `#${number}: ${((_a = base.client.users.cache.get(`${log.moderator}`)) === null || _a === void 0 ? void 0 : _a.tag) || log.moderator}`,
                        description: `${log.reason.slice(0, 10)}...`
                    };
                    a.push(option);
                    number = number + 1;
                    nn = nn + 1;
                }
                var menu = new discord_js_1.MessageSelectMenu().addOptions(a).setCustomId("owo").setPlaceholder(`Selecciona una opción para ver el registro`);
                return menu;
            }
            function ucFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        });
    }
}
exports.default = NameCommand;
