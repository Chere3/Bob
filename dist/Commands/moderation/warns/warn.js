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
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const emojis_1 = require("../../../Util/constants/emojis");
const index_1 = require("../../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "warnea con este comando a los chicos malos",
            category: "Categoría",
            staff: true,
            cooldown: 30,
            aliases: ["w", "advertir", "cwarn"],
            example: (prefix) => "warn [usuario | id | tag | apodo] [razón]",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.perro_tonto} **Debes de colocar un usuario para warnear.**\n\n\`\`\`!warn @${base.member.nickname || base.member.user.username} Flood\n!warn <usuario | tag | apodo | id> <razon>\`\`\``);
            if (!base.args[1])
                return base.message.reply(`> ${emojis_1.emojis.perro_tonto} **Debes de colocar una razón para warnear.**\n\n\`\`\`!warn @${base.member.nickname || base.member.user.username} Flood\n!warn <usuario | tag | apodo | id> <razon>\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message).catch(() => { });
            const reason = base.args.slice(1).join(" ");
            if (!member)
                return base.message.reply(`> ${emojis_1.emojis.perro_tonto} **El usuario que tratas de especificar no existe.**`);
            const number = base.args[0].match(/\d+/g);
            var force = false;
            if (base.flags[0] == "f" && base.config.owners.includes(base.message.author.id))
                force = true;
            if (!number) {
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `Advertencia 🔩` }).setDescription(`¿Estas seguro que deseas warnear a \n**${member.user.tag}**?`).setColor("DARK_PURPLE").setTimestamp();
                const w = yield base.message.reply({ embeds: [embed], components: [base.ar(base.b(`PRIMARY`, `Sí`, `si`), base.b(`SECONDARY`, `No`, `no`))] });
                const a = w.createMessageComponentCollector({ max: 15, time: 30000, componentType: "BUTTON" });
                a.on("collect", (c) => __awaiter(this, void 0, void 0, function* () {
                    if (c.member.id !== base.member.id)
                        return c.reply({ content: `> ${emojis_1.emojis.zwo_viendo} **__Solo el autor del mensaje puede hacer esto.__**`, ephemeral: true });
                    if (c.customId === "si") {
                        index_1.transaction;
                        try {
                            yield new moderationManager_1.warnManager(member, base.member, reason, force).warn();
                            base.channel.sendTyping();
                            yield w.edit({ content: `> ${emojis_1.emojis.warn} **El usuario ${member.user.tag} ha sido warneado.**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))] });
                            yield w.suppressEmbeds();
                        }
                        catch (e) {
                            if (!String(e).startsWith(`Error:`)) {
                                yield w.edit(`> ${emojis_1.emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`);
                                index_1.sentry.captureException(e);
                                return index_1.transaction.finish();
                            }
                            yield w.edit({ content: `> ${emojis_1.emojis.perro_tonto} **${String(e).slice(6)}**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))] });
                            yield w.suppressEmbeds();
                            yield c.deferUpdate();
                        }
                    }
                    else if (c.customId === "no") {
                        yield w.edit({ content: `> ${emojis_1.emojis.perro_tonto} **Comando cancelado.**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))] });
                        yield w.suppressEmbeds();
                        yield c.deferUpdate();
                    }
                }));
            }
            else {
                index_1.transaction;
                try {
                    yield new moderationManager_1.warnManager(member, base.member, reason, force).warn();
                    base.channel.sendTyping();
                    base.message.reply(`> ${emojis_1.emojis.warn} **El usuario \`${member.user.tag}\` ha sido warneado.**`);
                }
                catch (e) {
                    if (!String(e).startsWith(`Error:`)) {
                        yield base.message.reply(`> ${emojis_1.emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`);
                        yield index_1.sentry.captureException(e);
                        return yield index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.perro_tonto} **${String(e).slice(6)}**`);
                }
            }
        });
    }
}
exports.default = NameCommand;
