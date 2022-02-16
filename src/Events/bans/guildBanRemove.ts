import { Client, GuildBan } from 'discord.js';
import { banManager } from '../../Util/managers/moderationManager';
import { moderationBotLogs } from '../../Util/managers/loggerManager';

export const run = async (client: Client, ban: GuildBan) => {
    const data = await client.cache;
    const find = data.bans.find(b => b.id === ban.user.id);

    if (find) {
        ban.guild.members.ban(ban.user.id, { reason: 'Automoderador: Solo yo puedo desbanear a las personas que son baneadas por mí.' });
        await new moderationBotLogs(null, client.guilds.cache.get(`912858763126538281`).me, `Automoderador: Yo solo puedo desbanear a las personas que yo mismo baneo.`, `0`).sendBanLog(ban.user);
    } else {
        return;
    }
}