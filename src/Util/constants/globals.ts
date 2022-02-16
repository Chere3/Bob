import { GuildMember } from 'discord.js';
import { levels } from './moderationDataManager';

/**
 * 
 * @param member - El usuario a obtener
 * @returns {string} The avatar URL.
 */

export async function avatar(member:GuildMember) {
    return member.displayAvatarURL() || member.user.displayAvatarURL();
}

/**
 * @param member - El usuario a obetener
 * @returns {string} El nivel de staff
 */

export function checkLevel(member: GuildMember): levels {
    if (member.permissions.has('ADMINISTRATOR')) return 'creator';
    if (member.roles.cache.has(`913123943941025822`)) return `high staff`
    if (member.roles.cache.has(`913123947397148682`)) return `medium staff`
    if (member.permissions.has(`MANAGE_MESSAGES`)) return `staff`
    return `normal member`
}

/**
 * @param time - El tiempo en formato <"numero"><"primera letra del formato de tiempo">
 * @returns {string} El tiempo traducido en <numero> <unidad de tiempo>
 */

export function Translatetime(time: string) {
    if (time.includes('s')) return `${time.replace('s', '')} segundos`;
    if (time.includes('m')) return `${time.replace('m', '')} minutos`;
    if (time.includes('h')) return `${time.replace('h', '')} horas`;
    if (time.includes('d')) return `${time.replace('d', '')} días`;
    if (time.includes('w')) return `${time.replace('w', '')} meses`;
    if (time.includes('y')) return `${time.replace('y', '')} años`;
    return;
}