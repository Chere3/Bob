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
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const globals_1 = require("../../../Util/constants/globals");
const index_1 = require("../../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "timeout",
            description: "Caracteristica de discord para reemplazar al mute",
            category: "moderation",
            aliases: ["mutte", "fuera", "t"],
            highStaff: true,
            usage: (prefix) => "timeout <usuario> <tiempo> <razon>",
            example: (prefix) => "timeout @user 5m No se ha estado en el chat",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar al usuario que quieres dejar tiempo fuera.__**\n\n\`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);
            if (!base.args[1])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar el tiempo o la razón por la que quieres dejar fuera al usuario.__**\n\n\`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.config.owners.includes(base.member.id) && base.flags[0] == "f")
                force = true;
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__No pude encontrar al usuario que especificaste__**\n\n \`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);
            if (base.args[1].match(/\d+[smhdwmy]/) == null) {
                index_1.transaction;
                try {
                    const data = yield new moderationManager_1.timeoutManager(member, base.member, base.args.slice(1).join(" "), "15m", force).timeout();
                    yield base.channel.sendTyping();
                    yield base.channel.send(`> ${emojis_1.emojis.zwo_viendo} **__${member.user.tag} ha sido dejado fuera por__** \`15 minutos\`.`);
                }
                catch (e) {
                    if (!String(e).startsWith(`Error:`)) {
                        index_1.sentry.captureException(e);
                        base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                        return index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
                }
            }
            else {
                index_1.transaction;
                try {
                    const data = yield new moderationManager_1.timeoutManager(member, base.member, base.args.slice(2).join(" "), base.args[1].match(/\d+[smhdwmy]/)[0], force).timeout();
                    yield base.channel.sendTyping();
                    yield base.channel.send(`> ${emojis_1.emojis.zwo_viendo} **__${member.user.tag} ha sido dejado fuera por__** \`${(0, globals_1.Translatetime)(base.args[1].match(/\d+[smhdmwy]/)[0])}\`.`);
                }
                catch (e) {
                    if (!String(e).startsWith(`Error:`)) {
                        index_1.sentry.captureException(e);
                        base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                        return index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
                }
            }
        });
    }
}
exports.default = NameCommand;
