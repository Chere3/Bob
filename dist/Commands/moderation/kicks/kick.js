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
            name: "kick",
            description: "Kickea a la persona mencionada con este comando.",
            category: "moderation",
            aliases: ["expulsar", "kicks"],
            staff: true,
            usage: (prefix) => "kick <usuario> [razón]",
            example: (prefix) => "kick @user flood"
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar el usuario que quieres expulsar.__**\n\n\`\`\`!kick <usuario> [razón]\n!kick @${base.member.displayName} spam de su cuenta de pornhub.\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.flags[0] == "f" && base.config.owners.includes(base.member.id))
                force = true;
            if (!member)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__No pude encontar al usuario que tratas de expulsar__**\n\`\`\`!kick <usuario> [razón]\n!kick @${base.member.displayName} flood\`\`\``);
            __1.transaction;
            try {
                const data = yield new moderationManager_1.kickManager(member, base.member, base.args.slice(1).join(" ") || `Sin razón`, force).kick();
                yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} **__Has expulsado a ${member.user.tag} satisfactoriamente__**`);
            }
            catch (e) {
                if (!String(e).startsWith(`Error:`)) {
                    __1.sentry.captureException(e);
                    base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                    return __1.transaction.finish();
                }
                yield base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
            }
        });
    }
}
exports.default = NameCommand;
