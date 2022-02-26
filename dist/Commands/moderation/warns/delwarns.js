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
const emojis_1 = require("../../../Util/constants/emojis");
const apiUtil_1 = require("../../../Util/Functions/utils/apiUtil");
const userManager_1 = require("../../../Util/managers/userManager");
const moderationManager_1 = require("../../../Util/managers/moderationManager");
const __1 = require("../../..");
const index_1 = require("../../../index");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "caca",
            aliases: ["dws"],
            highStaff: true,
            cooldown: 30,
            dev: true
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Debes de especificar un usuario para borrar todos sus warns.**__\n\`\`\`!delwarns <usuario | tag | id | apodo | nickname> [razon opcional]\n!delwarns @${base.message.author.username} flood.\`\`\``);
            var force = false;
            if (base.flags[0] == "f" && base.config.owners.includes(base.member.id)) {
                force = true;
            }
            ;
            const member = yield (0, apiUtil_1.getMember)(base.args[0], base.message);
            if (!member)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**No se encontro al usuario.**__`);
            const dbuser = yield (0, userManager_1.getDBUser)(member.id);
            if (dbuser.warns == 0 && dbuser.warnsHistory.length == 0)
                return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**No puedes eliminar los warns de ${yield base.name(member.id)}. dado que el/ella no tiene warns.**__`);
            const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `Borrar los warns de ${yield base.name(member.id)}`, iconURL: yield base.avatar(member.id) }).setDescription(`¿Estas seguro que __**deseas eliminar todos los warns de**__ \`${yield base.name(member.id)}\`?`).setColor("ORANGE");
            const m1 = yield base.message.reply({ embeds: [embed], components: [base.ar(base.b("SECONDARY", ".", "si", false, emojis_1.emojis.rs_palomita), base.b("SECONDARY", ".", "no", false, emojis_1.emojis.rs_x))] });
            const w1 = yield m1.createMessageComponentCollector({ filter: (m) => m.member.id == base.message.author.id, time: 60000 });
            w1.on("collect", (m) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const mm = m;
                if (mm.customId == "si") {
                    index_1.transaction;
                    try {
                        mm.update({ content: `> ${emojis_1.emojis.zwo_viendo} __**Se han eliminado ${dbuser.warnsHistory.length} warns de ${yield base.name(member.id)}.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", ".", true))] });
                        yield new moderationManager_1.warnManager(member, base.member, ((_a = base.args.slice(1)) === null || _a === void 0 ? void 0 : _a.join(" ")) || null, force).delwarns();
                        yield m1.suppressEmbeds();
                    }
                    catch (e) {
                        if (!String(e).startsWith(`Error:`)) {
                            __1.sentry.captureException(e);
                            base.message.reply(`> ${emojis_1.emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`);
                            return index_1.transaction.finish();
                        }
                        m1.edit({ content: `> ${emojis_1.emojis.zwo_viendo} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", ".", true))] });
                        yield m1.suppressEmbeds();
                    }
                }
            }));
        });
    }
}
exports.default = NameCommand;
