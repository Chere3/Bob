import { Client, GuildBan } from 'discord.js';
import { getTestMode } from '../Util/Functions/managers/littleManagers/cacheManager';
import { updateListWithNewBan } from '../Util/Functions/managers/littleManagers/listBanManager';
export const run = (client: Client, ban: GuildBan) => {
    if (getTestMode() == true) return;
    updateListWithNewBan(ban);
}