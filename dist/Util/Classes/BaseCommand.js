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
exports.BaseCommand = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const emojis_1 = require("../constants/emojis");
class BaseCommand {
    constructor(client, options) {
        this.bot = client;
        this.name = options.name;
        this.dev = options.dev || false;
        this.staff = options.staff || false;
        this.mediumStaff = options.mediumStaff || false;
        this.highStaff = options.highStaff || false;
        this.guildOnly = options.guildOnly || true;
        this.nsfw = options.nsfw || false;
        this.aliases = options.aliases || [];
        this.status = options.status || true;
        this.category = options.category || "bot";
        this.cooldown = options.cooldown || 10;
        this.cooldowns = new discord_js_1.Collection();
        this.description = options.description || "Does'nt have description";
        this.usage = options.usage || ((prefix) => `${prefix}${options.name}`);
        this.example = options.example || ((prefix) => `${prefix}${options.name}`);
        this.botPermissions = options.botPermissions || [];
        this.memberPermissions = options.memberPermissions || [];
    }
    canRun(msg, isDev) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dev == true && !config_1.config.owners.includes(msg.author.id))
                return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando es solo para mis desarrolladores**__`);
            if (this.guildOnly == true && !((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id))
                return msg.reply(`> ${emojis_1.emojis.zwo_viendo} __**Es raro ver alguien por aqui... pero este comando solo funciona en servidores**__`);
            if (this.staff == true && !msg.member.permissions.has("MANAGE_MESSAGES"))
                return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando solo funciona para miembros con permisos de administración**__`);
            if (this.mediumStaff && !msg.member.permissions.has("MANAGE_GUILD"))
                return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando solo funciona para miembros con permisos de administración medio elevados.**__`);
            if (this.highStaff && !msg.member.roles.cache.has(`913123943941025822`)) {
                if (msg.member.roles.cache.has(`913123943072813096`) || msg.member.roles.cache.has(`852588734104469535`)) { }
                else {
                    return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando solo funciona para miembros ejecutivos superiores (creadores o owners)**__`);
                }
            }
            if (this.nsfw == true && !msg.channel.nsfw && !config_1.config.owners.includes(msg.author.id))
                return msg.reply(`> ${emojis_1.emojis.oso_policia} __**Alto ahí horny... Este comando solo funciona en canales marcados como *NSFW***__`);
            if (this.botPermissions.length > 0) {
                let missing = this.botPermissions.filter((perm) => { var _a, _b; return !((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.permissions.has(perm)); });
                if (missing.length > 0)
                    return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando no funciona porque necesito los siguientes permisos: ${missing.join(", ")}**__`);
            }
            if (this.memberPermissions.length > 0) {
                let missing = this.memberPermissions.filter((perm) => !msg.member.permissions.has(perm));
                if (missing.length > 0)
                    return msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**Este comando no funciona porque necesitas los siguientes permisos: ${missing.join(", ")}**__`);
            }
            if (this.cooldownManger(msg) && !config_1.config.owners.includes(msg.author.id)) {
                const timeLeft = Math.round((this.cooldowns.get(msg.author.id) || 0) - Date.now());
                return msg.reply(`> ${emojis_1.emojis.rana_fire} __**Este comando está en cooldown por ${(timeLeft / 1000).toFixed(1)} segundos, harás que me queme..**__`);
            }
            return false;
        });
    }
    cooldownManger(message) {
        if (this.cooldowns.has(message.author.id))
            return true;
        this.cooldowns.set(message.author.id, Date.now() + this.cooldown * 1000);
        const cooldown = message.client.cooldoown.get(message.author.id);
        setTimeout(() => {
            this.cooldowns.delete(message.author.id);
            message.client.cooldoown.delete(message.author.id);
        }, this.cooldown * 1000);
        return false;
    }
    run(ctx) { }
}
exports.BaseCommand = BaseCommand;
