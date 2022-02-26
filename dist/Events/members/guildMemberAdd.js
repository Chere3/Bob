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
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const moderationManager_1 = require("../../Util/managers/moderationManager");
const index_1 = require("../../index");
const cacheManager_2 = require("../../Util/managers/cacheManager");
const textUtil_1 = require("../../Util/Functions/utils/textUtil");
const emojis_1 = require("../../Util/constants/emojis");
const run = (bot, member) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    index_1.transaction;
    try {
        const cache = yield new cacheManager_2.CacheManager(bot).get();
        if (member.guild.id !== "912858763126538281")
            return;
        if (member.user.bot)
            return;
        yield index_1.db.getData("/");
        const channel = member.guild.channels.cache.find(x => x.name.includes(`charal`));
        const verification = member.guild.channels.cache.find(x => x.name.includes(`invitaciones`));
        const welcomes = member.guild.channels.cache.find(x => x.name.includes(`bienvenido`));
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const messages = yield (yield verification.messages.fetch()).map(x => x);
            var infoinv = messages.find(x => x.content.includes(member.user.id) && Date.now() - x.createdTimestamp < 60000);
            const info = (_b = (_a = infoinv === null || infoinv === void 0 ? void 0 : infoinv.content) === null || _a === void 0 ? void 0 : _a.split(" ")) !== null && _b !== void 0 ? _b : [];
            var a;
            !info[0] ? a = `Una invitación desconocida` : info[0] == "vanity" ? a = `La invitación del servidor **__https://discord.gg/${member.guild.vanityURLCode}__**` : info[0] == member.id ? a = `La invitación de ${yield ((_c = (yield (member.client.users.fetch(info[1])))) === null || _c === void 0 ? void 0 : _c.tag)} (**${info[2]}** usuarios invitados por él/ella.)` : a = `Una invitación desconocida`;
            const embed = new discord_js_1.MessageEmbed().setDescription(`__**¡Bienvenido al servidor! ${member}**__\n\n> Por favor lee las <#913254283204493342> para evitar sanciones.\n\n> Nuestro sistema de roles es por reacción, puedes colocarte los que gustes en <#913254282319511594>, son varios canales de autorol, pero solo veras ese hasta que pongas tu primer rol.\n\n__**Ha entrado con:**__ ${a}\n**Esta cuenta fue creada __${(0, textUtil_1.timeDifference)(Date.now(), member.user.createdTimestamp)}__**ㅤ`).setColor("PURPLE");
            try {
                var us = member.id == info[1] ? null : yield (yield member.guild.members.fetch(info[1])).user;
            }
            catch (e) {
                us = null;
            }
            var p = (us === null || us === void 0 ? void 0 : us.avatar) !== undefined ? us.displayAvatarURL() : member.user.displayAvatarURL();
            var i = (us === null || us === void 0 ? void 0 : us.avatar) !== undefined ? member.user.displayAvatarURL() : null;
            embed.setAuthor({ name: member.user.tag, iconURL: i });
            if (Date.now() - member.user.createdTimestamp < 2592000000)
                embed.setColor(`YELLOW`).setAuthor({ name: `Nueva cuenta | ${member.user.tag}` });
            embed.setThumbnail(p);
            yield channel.send({ embeds: [embed], content: `||<@&913123974353932329>||` });
            const embeddd = new discord_js_1.MessageEmbed().setDescription(`__**¡Bienvenido a ${member.guild.name}! ${member}**__\n\n**> Para poder ver todos los canales pasa por <#913254282319511594>, y reacciona.**\n\n${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}\n> __**Por ultimo habla por <#913254297557413958> y diviertete en el servidor.**__\n${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}${emojis_1.emojis.separador}`).setImage(`https://media.discordapp.net/attachments/887891561562652782/888892954658357318/owo.png`).setColor(`DARK_PURPLE`).setThumbnail(member.user.displayAvatarURL());
            yield welcomes.send({ embeds: [embeddd], content: `${member} [${member.user.tag}]` });
        }), 6000);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            if (cache.muted.find(x => x.userID == member.id))
                yield new moderationManager_1.moderationUtil().roleMutedManager(member);
        }), 15000);
    }
    catch (e) {
        index_1.sentry.captureException(e);
    }
    finally {
        index_1.transaction.finish();
    }
});
exports.run = run;
