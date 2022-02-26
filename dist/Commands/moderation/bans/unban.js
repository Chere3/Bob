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
class unbanCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "Desbanea a un usuario con este comando",
            category: "Categoría",
            aliases: ["umbam", "ub"],
            mediumStaff: true,
            usage: (prefix) => "COMANDO",
            example: (prefix) => "COMANDO"
        });
    }
    run(base) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**Debes de colocar un usuario para banear.**__\n\`\`\`!unban <usuario> [razón]\n!unban ${base.member.displayName} Apeló.\`\`\``);
            const bans = yield base.message.guild.bans.fetch();
            const ban = yield (0, apiUtil_1.getBannedUser)(base.args[0], bans.map(x => x));
            var force = false;
            if (base.flags[0] == "f" && base.config.owners.includes(base.member.id))
                force = true;
            if (!ban)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**No pude encontrar al usuario que tratas de desbanear.**__\n\`\`\`!unban <usuario> [razón]\n!unban @${base.member.displayName} Apeló.\`\`\``);
            __1.transaction;
            try {
                const data = yield new moderationManager_1.banManager(null, base.member, ((_b = (_a = base.args) === null || _a === void 0 ? void 0 : _a.slice(1)) === null || _b === void 0 ? void 0 : _b.join(" ")) || `Sin razón`, force).unban(ban.user.id);
                yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**Has desbaneado a ${ban.user.tag} satisfactoriamente**__`);
            }
            catch (e) {
                if (!String(e).startsWith(`Error:`)) {
                    __1.sentry.captureException(e);
                    base.message.reply(`> ${emojis_1.emojis.internal_error} __**${base._INTERNAL_E_TEXT}__**`);
                    return __1.transaction.finish();
                }
                yield base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**${String(e).slice(6)}__**`);
            }
        });
    }
}
exports.default = unbanCommand;
