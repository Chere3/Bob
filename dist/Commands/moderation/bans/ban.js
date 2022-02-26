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
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
const emojis_1 = require("../../../Util/constants/emojis");
const globals_1 = require("../../../Util/constants/globals");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const index_1 = require("../../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Banea a un usuario con este comando.",
            category: "moderation",
            aliases: ["bann", "banear", "bam", "b"],
            mediumStaff: true,
            botPermissions: ["BAN_MEMBERS"],
            usage: (prefix) => "ban <usuario> <razón | tiempo> [razón]",
            example: (prefix) => "ban @user flood"
        });
    }
    run(base) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> __**${emojis_1.emojis.zdo_tonto} Debes de poner el usuario que quieres banear**__\n\`\`\`!ban <usuario> <razon>\n!ban <usuario> <tiempo> [razon]\n!ban <usuario> <tiempo> [días de mensajes borrados] [razón]\n!ban @${base.member.displayName} 2d 1d flood de spaguetti\`\`\``);
            if (!base.args[1])
                return base.message.reply(`> __**${emojis_1.emojis.zdo_tonto} Debes de colocar la razón, o tiempo que quieres banear al usuario**__\n\`\`\`!ban <usuario> <razon>\n!ban <usuario> <tiempo> [razon]\n!ban <usuario> <tiempo> [días de mensajes borrados] [razón]\n!ban @${base.member.displayName} 2d 1d flood de spaguetti\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.config.owners.includes(base.member.id) && base.flags[0] == "f")
                force = true;
            if (!member)
                return base.message.reply(`> __${emojis_1.emojis.zdo_tonto} **El usuario que diste es invalido o no se encuentra en el servidor, intenta con otro o intenta escribiendolo diferente.**__`);
            if (base.args[1].match(/\d+[smh]/) !== null)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Lo siento, pero lo minimo que permito es \`1 día\` en formato de tiempo.**__`);
            if (base.args[1].match(/\d+[dmwy]/) !== null) {
                if (base.args[2].match(/\d+[smhmwy]/) !== null)
                    return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Lo siento, pero lo minimo que permito es \`1 día\` en formato de tiempo en la eliminación de mensajes del usuario.**__`);
                if (base.args[2].match(/\d+[d]/) !== null) {
                    const days = parseInt(base.args[2].match(/\d+[d]/)[0]);
                    const duration = base.args[1].match(/\d+[dmwy]/)[0];
                    index_1.transaction;
                    try {
                        const data = yield new moderationManager_1.banManager(member, base.member, ((_a = base.args.slice(3)) === null || _a === void 0 ? void 0 : _a.join(" ")) || "Sin razón", force).ban(duration, days);
                        base.channel.sendTyping();
                        yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así por ${(0, globals_1.Translatetime)(duration)}**__`);
                    }
                    catch (e) {
                        if (!String(e).startsWith("Error:")) {
                            index_1.sentry.captureException(e);
                            base.message.reply(`> ${emojis_1.emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`);
                            return index_1.transaction.finish();
                        }
                        base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`);
                    }
                }
                else {
                    index_1.transaction;
                    try {
                        const data = yield new moderationManager_1.banManager(member, base.member, ((_b = base.args.slice(2)) === null || _b === void 0 ? void 0 : _b.join(" ")) || "Sin razón", force).ban(base.args[1].match(/\d+[dmwy]/)[0]);
                        base.channel.sendTyping();
                        yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así por ${(0, globals_1.Translatetime)(base.args[1].match(/\d+[dmwy]/)[0])}**__`);
                    }
                    catch (e) {
                        if (!String(e).startsWith("Error:")) {
                            index_1.sentry.captureException(e);
                            base.message.reply(`> ${emojis_1.emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`);
                            return index_1.transaction.finish();
                        }
                        base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`);
                    }
                }
            }
            else {
                index_1.transaction;
                try {
                    const data = yield new moderationManager_1.banManager(member, base.member, ((_c = base.args.slice(1)) === null || _c === void 0 ? void 0 : _c.join(" ")) || "Sin razón", force).ban();
                    base.channel.sendTyping();
                    yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así indefinidamente**__`);
                }
                catch (e) {
                    if (!String(e).startsWith("Error:")) {
                        index_1.sentry.captureException(e);
                        base.message.reply(`> ${emojis_1.emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`);
                        return index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}**__`);
                }
            }
        });
    }
}
exports.default = NameCommand;
