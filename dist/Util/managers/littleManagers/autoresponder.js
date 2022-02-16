"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spammer = void 0;
const discord_js_1 = require("discord.js");
const cacheManager_1 = require("./cacheManager");
function spammer(message) {
    if (message.author.bot)
        return;
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`¡Pruebame!`)
        .setDescription(`Ahora puedes **usar un mejor bot**, ¿recuerdas un bot llamado *utilities* que contaba las **acciones que haces?** pues este bot ha vuelto de forma mejorada.\n\nSolo pon:\n\`!hug\`\n\`!kiss\`\n\`!pat\``)
        .setColor("ORANGE");
    const component = new discord_js_1.MessageButton()
        .setLabel(`Cerrar mensaje`)
        .setStyle("DANGER")
        .setCustomId(`spam_close`);
    const row = new discord_js_1.MessageActionRow().addComponents(component);
    if (message.content.toLowerCase().startsWith("d!hug") ||
        message.content.toLowerCase().startsWith("d!kiss") ||
        message.content.toLowerCase().startsWith("d!pat") ||
        message.content.toLowerCase().startsWith("d!ride") ||
        message.content.toLowerCase().startsWith("furhug") ||
        message.content.toLowerCase().startsWith("furride") ||
        message.content.toLowerCase().startsWith("furfuck") ||
        message.content.toLowerCase().startsWith("furkiss") ||
        message.content.toLowerCase().startsWith("furpat") ||
        message.content.toLowerCase().startsWith("furhug") ||
        message.content.toLowerCase().startsWith(",kiss"))
        return message.reply({
            embeds: [embed],
            components: [row],
        });
}
exports.spammer = spammer;
