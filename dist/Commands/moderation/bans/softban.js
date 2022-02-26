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
const index_1 = require("../../../index");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
class SoftBan extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "softban",
            description: "Banea y desbanea a un usuario para eliminar sus mensajes en el servidor.",
            category: "moderation",
            aliases: ["softbann", "sofyban", "softbam"],
            mediumStaff: true,
            usage: (prefix) => "softban <@usuario> [días de eliminación de mensajes] [razón]",
            example: (prefix) => "softban @usuario 1d flood en todos los canales"
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Debes de colocar al usuario que quieres softbanear**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);
            if (!base.args[1])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Debes de colocar el tiempo de eliminación de mensajes o una razón**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);
            var force = false;
            if (base.flags[0] == "#f" && base.config.owners.includes(base.member.id))
                force = true;
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            if (!member)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**No se pudo encontrar al usuario**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);
            if (!base.args[1].match(/\d+[d]/)) {
                index_1.transaction;
                try {
                    yield new moderationManager_1.banManager(member, base.member, base.args.slice(1).join(" "), force).softban(member.user.id, 3);
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**El usuario ha sido softbaneado satisfactoriamente**__`);
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
                    yield new moderationManager_1.banManager(member, base.member, base.args.slice(2).join(" "), force).softban(member.user.id, parseInt(base.args[1].slice(0, -1)));
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**El usuario ha sido softbaneado satisfactoriamente**__`);
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
exports.default = SoftBan;
