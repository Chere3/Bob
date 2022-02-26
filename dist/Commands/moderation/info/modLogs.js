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
const userManager_1 = require("../../../Util/managers/userManager");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const generalUtil_1 = require("../../../Util/Functions/utils/generalUtil");
const emojis_1 = require("../../../Util/constants/emojis");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "modlogs",
            description: "Muestra el historial que un moderador ha tenido en el servidor.",
            category: "moderation",
            aliases: ["logsmod", "logs"],
            staff: true,
            cooldown: 10,
            usage: (prefix) => "COMANDO",
            example: (prefix) => "COMANDO"
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (yield (0, apiUtil_1.getPerson)(base.args[0], base.message)) || base.message.author;
                const logs = yield (yield (0, userManager_1.getDBUser)(user.id)).modLogs;
                if (!logs || logs.length <= 0)
                    return base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${user.username}** no tiene registros de moderación.__`);
                const arrays = (0, generalUtil_1.separateArray)(logs, 10);
                const embed = new discord_js_1.MessageEmbed().setColor("DARK_PURPLE").setAuthor(`Registros de moderación de ${user.username}`, user.displayAvatarURL());
                if (arrays.length == 1) {
                    const text = constructWarns(arrays[0]);
                    var n = 1;
                    const a1 = yield base.message.reply({ embeds: [embed.setDescription(`${text.slice(9)}`)], components: [base.ar(constructMenu(arrays[0]))] });
                    const aw1 = a1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                    aw1.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const ar = arrays[0];
                        const aa = m;
                        const b = Number(aa.values[0]);
                        const embed = new discord_js_1.MessageEmbed().setColor("PURPLE").setAuthor(`${user.username}`, user.displayAvatarURL()).setThumbnail(((_a = base.guild.members.cache.get(ar[b].userID)) === null || _a === void 0 ? void 0 : _a.displayAvatarURL()) || (yield (yield base.client.users.fetch(ar[b].userID)).displayAvatarURL())).setDescription(`__**${user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${yield (yield base.client.users.fetch(ar[b].userID)).tag}**__\n\n__${emojis_1.emojis.razon} **Razón:**__ ${ar[b].reason}\n${emojis_1.emojis.zd_regalo} **__Estado:__** ${ar[b].status == "activo" ? `Activo ${emojis_1.emojis.status_activo} ` : `Borrado: ${emojis_1.emojis.status_inactivo}`}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0, -3)}>**`);
                        aa.update({ embeds: [embed] });
                    }));
                }
                else {
                    const m1 = yield base.message.reply({ embeds: [embed.setDescription(constructWarns(arrays[0]).slice(9))], components: [base.ar(base.b("SECONDARY", ".", "right", false, "<:rs_arrow_right:925996565049516062>"), base.b("SECONDARY", "ㅤ", "a", true), base.b("SECONDARY", "ㅤ", "b", true), base.b("SECONDARY", "<:rs_arrow_right:925996565049516062>", "left", false, "<:rs_arrow_left:925998028467351552>")), base.ar(constructMenu(arrays[0]))] });
                    const embeds = [];
                    for (let i = 0; i < arrays.length; i++) {
                        embeds.push(new discord_js_1.MessageEmbed().setColor("DARK_PURPLE").setAuthor(`Registros de moderación de ${user.username}`, user.displayAvatarURL() || base.member.user.displayAvatarURL()).setDescription(constructWarns(arrays[i], i).slice(9)));
                    }
                    var page = 0;
                    const aw1 = m1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                    const aw2 = m1.createMessageComponentCollector({ componentType: "BUTTON", max: 15, time: 60000 });
                    aw1.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        var _b;
                        if (m.member.id != base.member.id)
                            return m.reply({ content: `${emojis_1.emojis.zwo_viendo} __**¡Hey!, solo el autor del mensaje puede hacer esto**_`, ephemeral: true });
                        const ar = arrays[page];
                        const aa = m;
                        const b = Number(aa.values[0]);
                        const embed = new discord_js_1.MessageEmbed().setColor("PURPLE").setAuthor(`${user.username}`, user.displayAvatarURL()).setThumbnail(((_b = base.guild.members.cache.get(ar[b].userID)) === null || _b === void 0 ? void 0 : _b.displayAvatarURL()) || (yield (yield base.client.users.fetch(ar[b].userID)).displayAvatarURL())).setDescription(`__**${user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${yield (yield base.client.users.fetch(ar[b].userID)).tag}**__\n\n__${emojis_1.emojis.razon} **Razón:**__ ${ar[b].reason}\n${emojis_1.emojis.zd_regalo} **__Estado:__** ${ar[b].status == "activo" ? `Activo ${emojis_1.emojis.status_activo} ` : `Borrado ${emojis_1.emojis.status_inactivo}`}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0, -3)}>**`);
                        m.update({ embeds: [embed], components: [base.ar(constructMenu(arrays[page], page))] });
                    }));
                    aw2.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                        const cc = m;
                        if (cc.member.id !== base.message.author.id)
                            return cc.reply({ content: `${emojis_1.emojis.zwo_viendo} __**Hey! Solo el autor del mensaje puede hacer esto**__`, ephemeral: true });
                        if (cc.customId == "right") {
                            if (page !== 0) {
                                --page;
                                cc.update({ embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[page], page))] });
                            }
                            else {
                                page = [embeds.length - 1];
                                cc.update({ embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[page], page))] });
                            }
                        }
                        else if (cc.customId == "left") {
                            if (page < embeds.length - 1) {
                                page++;
                                cc.update({ embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[page], page))] });
                            }
                            else {
                                page = 0;
                                cc.update({ embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[page], page))] });
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
                        owo += ` ${warns[i].status == "activo" ? "<:resource_active:925990699130814495>" : "<:resource_inactive:925990473682784316>"} #${num}: **${ucFirst(warns[i].type)}** - ${base.client.users.cache.get(warns[i].userID) || `No encontrado`}\n\n`;
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
                        const emoji = log.status == "activo" ? "<:resource_active:925990699130814495>" : "<:resource_inactive:925990473682784316>";
                        const option = {
                            value: `${nn}`,
                            label: `#${number}: ${ucFirst(log.type)} - ${((_a = base.client.users.cache.get(log.userID)) === null || _a === void 0 ? void 0 : _a.tag) || "No encontrado"}`,
                            description: `${log.reason}`,
                            emoji: emoji
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
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = NameCommand;
