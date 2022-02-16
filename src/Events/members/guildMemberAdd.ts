import { Client, GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { getTestMode } from '../../Util/managers/littleManagers/cacheManager';
import { moderationUtil, muteManager } from '../../Util/managers/moderationManager';
import { sentry, transaction, db } from '../../index';
import { CacheManager } from '../../Util/managers/cacheManager';
import { inspect } from 'util';
import { timeDifference } from '../../Util/Functions/utils/textUtil';
import { emojis } from '../../Util/constants/emojis';
export const run = async (bot: Client, member: GuildMember) => {
    if (getTestMode() == true) return;
    transaction
    try {
    const cache = await new CacheManager(bot).get();
    
    
    
    if (member.guild.id !== "912858763126538281") return;
    if (member.user.bot) return;
    await db.getData("/")

    const channel = member.guild.channels.cache.find(x => x.name.includes(`charal`)) as TextChannel;
    const verification = member.guild.channels.cache.find(x => x.name.includes(`invitaciones`)) as TextChannel;
    const welcomes = member.guild.channels.cache.find(x => x.name.includes(`bienvenido`)) as TextChannel;
    

    

    setTimeout(async () => {
        const messages = await (await verification.messages.fetch()).map(x => x);
        var infoinv = messages.find(x => x.content.includes(member.user.id) && Date.now() - x.createdTimestamp < 60000);

        const info = infoinv?.content?.split(" ") ?? [];

        var a; !info[0] ? a = `Una invitación desconocida` : info[0] == "vanity" ? a = `La invitación del servidor **__https://discord.gg/${member.guild.vanityURLCode}__**` : info[0] == member.id ? a = `La invitación de ${await (await (member.client.users.fetch(info[1])))?.tag} (**${info[2]}** usuarios invitados por él/ella.)` : a = `Una invitación desconocida`;
        const embed = new MessageEmbed().setDescription(`__**¡Bienvenido al servidor! ${member}**__\n\n> Por favor lee las <#913254283204493342> para evitar sanciones.\n\n> Nuestro sistema de roles es por reacción, puedes colocarte los que gustes en <#913254282319511594>, son varios canales de autorol, pero solo veras ese hasta que pongas tu primer rol.\n\n__**Ha entrado con:**__ ${a}\n**Esta cuenta fue creada __${timeDifference(Date.now(), member.user.createdTimestamp)}__**ㅤ`).setColor("PURPLE")

        try {
        var us = member.id == info[1] ? null : await (await member.guild.members.fetch(info[1])).user;
        } catch (e) {
            us = null
        }

        var p = us?.avatar !== undefined ? us.displayAvatarURL() : member.user.displayAvatarURL();
        var i = us?.avatar !== undefined ? member.user.displayAvatarURL() : null;

        embed.setAuthor({name: member.user.tag, iconURL: i})
        if (Date.now() - member.user.createdTimestamp < 2592000000) embed.setColor(`YELLOW`).setAuthor({name:`Nueva cuenta | ${member.user.tag}`});

        embed.setThumbnail(p);
        await channel.send({embeds: [embed], content: `||<@&913123974353932329>||`});
    
    
    const embeddd = new MessageEmbed().setDescription(`__**¡Bienvenido a ${member.guild.name}! ${member}**__\n\n**> Para poder ver todos los canales pasa por <#913254282319511594>, y reacciona.**\n\n${
        emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}\n> __**Por ultimo habla por <#913254297557413958> y diviertete en el servidor.**__\n${
            emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}${emojis.separador}`).setImage(`https://media.discordapp.net/attachments/887891561562652782/888892954658357318/owo.png`).setColor(`DARK_PURPLE`).setThumbnail(member.user.displayAvatarURL())
    await welcomes.send({embeds: [embeddd], content: `${member} [${member.user.tag}]`});
}, 6000)

setTimeout(async () => {
    if (cache.muted.find(x => x.userID == member.id)) await new moderationUtil().roleMutedManager(member);
}, 15000);

} catch (e) {
    sentry.captureException(e);
} finally {
    transaction.finish();
}
    
}