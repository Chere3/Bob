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
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const emojis_1 = require("../../Util/constants/emojis");
const socialCommandsManager_1 = require("../../Util/managers/littleManagers/socialCommandsManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "fuck",
            description: "cogete a alguien con este comando.",
            aliases: ["fucks", "ass", "coger", "ride"],
            category: "social",
            cooldown: 10,
            nsfw: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var a = yield (0, socialCommandsManager_1.getFinalResult)(base.message, "fucks");
            }
            catch (e) {
                if (e == "TypeError: NAN_USER") {
                    return base.message.reply(`> ${emojis_1.emojis.zdo_tonto} __**Para usar este comando debes de mencionar a alguien**__\n\`\`\`!fuck ${base.member.displayName}\n!fuck <@usuario>\`\`\``);
                }
                else if (e == "TypeError: EQUAL_AUTHOR") {
                    return base.message.reply(`No te puedes coger a ti mismo.`);
                }
            }
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(a.description)
                .setImage(a.image)
                .setFooter(`${a.userS.username} lleva ${a.user} cogidas recibidas.`, a.userS.displayAvatarURL())
                .setColor("PURPLE");
            return base.message.reply({ embeds: [embed] });
        });
    }
}
exports.default = NameCommand;
