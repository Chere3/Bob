import { Client, GuildMember, TextChannel } from 'discord.js';

export const run = async (bot: Client, member: GuildMember) => {
    if (member.guild.id !== "912858763126538281") return;
    if (member.user.bot) return;
    if (member?.partial) member.fetch().catch(() => {});

    const channel = member.guild.channels.cache.find(x => x.id == "913254279693864960") as TextChannel;
    const logs = member.guild.channels.cache.find(x => x.id == "923061304376324096") as TextChannel;
    if (!channel) return global.prettyConsole.error(`No se pudo encontrar el canal de bienvenida.`);

    setTimeout(async () => {
        await logs.messages.fetch();
        const message = logs.messages.cache.map(x => x).find(x => x.content.split(" ")[0] == `exit` && x.content.split(" ")[1] == member.id);
        if (!message) return global.prettyConsole.error(`No se pudo encontrar el mensaje de bienvenida.`);

        const args = message.content.split(" ");
        if (message.content.split(" ")[2] == "vanity") {
            channel.send(`> ${member.user.username} salió del servidor, este entró por medio de la invitación personalizada (**${member.guild.vanityURLCode}**), este llevaba en el servidor desde <t:${member.joinedTimestamp.toString().slice(0, -3)}:R>, y se había unido ${args[3]} veces`)
        } else if (message.content.split(" ")[1] == member.id) {
            const args = message.content.split(" ");
            const user = member.guild.members.cache.get(args[2]);

            channel.send(`> ${member.user.username} salió del servidor, este entró por medio de la invitación de ${user?.user.username} (**${args[3]}** personas han entrado con esta invitación, **${args[4].slice(1)}** personas invitadas con esta invitacion han salido del servidor, **${args[5].slice(1)}** vienen de cuentas falsificadas), este llevaba en el servidor desde <t:${member.joinedTimestamp.toString().slice(0, -3)}:R>, y se había unido ${args[6]} veces`)
        }
    }, 6000)
}