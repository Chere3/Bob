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
const __1 = require("../../..");
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
const emojis_1 = require("../../../Util/constants/emojis");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "untimeout",
            description: "Caracteristica de discord para reemplazar el unmute.",
            category: "moderation",
            aliases: ["untimeout", "dentro", "ut"],
            highStaff: true,
            usage: (prefix) => "untimeout <usuario>",
            example: (prefix) => "untimeout @user"
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar el usuario que quieres quitarle el tiempo fuera.__**\n\n\`\`\`!untimeout <usuario> [razón]\n!untimeout @${base.member.displayName}\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.config.owners.includes(base.member.id) && base.flags[0] == "f")
                force = true;
            if (!member)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__No pude encontar al usuario que tratas de quitarle el tiempo fuera__**\n\`\`\`!untimeout <usuario> [razón]\n!untimeout @${base.member.displayName} fue un error\`\`\``);
            __1.transaction;
            try {
                const data = yield new moderationManager_1.timeoutManager(member, base.member, base.args.slice(1).join(" "), null, force).unTimeout();
                yield base.channel.sendTyping();
                base.channel.send(`> ${emojis_1.emojis.zdo_tonto} **__${member.displayName} ha sido retirado del tiempo fuera.__**`);
            }
            catch (e) {
                if (!String(e).startsWith(`Error:`)) {
                    __1.sentry.captureException(e);
                    base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                    return __1.transaction.finish();
                }
                base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
            }
        });
    }
}
exports.default = NameCommand;
