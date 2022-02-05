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
const cacheManager_1 = require("../Util/managers/littleManagers/cacheManager");
const run = (bot, member) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    if (member.guild.id !== "912858763126538281")
        return;
    if (member.user.bot)
        return;
    const channel = member.guild.channels.cache.find(x => x.id == "913254297557413958");
    const verification = member.guild.channels.cache.find(x => x.id == "923061304376324096");
    const welcomes = member.guild.channels.cache.find(x => x.id == "913254277881946173");
    const logs = member.guild.channels.cache.find(x => x.id == "913254279693864960");
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield (yield verification.messages.fetch()).map(x => x);
        var infoinv = messages.find(x => x.content.includes(member.user.id) && Date.now() - x.createdTimestamp < 60000);
        const embed = new discord_js_1.MessageEmbed().setAuthor(member.user.username, member.user.displayAvatarURL()).setDescription(`¡Bienvenido al servidor!, te recomiendo leer las <#913254283204493342>.\n\nPara ver otras partes del servidor es importante ponerte roles\n\nSi quieres ver todos los canales del servidor ve a <#913254282319511594>\n\nSí no puedes ver todos los canales es por que no has llenado todos los roles.\nㅤ`).setColor("PURPLE");
        const info = infoinv.content.split(" ");
        if (info[0] == `vanity`) {
            infoinv = `Nadie (**discord.gg/${member.guild.vanityURLCode}**)`;
            logs.send(` > **${member.user.username}** se ha unido al servidor usando la invitacion personalizada (${member.guild.vanityURLCode})`);
            embed.addField(`Invitado por:`, `${infoinv}`);
        }
        else if (info[0] == member.id) {
            const info = infoinv.content.split(" ");
            const user = member.guild.members.cache.get(info[1]);
            logs.send(` > **${member.user.username}** se ha unido al servidor usando la invitacion de ${user.user.tag} (**${info[2]}** de los usuarios invitados, **${info[3].slice(1)}** usuarios que ha invitado han salido del servidor, **${info[4].slice(1)}** se tratan de invitaciones falsificadas)`);
            infoinv = `${user.user} (**${info[2]}** usuarios invitados al servidor)`;
            embed.addField(`Invitado por:`, `${infoinv}`);
        }
        else {
            infoinv = `**No he podido identificar quien invito a esta persona**`;
            embed.addField(`Invitado por:`, `${infoinv}`);
            logs.send(`> **${member.user.username}** se ha unido al servidor usando una invitacion que no he identificado`);
        }
        if (Date.now() - member.user.createdTimestamp < 2592000000)
            embed.setColor(`RED`).setAuthor(`CUENTA NUEVA | ${member.user.tag}`);
        embed.addField(`Edad de la cuenta`, `Cuenta creada <t:${member.user.createdTimestamp.toString().slice(0, -3)}> (<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>)`);
        channel.send({ embeds: [embed], content: `${member} Bienvenido!` });
        const embeddd = new discord_js_1.MessageEmbed().setDescription(`『${member.user.username}』 bienvenido a **${member.guild.name}** visitante **#${member.guild.memberCount}**\n\nPor favor pasa a <#913254297557413958> y diviértete.\n«💥▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬💥»\n<#913254283204493342> Entra aquí para informarte de nuestras politícas\n«💥▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬💥 »\n\n<#913254292276797560> Y lo más importante... ¡diviertete!`).setImage(`https://media.discordapp.net/attachments/887891561562652782/888892954658357318/owo.png`).setColor(`DARK_PURPLE`);
        welcomes.send({ embeds: [embeddd] });
    }), 6000);
});
exports.run = run;
