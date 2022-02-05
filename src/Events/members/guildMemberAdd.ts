import { Client, GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { getTestMode } from '../../Util/managers/littleManagers/cacheManager';
export const run = async (bot: Client, member: GuildMember) => {
    if (getTestMode() == true) return;
    if (member.guild.id !== "912858763126538281") return;
    if (member.user.bot) return;

    const channel = member.guild.channels.cache.find(x => x.id == "913254297557413958") as TextChannel;
    const verification = member.guild.channels.cache.find(x => x.id == "923061304376324096") as TextChannel;
    const welcomes = member.guild.channels.cache.find(x => x.id == "913254277881946173") as TextChannel;
    const logs  = member.guild.channels.cache.find(x => x.id == "913254279693864960") as TextChannel;
    
    



    
    setTimeout(async () => {
        const messages = await (await verification.messages.fetch()).map(x => x);
        var infoinv = messages.find(x => x.content.includes(member.user.id) && Date.now() - x.createdTimestamp < 60000);
        
        const embed = new MessageEmbed().setAuthor(member.user.username, member.user.displayAvatarURL()).setDescription(`¡Bienvenido al servidor!, te recomiendo leer las <#913254283204493342>.\n\nPara ver otras partes del servidor es importante ponerte roles\n\nSi quieres ver todos los canales del servidor ve a <#913254282319511594>\n\nSí no puedes ver todos los canales es por que no has llenado todos los roles.\nㅤ`).setColor("PURPLE")

        const info = infoinv.content.split(" ");

        if (info[0] == `vanity`) {
            infoinv = `Nadie (**discord.gg/${member.guild.vanityURLCode}**)` as any;
            logs.send(` > **${member.user.username}** se ha unido al servidor usando la invitacion personalizada (${member.guild.vanityURLCode})`)
            embed.addField(`Invitado por:` , `${infoinv}`)
        } else if (info[0] == member.id) {
            // separate message content for each espace in array
            const info = infoinv.content.split(" ");
            const user = member.guild.members.cache.get(info[1])

            logs.send(` > **${member.user.username}** se ha unido al servidor usando la invitacion de ${user.user.tag} (**${info[2]}** de los usuarios invitados, **${info[3].slice(1)}** usuarios que ha invitado han salido del servidor, **${info[4].slice(1)}** se tratan de invitaciones falsificadas)`)

            infoinv = `${user.user} (**${info[2]}** usuarios invitados al servidor)` as any
            embed.addField(`Invitado por:` , `${infoinv}`)
        } else {
            infoinv = `**No he podido identificar quien invito a esta persona**` as any
            embed.addField(`Invitado por:` , `${infoinv}`)
            logs.send(`> **${member.user.username}** se ha unido al servidor usando una invitacion que no he identificado`)
        }

        // detect if account have minor of 30 days created with the created timestamp
        if (Date.now() - member.user.createdTimestamp < 2592000000) embed.setColor(`RED`).setAuthor(`CUENTA NUEVA | ${member.user.tag}`)

        embed.addField(`Edad de la cuenta`, `Cuenta creada <t:${member.user.createdTimestamp.toString().slice(0, -3)}> (<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>)`)
        channel.send({embeds: [embed], content: `${member} Bienvenido!`})
    
    
    const embeddd = new MessageEmbed().setDescription(`『${member.user.username}』 bienvenido a **${member.guild.name}** visitante **#${member.guild.memberCount}**\n\nPor favor pasa a <#913254297557413958> y diviértete.\n«💥▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬💥»\n<#913254283204493342> Entra aquí para informarte de nuestras politícas\n«💥▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬💥 »\n\n<#913254292276797560> Y lo más importante... ¡diviertete!`).setImage(`https://media.discordapp.net/attachments/887891561562652782/888892954658357318/owo.png`).setColor(`DARK_PURPLE`)
    
    welcomes.send({embeds: [embeddd]});
    
    }, 6000)
    
}