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
exports.run = void 0;
const discord_js_1 = require("discord.js");
const textUtil_1 = require("../../Util/Functions/utils/textUtil");
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const run = (bot, member) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    if (member.guild.id !== "912858763126538281")
        return;
    if (member.user.bot)
        return;
    if (member === null || member === void 0 ? void 0 : member.partial)
        member.fetch().catch(() => { });
    const channel = member.guild.channels.cache.find(x => x.id == "913254279693864960");
    const logs = member.guild.channels.cache.find(x => x.id == "923061304376324096");
    const charal = member.guild.channels.cache.find(x => x.name.includes("charal"));
    if (!channel)
        return global.prettyConsole.error(`No se pudo encontrar el canal de bienvenida.`);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        yield logs.messages.fetch();
        const message = logs.messages.cache.map(x => x).find(x => x.content.split(" ")[0] == `exit` && x.content.split(" ")[1] == member.id);
        const args = (_b = (_a = message === null || message === void 0 ? void 0 : message.content) === null || _a === void 0 ? void 0 : _a.split(" ")) !== null && _b !== void 0 ? _b : [];
        var a = !args[0] ? "Una invitación desconocida" : args[2] == "vanity" ? `La Invitación del servidor __**https://discord.gg/${member.guild.vanityURLCode}**__` : args[1] == member.id ? `La invitación de ${yield (yield member.client.users.fetch(args[2])).tag} (**${args[3]}** personas han entrado por medio de esta invitación)` : `Una invitación desconocida`;
        try {
            var us = member.id == args[1] ? null : yield member.client.users.fetch(args[1]);
        }
        catch (e) {
            us = null;
        }
        var p = (us === null || us === void 0 ? void 0 : us.avatar) !== undefined ? us.displayAvatarURL() : member.user.displayAvatarURL();
        var i = (us === null || us === void 0 ? void 0 : us.avatar) !== undefined ? member.user.displayAvatarURL() : null;
        var roles = member.roles.cache.size >= 20 ? member.roles.cache.size : member.roles.cache.map(x => x).map(x => `<@&${x.id}>`).slice(0, -1).join(", ");
        const embed = new discord_js_1.MessageEmbed().setDescription(`__**Este había entrado por:**__ ${a}\n**La cuenta fue creada __${(0, textUtil_1.timeDifference)(Date.now(), member.user.createdTimestamp)}__**\n**La cuenta llevaba en el servidor desde __${(0, textUtil_1.timeDifference)(Date.now(), member.joinedTimestamp)}__**\n**__Roles del usuario:__**\n${roles}`).setThumbnail(p).setColor(`ORANGE`).setAuthor({ name: `${member.user.tag} Salió del servidor.`, iconURL: i });
        charal.send({ embeds: [embed] });
    }), 6000);
});
exports.run = run;
