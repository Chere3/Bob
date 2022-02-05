import { Client, GuildMember, TextChannel } from 'discord.js';
export const run = async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
    const cache = client.cache;
    if (cache.muted.find(x => x.userID == newMember.id) == undefined) return;
    // detects if the new member get new roles
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const newRole = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
        if (newRole) {
            if (newRole.name == "Silenciado") return;

            newMember.roles.remove(newRole.id); 
        }
    }

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const oldRole = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
        if (oldRole) {
            if (oldRole.name == "Silenciado") newMember.roles.add(oldRole.id); 
        }
    }
}