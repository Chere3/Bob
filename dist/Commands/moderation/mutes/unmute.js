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
const index_1 = require("../../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "unmute",
            description: "Desmutea a un usuario con este comando.",
            category: "moderation",
            aliases: ["desmute", "delmute", "deletemute", "um"],
            cooldown: 30,
            usage: (prefix) => "unmute <usuario>",
            example: (prefix) => "unmute @usuario",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Debes de mencionar a un usuario para desmutear.**__\n\`\`\`!unmute <usuario> [razon]\n!unmute @${base.member.displayName} se portó bien.\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.config.owners.includes(base.member.id) && base.flags[0] == "f")
                force = true;
            index_1.transaction;
            try {
                const data = yield new moderationManager_1.muteManager(member, base.member, base.args.slice(1).join(" "), null, force).unmute();
                yield base.channel.sendTyping();
                yield base.message.reply(`> ${emojis_1.emojis.zdo_sospechoso} **__${member.user.tag}__ ha sido desmuteado satisfactoriamente.**`);
            }
            catch (e) {
                if (!String(e).startsWith(`Error:`)) {
                    index_1.sentry.captureException(e);
                    base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                    return index_1.transaction.finish();
                }
                yield base.channel.sendTyping();
                yield base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
            }
        });
    }
}
exports.default = NameCommand;
