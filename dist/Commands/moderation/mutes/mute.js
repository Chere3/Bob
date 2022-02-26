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
            name: "mute",
            description: "Mutea a un comando con este comando.",
            category: "moderation",
            aliases: ["muted", "mutee", "m"],
            staff: true,
            cooldown: 30,
            usage: (prefix) => "mute <user> [time] [reason]",
            example: (prefix) => "mute @user 1h spam",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar un usuario para mutear.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);
            if (!base.args[1])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__Debes de colocar un tiempo para mutear o una razón para mutear.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            var force = false;
            if (base.config.owners.includes(base.member.id) && base.flags[0] == "f")
                force = true;
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__No pude encontrar al usuario que has tratado de mencionar.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);
            if (base.args[1].match(/\d+[smhdmwy]/) == null) {
                index_1.transaction;
                try {
                    const data = yield new moderationManager_1.muteManager(member, base.member, base.args.slice(1).join(" "), "15m", force).mute();
                    yield base.channel.sendTyping();
                    yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag} ha sido muteado durante**__ \`15 minutos\`.`);
                }
                catch (error) {
                    if (!String(error).startsWith(`Error:`)) {
                        index_1.sentry.captureException(error);
                        base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                        index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(error).slice(6)}__**`);
                }
            }
            else {
                index_1.transaction;
                try {
                    const data = yield new moderationManager_1.muteManager(member, base.member, base.args.slice(2).join(" "), base.args[1].match(/\d+[smhdmwy]/)[0], force).mute();
                    yield base.channel.sendTyping();
                    yield base.message.reply(`> ${emojis_1.emojis.zwo_viendo} __**${member.user.tag} ha sido muteado durante**__ \`${(0, globals_1.Translatetime)(base.args[1].match(/\d+[smhdmwy]/)[0])}\`.`);
                }
                catch (error) {
                    if (!String(error).startsWith(`Error:`)) {
                        index_1.sentry.captureException(error);
                        base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                        return index_1.transaction.finish();
                    }
                    base.message.reply(`> ${emojis_1.emojis.zdo_tonto} **__${String(error).slice(6)}__**`);
                }
            }
        });
    }
}
exports.default = NameCommand;
