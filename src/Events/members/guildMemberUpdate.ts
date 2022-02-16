import { Client, GuildMember, TextChannel } from 'discord.js';
export const run = async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
    
    if (newMember.joinedTimestamp - Date.now() < 60000 && !newMember.roles.cache.has(`913124108512931861`)) return;
    const cache = client.cache;
    const a = cache.muted.find(x => x.userID == newMember.id);
    if (a == undefined) return;
    if (a.ExitedPeriod == true) return;
    
    // detects if the new member get new roles
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const newRole = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
        if (newRole) {
            if (newRole.id == "913124108512931861") return;

            newMember.roles.remove(newRole.id);
            if (!newMember.roles.cache.has(`913124108512931861`)) {
                newMember.roles.add(`913124108512931861`);
            } 
        }
    }

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const oldRole = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
        if (oldRole) {
            if (oldRole.name == "Silenciado") newMember.roles.add(oldRole.id); 
        }
    }
}