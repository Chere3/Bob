import { Client, GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { timeDifference } from '../../Util/Functions/utils/textUtil';
import { getTestMode } from '../../Util/managers/littleManagers/cacheManager';

export const run = async (bot: Client, member: GuildMember) => {
    if (getTestMode() == true) return;
    if (member.guild.id !== "912858763126538281") return;
    if (member.user.bot) return;
    if (member?.partial) member.fetch().catch(() => {});

    const channel = member.guild.channels.cache.find(x => x.id == "913254279693864960") as TextChannel;
    const logs = member.guild.channels.cache.find(x => x.id == "923061304376324096") as TextChannel;
    const charal = member.guild.channels.cache.find(x => x.name.includes("charal")) as TextChannel;

    if (!channel) return global.prettyConsole.error(`No se pudo encontrar el canal de bienvenida.`);

    setTimeout(async () => {
        await logs.messages.fetch();
        const message = logs.messages.cache.map(x => x).find(x => x.content.split(" ")[0] == `exit` && x.content.split(" ")[1] == member.id);

        const args = message?.content?.split(" ") ?? [];
        var a = !args[0] ? "Una invitación desconocida" : args[2] == "vanity" ? `La Invitación del servidor __**https://discord.gg/${member.guild.vanityURLCode}**__` : args[1] == member.id ? `La invitación de ${await (await member.client.users.fetch(args[2])).tag} (**${args[3]}** personas han entrado por medio de esta invitación)` : `Una invitación desconocida`;
        try {
            var us = member.id == args[1] ? null : await member.client.users.fetch(args[1]);
        } catch (e) {
            us = null;
        }

        var p = us?.avatar !== undefined ? us.displayAvatarURL() : member.user.displayAvatarURL();
        var i = us?.avatar !== undefined ? member.user.displayAvatarURL() : null;

        var roles = member.roles.cache.size >= 20 ? member.roles.cache.size : member.roles.cache.map(x => x).map(x => `<@&${x.id}>`).slice(0, -1).join(", ");
        const embed = new MessageEmbed().setDescription(`__**Este había entrado por:**__ ${a}\n**La cuenta fue creada __${timeDifference(Date.now(), member.user.createdTimestamp)}__**\n**La cuenta llevaba en el servidor desde __${timeDifference(Date.now(), member.joinedTimestamp)}__**\n**__Roles del usuario:__**\n${roles}`).setThumbnail(p).setColor(`ORANGE`).setAuthor({name: `${member.user.tag} Salió del servidor.`, iconURL: i});
        charal.send({embeds: [embed]});
    }, 6000)
}