"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationBotLogs = exports.logsManager = void 0;
const discord_js_1 = require("discord.js");
const emojis_1 = require("../constants/emojis");
const globals_1 = require("../constants/globals");
const globals_2 = require("../constants/globals");
const index_1 = require("../../index");
class logsManager {
    constructor(client) {
        this.client = client;
    }
}
exports.logsManager = logsManager;
class moderationBotLogs extends logsManager {
    constructor(member, moderator, reason, caseNumber, time, caseNumberr) {
        super(moderator.client);
        this.member = member;
        this.moderator = moderator;
        this.reason = reason;
        this.case = caseNumber;
        this.time = time;
        this.caseNumberr = caseNumberr;
    }
    logWarn() {
        index_1.managerError;
        try {
            const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
            const embed = new discord_js_1.MessageEmbed().setAuthor(`${this.moderator.nickname || this.moderator.user.username}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, this.moderator.displayAvatarURL() || this.moderator.user.displayAvatarURL()).setColor(`PURPLE`).setDescription(`❌ **Ha warneado a:** \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razon:**__: ${this.reason || "Sin razón."}\n ${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(this.member.displayAvatarURL() || this.member.user.displayAvatarURL());
            this.sendPrivateMessage();
            return channel.send({ embeds: [embed] });
        }
        catch (error) {
            index_1.sentry.captureException(error);
        }
        finally {
            index_1.managerError.finish();
        }
    }
    sendPrivateMessage() {
        index_1.managerError;
        try {
            const text = `**Has sido advertido en ${this.member.guild.name}**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n ${emojis_1.emojis.zwo_viendo} __**ID de caso:**__ \`${this.case}\``;
            return this.member.send(text).catch(() => { });
        }
        catch (error) {
            index_1.sentry.captureException(error);
        }
        finally {
            index_1.managerError.finish();
        }
    }
    sendWarnDeleteLog() {
        index_1.managerError;
        try {
            const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
            const embed = new discord_js_1.MessageEmbed().setAuthor({ "name": `${this.moderator.nickname || this.moderator.user.username}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: this.moderator.displayAvatarURL() || this.moderator.user.displayAvatarURL() }).setColor(`PURPLE`).setDescription(`${emojis_1.emojis.status_inactivo} __**Ha borrado el warn de:**__\n\`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razon:**__: ${this.reason || "Sin razón."}\n ${emojis_1.emojis.zwo_viendo} __**ID del caso:**__\n \`\`\`fix\n${this.case}\`\`\`\n__**ID del caso borrado:**__ \`\`\`fix\n${this.caseNumberr}\`\`\``).setTimestamp().setThumbnail(this.member.displayAvatarURL() || this.member.user.displayAvatarURL());
            return channel.send({ embeds: [embed] });
        }
        catch (error) {
            index_1.sentry.captureException(error);
        }
        finally {
            index_1.managerError.finish();
        }
    }
    sendWarnsDeleteLog(warns) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`>>> ${emojis_1.emojis.warn} __**Cantidad de warns borrados:**__ ${warns.length}\n ${emojis_1.emojis.razon} __**Razón de borrado masivo**__: ${this.reason || "No hay razón."}\n`).setThumbnail(`${yield (0, globals_1.avatar)(this.member)}`).setColor("PURPLE");
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMMuteLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido muteado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n⏰ __**Tiempo:**__ ${(0, globals_2.Translatetime)(this.time)}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendMuteLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha muteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${(0, globals_2.Translatetime)(this.time)}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("PURPLE");
                this.sendDMMuteLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMUnmuteLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido desmuteado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendUnmuteLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha desmuteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member));
                this.sendDMUnmuteLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMTimeoutLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido timeouteado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n⏰ __**Tiempo:**__ ${(0, globals_2.Translatetime)(this.time)}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendTimeoutLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha timeouteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${(0, globals_2.Translatetime)(this.time)}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("PURPLE");
                this.sendDMTimeoutLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMUntimeoutLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido destimeouteado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendUntimeoutLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha destimeouteado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("PURPLE");
                this.sendDMUntimeoutLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMKickLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido kickeado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}\n\nSí crees que se trata de un error, puedes apelar el kickeó en este servidor:\nhttps://discord.gg/ZD8j2G69EW`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendKickLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha kickeado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("RED");
                yield this.sendDMKickLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMBanLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido baneado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}\n\n__**Sí crees que se trata de un error, puedes apelar el baneo en este servidor:**__\nhttps://discord.gg/ZD8j2G69EW`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendBanLog(user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha baneado a:**_ \`${(_a = this.member.user.tag) !== null && _a !== void 0 ? _a : user.tag}\` ( ${(_b = this.member.id) !== null && _b !== void 0 ? _b : user.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n⏰ __**Tiempo:**__ ${this.time == null ? `Indefinido` : (0, globals_2.Translatetime)(this.time)}\n${emojis_1.emojis.zwo_viendo}__**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("RED");
                yield this.sendDMBanLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendUnbanLog(user) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.moderator.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha desbaneado a:**_ \`${user.tag}\` ( ${user.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield user.displayAvatarURL()).setColor("GREEN");
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendDMSoftbanLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member;
                return channel.send(`**__Has sido softbaneado en ${this.member.guild.name}__**\n${emojis_1.emojis.razon} __**Razón:**__ ${this.reason}\n${emojis_1.emojis.status_activo} **__ID de caso:__** ${this.case}\n\nTranquilo, muchas veces esto es solo para eliminar muchos mensajes tuyos, aqui tienes la invitación:\nhttps://discord.gg/fyp`).catch(() => { });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    sendSoftBanLog() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const channel = this.member.guild.channels.cache.find(c => c.name === "🦝︰cheree_sandbox");
                const embed = new discord_js_1.MessageEmbed().setAuthor({ name: `${this.moderator.displayName}${this.moderator.user.discriminator} ( ${this.moderator.id} )`, iconURL: yield (0, globals_1.avatar)(this.moderator) }).setDescription(`🔈 _**Ha softbaneado a:**_ \`${this.member.user.tag}\` ( ${this.member.id} )\n${emojis_1.emojis.razon} __**Razón:**__: ${this.reason}\n${emojis_1.emojis.zwo_viendo} __**ID de caso:**__\n \`\`\`fix\n${this.case}\`\`\``).setTimestamp().setThumbnail(yield (0, globals_1.avatar)(this.member)).setColor("RED");
                yield this.sendDMSoftbanLog();
                return channel.send({ embeds: [embed] });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.moderationBotLogs = moderationBotLogs;
