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
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const generalUtil_1 = require("../../../Util/Functions/utils/generalUtil");
const emojis_1 = require("../../../Util/constants/emojis");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "history",
            description: "Muestra el historial de todas las acciones moderativas del servidor.",
            category: "moderation",
            aliases: ["historial", "modhistory"],
            staff: true,
            cooldown: 10,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new moderationManager_1.historialManager(null, null, null, null, null, null, null, base.member.guild.id).getHistorial();
            if (!data.all || data.all.length === 0)
                return base.message.reply(`> ${emojis_1.emojis.zwo_viendo} **__No he detectado que haya historial__**`);
            const arrays = (0, generalUtil_1.separateArray)(data.all, 10);
            const embed = new discord_js_1.MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({ name: `Registros de moderación del servidor`, iconURL: base.guild.iconURL() });
            if (arrays.length == 1) {
                const text = constructWarns(arrays[0]);
                var n = 1;
                const a1 = yield base.message.reply({ embeds: [embed.setDescription(`${text.slice(9)}`)], components: [base.ar(constructMenu(arrays[0]))] });
                const aw1 = a1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                aw1.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                    const ar = arrays[0];
                    const aa = c;
                    const b = Number(aa.values[0]);
                    const embed = new discord_js_1.MessageEmbed().setColor("PURPLE").setDescription(`__**${base.guild.members.cache.get(ar[b].moderator).user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${yield (yield base.client.users.fetch(ar[b].id, { force: true })).tag}**__\n\n__${emojis_1.emojis.razon} **Razón:**__ ${ar[b].reason}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0, -3)}>**`).setAuthor({ name: yield (yield base.client.users.fetch(ar[b].id, { force: true })).tag, iconURL: yield base.avatar(ar[b].id) }).setThumbnail(yield base.avatar(ar[b].moderator));
                    aa.update({ embeds: [embed] });
                }));
            }
            else {
                const m1 = yield base.message.reply({ embeds: [embed.setDescription(constructWarns(arrays[0]).slice(9))], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis_1.emojis.right_arrow), base.b("SECONDARY", "ㅤ", "a", true), base.b("SECONDARY", "ㅤ", "b", true), base.b("SECONDARY", "q.", "left", false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[0]))] });
                const embeds = [];
                for (let i = 0; i < arrays.length; i++) {
                    embeds.push(new discord_js_1.MessageEmbed().setColor("PURPLE").setDescription(constructWarns(arrays[i], i).slice(9)).setAuthor({ name: `Registro de moderación`, iconURL: base.guild.iconURL() }).setFooter({ text: `Página ${i + 1} de ${arrays.length}` }));
                }
                var page = 0;
                const aw1 = m1.createMessageComponentCollector({ componentType: "SELECT_MENU", max: 15, time: 60000 });
                const aw2 = m1.createMessageComponentCollector({ componentType: "BUTTON", max: 15, time: 60000 });
                aw1.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                    if (m.member.id !== base.member.id)
                        return m.reply(`blep`);
                    const ar = arrays[page];
                    const aa = m;
                    const b = Number(aa.values[0]);
                    const embed = new discord_js_1.MessageEmbed().setColor("PURPLE").setDescription(`__**${base.guild.members.cache.get(ar[b].moderator).user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${yield (yield base.client.users.fetch(ar[b].id)).tag}**__\n\n__${emojis_1.emojis.razon} **Razón:**__ ${ar[b].reason}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0, -3)}>**`).setAuthor({ name: yield (yield base.client.users.fetch(ar[b].id, { force: true })).tag, iconURL: yield base.avatar(ar[b].id) }).setThumbnail(yield base.avatar(ar[b].moderator));
                    m.update({ embeds: [embed], components: [base.ar(constructMenu(arrays[page], page))] });
                }));
                aw2.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                    const cc = m;
                    if (cc.member.id !== base.message.author.id)
                        return cc.reply({ content: `blep` });
                    if (cc.customId == "right") {
                        if (page !== 0) {
                            --page;
                            yield cc.update({ embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow)), base.ar(constructMenu(arrays[page], page))] });
                        }
                        else {
                            page = [embeds.length - 1];
                            yield cc.update({ embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))] });
                        }
                    }
                    else if (cc.customId == "left") {
                        if (page < embeds.length - 1) {
                            page++;
                            yield cc.update({ embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))] });
                        }
                        else {
                            page = 0;
                            yield cc.update({ embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis_1.emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis_1.emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))] });
                        }
                    }
                }));
            }
            function constructWarns(actions, page = 0) {
                var owo;
                var num = 1;
                if (page > 0) {
                    num = page * 10 + 1;
                }
                var emoji;
                for (let i = 0; i < actions.length; i++) {
                    if (actions[i].type == "warn") {
                        emoji = "⚠";
                    }
                    else if (actions[i].type == "kick") {
                        emoji = "🚷";
                    }
                    else if (actions[i].type == "ban") {
                        emoji = "🔨";
                    }
                    else if (actions[i].type == "unban") {
                        emoji = "💨";
                    }
                    else if (actions[i].type == "mute") {
                        emoji = "🔇";
                    }
                    else if (actions[i].type == "unmute") {
                        emoji = "<:resource_basura:924934786928246794>";
                    }
                    else if (actions[i].type == "delwarn") {
                        emoji = "<:resource_basura:924934786928246794>";
                    }
                    else {
                        emoji = "DONT FOUND EMOJI _ERROR_1";
                    }
                    owo += `${emoji} #${num}: **${ucFirst(actions[i].type)}** - ${base.guild.members.cache.get(actions[i].moderator) || `No encontrado`}\n\n`;
                    num = num + 1;
                }
                return owo;
            }
            function constructMenu(actions, page = 0) {
                var _a;
                var a = [];
                var n = 0;
                var nn = 0;
                if (page > 0) {
                    n = page * 10 + 1;
                }
                for (const action of actions) {
                    const emoji = action.type == "warn" ? "⚠" : action.type == "kick" ? "🚷" : action.type == "ban" ? "🔨" : action.type == "unban" ? "💨" : action.type == "mute" ? "🔇" : action.type == "unmute" ? "<:resource_basura:924934786928246794>" : `Error in emoji for type ${action.type}`;
                    const option = {
                        value: `${nn}`,
                        label: `#${n}: ${ucFirst(action.type)} - ${((_a = base.client.users.cache.get(action.id)) === null || _a === void 0 ? void 0 : _a.tag) || `No encontrado`}`,
                        description: `${action.reason}`,
                        emoji: emoji
                    };
                    a.push(option);
                    n = n + 1;
                    nn = nn + 1;
                }
                var menu = new discord_js_1.MessageSelectMenu().addOptions(a).setCustomId("owo").setPlaceholder(`Selecciona un registro.`);
                return menu;
            }
            function ucFirst(text) {
                return text.charAt(0).toUpperCase() + text.slice(1);
            }
        });
    }
}
exports.default = NameCommand;
