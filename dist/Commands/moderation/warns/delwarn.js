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
const DBUtil_1 = require("../../../Util/Functions/utils/DBUtil");
const generalUtil_1 = require("../../../Util/Functions/utils/generalUtil");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const __1 = require("../../..");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "delwarn",
            description: "Elimina un warn.",
            category: "moderation",
            aliases: ["warndelete", "delete-warn", "warndel", "dw"],
            highStaff: true,
            cooldown: 10,
            usage: (prefix) => "delwarn [usuario - warn]",
            example: (prefix) => "delwarn @user"
        });
    }
    run(base) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const arg = base.args[0];
            var force = false;
            if (base.flags[0] == "f" && base.config.owners.includes(base.user.id))
                force = true;
            if (!base.args[0]) {
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Debes de colocar un usuario o caso del warn para borrar.**__\n\`\`\`!delwarn GV5M-5VHZ-O8#%-#6%9\n!delwarn @${base.user.username}\`\`\``);
            }
            else if (base.args[0].match(/^.{4}-.{4}-.{4}-.{4}$/) == null) {
                const member = (yield (0, apiUtil_1.getMember)(base.args.join(" "), base.message).catch(() => { })) || base.member;
                const warns = yield (yield (0, DBUtil_1.getUserDB)(member.id)).warnsHistory;
                if (!warns || warns.length === 0)
                    return base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag}** no tiene warns__`);
                const embed = new discord_js_1.MessageEmbed().setDescription(`${constructWarns(warns).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, yield base.avatar(member.id)).setColor(`PURPLE`);
                if (warns.length < 10) {
                    const m1 = yield base.message.reply({ embeds: [embed], components: [base.ar(constructMenu(warns))] });
                    const w1 = m1.createMessageComponentCollector({ time: 60000, max: 15, componentType: "SELECT_MENU" });
                    const w2 = m1.createMessageComponentCollector({ time: 60000, max: 15, componentType: "BUTTON" });
                    var b;
                    w1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                        const cc = c;
                        if (cc.member.id !== base.member.id)
                            return cc.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                        b = Number(cc.values[0]);
                        const embed = new discord_js_1.MessageEmbed().setAuthor(base.Getmember(warns[b].id).constructor.name == "GuildMember" ? base.Getmember(warns[b].id).user.username : base.Getmember(warns[b].id).username, yield base.avatar(warns[b].id)).setThumbnail(yield base.avatar(warns[b].moderator)).setDescription(`${emojis_1.emojis.razon} __**Razón**:__ ${warns[b].reason}\n${emojis_1.emojis.oso_policia} __**Moderador**:__${base.Getmember(warns[b].moderator)}\n⏰ __**El:**__ **<t:${String(warns[b].at).slice(0, -3)}>**\n🔩 __**ID del caso:**__\`\`\`fix\n${warns[b].case}\`\`\`\n\n**¿Estas seguro que deseas __eliminar este warn__?**`).setColor(`PURPLE`);
                        yield cc.update({ embeds: [embed], components: [base.ar(base.b("SECONDARY", ".", "si", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", ".", "no", false, emojis_1.emojis.rs_x)), base.ar(constructMenu(warns))] });
                    }));
                    w2.on("collect", (d) => __awaiter(this, void 0, void 0, function* () {
                        const dd = d;
                        if (dd.member.id !== base.member.id)
                            return dd.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                        if (dd.customId == "si") {
                            const caseNumber = warns[b].case;
                            try {
                                const data = yield new moderationManager_1.warnManager(null, base.member, null, force, caseNumber).delWarn();
                                yield m1.suppressEmbeds();
                                dd.update({ content: `${emojis_1.emojis.zdo_sospechoso} __**El warn con el caso \`${data.case}\` ha sido eliminado satisfactoriamente**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
                                w2.emit("end", null, null, "si_button");
                                w1.emit("end");
                            }
                            catch (e) {
                                yield m1.suppressEmbeds();
                                if (!String(e).startsWith(`Error:`)) {
                                    yield dd.update(`> ${emojis_1.emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`);
                                    __1.sentry.captureException(e);
                                    return __1.transaction.finish();
                                }
                                dd.update({ content: `${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
                                w2.emit("end", null, null, "si_error_button");
                                w1.emit("end");
                            }
                        }
                        else if (dd.customId == "no") {
                            yield m1.suppressEmbeds();
                            dd.update({ content: `${emojis_1.emojis.zdo_sospechoso} __**Has cancelado la eliminación de un warn**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
                            w2.emit("end", null, null, "no_button");
                            w1.emit("end");
                        }
                    }));
                    w2.on("end", (e, a, d) => __awaiter(this, void 0, void 0, function* () {
                        if (!d) {
                            m1.edit({ embeds: [m1.embeds[0]], components: [base.ar(m1.components[0].components[0].setDisabled(true))] });
                        }
                    }));
                }
                else {
                    const ws = (0, generalUtil_1.separateArray)(warns, 10);
                    const m1 = yield base.message.reply({ embeds: [embed.setDescription(constructWarns(ws[0]).slice(9))], components: [base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow)), base.ar(constructMenu(ws[0]))] });
                    const emds = [];
                    for (let i = 0; i < ws.length; i++) {
                        emds.push(new discord_js_1.MessageEmbed().setDescription(`${constructWarns(ws[i], i).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, yield base.avatar(member.id)).setColor(`PURPLE`).setFooter(`El usuario tiene ${warns.length} warns en total.`));
                    }
                    var p = 0;
                    var b;
                    var ar;
                    const aw1 = m1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                    const aw2 = m1.createMessageComponentCollector({ componentType: "BUTTON", max: 15, time: 60000 });
                    aw1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                        if (c.member.id !== base.member.id)
                            return c.reply({ content: `${emojis_1.emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                        ar = ws[p];
                        b = Number(c.values[0]);
                        const caseNumber = ar[b].case;
                        const e = new discord_js_1.MessageEmbed().setAuthor(base.Getmember(ar[b].id).constructor.name == "GuildMember" ? base.Getmember(ar[b].id).user.username : base.Getmember(ar[b].id).username, yield base.avatar(ar[b].id)).setThumbnail(yield base.avatar(ar[b].moderator)).setDescription(`${emojis_1.emojis.razon} __**Razón**:__ ${ar[b].reason}\n${emojis_1.emojis.oso_policia} __**Moderador**:__${base.Getmember(ar[b].moderator)}\n⏰ __**El:**__ **<t:${String(ar[b].warnedAt).slice(0, -3)}>**\n${emojis_1.emojis.razon} __**ID del caso:**__\`\`\`fix\n${ar[b].case}\`\`\`\n\n¿Estas seguro de __**eliminar este warn?**__`).setColor(`PURPLE`);
                        c.update({ embeds: [e], components: [base.ar(base.b(`SECONDARY`, `si`, `si`, false, emojis_1.emojis.rs_palomita), base.b(`SECONDARY`, `si`, `no`, false, emojis_1.emojis.rs_x)), base.ar(constructMenu(ws[p], p))] });
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
                        else if (cc.customId == "si") {
                            const caseNumber = ar[b].case;
                            try {
                                const data = yield new moderationManager_1.warnManager(null, base.member, null, force, caseNumber).delWarn();
                                yield m1.suppressEmbeds();
                                cc.update({ content: `${emojis_1.emojis.zdo_sospechoso} __**La advertencia con caso \`${data.caseOfDeletedWarn}\` se ha eliminado satisfactoriamente.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
                            }
                            catch (e) {
                                yield m1.suppressEmbeds();
                                cc.update({ content: `${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
                            }
                        }
                        else if (cc.customId == "no") {
                            yield m1.suppressEmbeds();
                            cc.update({ content: `${emojis_1.emojis.zwo_viendo} __**El comando de ha cancelado.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))] });
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
            }
            else {
                __1.transaction;
                try {
                    const data = yield new moderationManager_1.warnManager(null, base.member, (_a = base.args.slice(1)) === null || _a === void 0 ? void 0 : _a.join(" "), false, base.args[0]).delWarn();
                    base.message.reply(`${emojis_1.emojis.zdo_sospechoso} > __**El warn del usuario ${yield base.Getmember(data.id)} con caso \`${data.caseOfDeletedWarn}\` se ha eliminado satisfactoriamente.**__`);
                }
                catch (e) {
                    if (!String(e).startsWith(`Error:`)) {
                        yield base.message.reply(`> ${emojis_1.emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`);
                        __1.sentry.captureException(e);
                        return __1.transaction.finish();
                    }
                    base.message.reply(`${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`);
                }
            }
        });
    }
}
exports.default = NameCommand;
