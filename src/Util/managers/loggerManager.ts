import { Client, GuildMember, MessageEmbed, TextChannel, User } from 'discord.js';
import { emojis } from '../constants/emojis';
import { warn } from '../../Database/schemas/User';
import { avatar } from '../constants/globals';
import { Translatetime } from '../constants/globals';
import { managerError, sentry } from '../../index';



/**
 * @class LogsManager Maneja los logs del bot.
 * @param {Client} client - El cliente del bot.
 */

export class logsManager {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    // soon, bump to 2.5.0
}



/**
 * @class moderationBotLogs Maneja los logs del bot al sancionar a alguien por el mismo bot.
 * @param {GuildMember} member - El usuario sancionado,
 * @param {GuildMember} moderator - El moderador que sancionó al usuario,
 * @param {string} reason - La razón de la sancion,
 * @param {string} case - El id del caso.
 * @param {string} time - El tiempo en el que se sancionó.
 */

export class moderationBotLogs extends logsManager {
    member: GuildMember;
    moderator: GuildMember;
    reason: string
    case: string
    time?: string
    caseNumberr: string;


    /**
     * @constructor moderationBotLogs Maneja los logs del bot al sancionar a alguien por el mismo bot.
     * @param {GuildMember} member - El usuario sancionado,
     * @param {GuildMember} moderator - El moderador que sancionó al usuario,
     * @param {string} reason - La razón de la sancion,
     * @param {string} case - El id del caso.
     * @param {string} time - El tiempo en el que se sancionó.
     */

    constructor(member: GuildMember, moderator: GuildMember, reason: string, caseNumber: string, time?: string, caseNumberr?: string) {
        super(moderator.client);
        this.member = member;
        this.moderator = moderator;
        this.reason = reason;
        this.case = caseNumber;
        this.time = time;
        this.caseNumberr = caseNumberr;
    }

    /**
     * @method El metodo encargado de enviar el mensaje de log al canal de logs y de mensaje privado al usuario.
     */

    logWarn() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor(`${this.moderator.nickname || this.moderator.user.username}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, this.moderator.displayAvatarURL() || this.moderator.user.displayAvatarURL()).setColor(`PURPLE`).setDescription(`❌ **Ha warneado a:** \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razon:**__: ${this.reason || "Sin razón."}\n ${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(this.member.displayAvatarURL() || this.member.user.displayAvatarURL());
        this.sendPrivateMessage();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado solo de enviar mensaje privado al usuario.
     */

    sendPrivateMessage() {
        managerError;
        try {
        const text = `**Has sido advertido en ${this.member.guild.name}**\n${emojis.razon} __**Razón:**__ ${this.reason}\n ${emojis.zwo_viendo} __**ID de caso:**__ \`${this.case}\``;

        return this.member.send(text).catch(() => {})
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el mensaje de log que se borro el warn correctamente.
     */

    sendWarnDeleteLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({"name": `${this.moderator.nickname || this.moderator.user.username}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: this.moderator.displayAvatarURL() || this.moderator.user.displayAvatarURL()}).setColor(`PURPLE`).setDescription(`${emojis.status_inactivo} __**Ha borrado el warn de:**__\n\`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razon:**__: ${this.reason || "Sin razón."}\n ${emojis.zwo_viendo} __**ID del caso:**__\n \`\`\`fix\n${this.case}\`\`\`\n__**ID del caso borrado:**__ \`\`\`fix\n${this.caseNumberr}\`\`\``).setTimestamp().setThumbnail(this.member.displayAvatarURL() || this.member.user.displayAvatarURL());
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar un mensaje diciendo que se borraron multiples warns.
     * @param {warn[]} Los warns 
     */

    async sendWarnsDeleteLog(warns: warn[]) {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`>>> ${emojis.warn} __**Cantidad de warns borrados:**__ ${warns.length}\n ${emojis.razon} __**Razón de borrado masivo**__: ${this.reason || "No hay razón."}\n`).setThumbnail(`${await avatar(this.member)}`).setColor("PURPLE");
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el mensaje por md a un usuario que fue muteado.
     * @param {string} time - El tiempo en el que se muteo.
     */

    async sendDMMuteLog() {
        managerError;
        try {
        const channel = this.member;
        
        return channel.send(`**__Has sido muteado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n⏰ __**Tiempo:**__ ${Translatetime(this.time)}\n${emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => {});

       } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es muteado.
     * @param {string} time - El tiempo en el que se muteo.
     */

    async sendMuteLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha muteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${Translatetime(this.time)}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("PURPLE")
        this.sendDMMuteLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar al md del destinatario que ha sido desmuteado.
     */

    async sendDMUnmuteLog() {
        managerError
        try {
        const channel = this.member;
        return channel.send(`**__Has sido desmuteado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n${emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es desmuteado.
     */

    async sendUnmuteLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha desmuteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member));
        this.sendDMUnmuteLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el mensaje por md a un usuario que fue timeouteado.
     */

    async sendDMTimeoutLog() {
        managerError;
        try {
        const channel = this.member;
        return channel.send(`**__Has sido timeouteado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n⏰ __**Tiempo:**__ ${Translatetime(this.time)}\n${emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es timeouteado.
     */

    async sendTimeoutLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha timeouteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${Translatetime(this.time)}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("PURPLE");
        this.sendDMTimeoutLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el mensaje por md a un usuario que fue destimeouteado.
     */

    async sendDMUntimeoutLog() {
        managerError;
        try {
        const channel = this.member;
        return channel.send(`**__Has sido destimeouteado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n${emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es destimeouteado.
     */

    async sendUntimeoutLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha destimeouteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("PURPLE");
        this.sendDMUntimeoutLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el mensaje por md a un usuario que fue kickeado.
     */

    async sendDMKickLog() {
        managerError;
        try {
        const channel = this.member;
        return channel.send(`**__Has sido kickeado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n${emojis.status_activo} **__ID de caso:__** ${this.case}\n\nSí crees que se trata de un error, puedes apelar el kickeó en este servidor:\nhttps://discord.gg/ZD8j2G69EW`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es kickeado.
     */

    async sendKickLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha kickeado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("RED");
        await this.sendDMKickLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }


    /**
     * @method Metodo encargado de enviar un mensaje al md cuando un usuario es kickeado.
     */

    async sendDMBanLog() {
        managerError;
        try {
        const channel = this.member;
        return channel.send(`**__Has sido baneado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n${emojis.status_activo} **__ID de caso:__** ${this.case}\n\n__**Sí crees que se trata de un error, puedes apelar el baneo en este servidor:**__\nhttps://discord.gg/ZD8j2G69EW`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }


    /**
     * @method Metodo encargado de enviar el log cuando un usuario es baneado.
     */

    async sendBanLog(user?: User) {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha baneado a:**_ \`${this.member.user.tag ?? user.tag}\` ( ${this.member.id ?? user.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${this.time == null ? `Indefinido` : Translatetime(this.time)}\n${emojis.zwo_viendo}__**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("RED");
        await this.sendDMBanLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de enviar el log cuando un usuario es desbaneado.
     */

    async sendUnbanLog(user: User) {
        managerError;
        try {
        const channel = this.moderator.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha desbaneado a:**_ \`${user.tag}\` ( ${user.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await user.displayAvatarURL()).setColor("GREEN");
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de mandarle un mensaje al md al usuario cuando este es softbaneado
     */

    async sendDMSoftbanLog() {
        managerError;
        try {
        const channel = this.member;
        return channel.send(`**__Has sido softbaneado en ${this.member.guild.name}__**\n${emojis.razon} __**Razón:**__ ${this.reason}\n${emojis.status_activo} **__ID de caso:__** ${this.case}\n\nTranquilo, muchas veces esto es solo para eliminar muchos mensajes tuyos, aqui tienes la invitación:\nhttps://discord.gg/fyp`).catch(() => {});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

    /**
     * @method Metodo encargado de mandar un log cuando un usuario es softbaneado
     */

    async sendSoftBanLog() {
        managerError;
        try {
        const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox") as TextChannel;
        const embed = new MessageEmbed().setAuthor({name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: await avatar(this.moderator)}).setDescription(`🔈 _**Ha softbaneado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis.razon} __**Razón:**__: ${this.reason}\n${emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(await avatar(this.member)).setColor("RED");
        await this.sendDMSoftbanLog();
        return channel.send({embeds: [embed]});
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish();
        }
    }

}

