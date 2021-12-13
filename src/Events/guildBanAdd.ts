import { Client, GuildBan } from 'discord.js';
import { updateListWithNewBan } from '../Util/Functions/managers/littleManagers/listBanManager';
export const run = (client: Client, ban: GuildBan) => {
    updateListWithNewBan(ban);
}