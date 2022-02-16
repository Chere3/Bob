import {
  MessageEmbed,
  Client,
  Collection,
  Message,
  PermissionResolvable,
  PermissionString,
} from "discord.js";
import { TempContext } from "./Context";
import { config } from "../../config";
import { emojis } from "../constants/emojis";
import { db } from '../../index';

interface options {
  name: string;
  dev?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  staff?: boolean
  mediumStaff?: boolean
  highStaff?:boolean
  aliases?: string[];
  status?: boolean;
  category?: string;
  cooldown?: number;
  description?: string;
  botPermissions?: string[];
  memberPermissions?: PermissionString[]
  usage?(prefix: string): string;
  example?(prefix: string): string;
}

export class BaseCommand {
  bot: Client;
  name: string;
  dev: boolean;
  guildOnly: boolean;
  staff: boolean;
  mediumStaff: boolean
  highStaff: boolean
  nsfw: boolean;
  aliases: string[];
  status: boolean;
  category: string;
  cooldown: number;
  cooldowns: Collection<string, number>;
  description: string;
  botPermissions: string[];
  memberPermissions: PermissionString[];
  usage: any;
  example: any;
  devs: typeof config.owners;
  constructor(client: Client, options: options) {
    this.bot = client;
    this.name = options.name;
    this.dev = options.dev || false;
    this.staff = options.staff || false;
    this.mediumStaff = options.mediumStaff || false;
    this.highStaff = options.highStaff || false;
    this.guildOnly = options.guildOnly || true
    this.nsfw = options.nsfw || false;
    this.aliases = options.aliases || [];
    this.status = options.status || true;
    this.category = options.category || "bot";
    this.cooldown = options.cooldown || 10;
    this.cooldowns = new Collection();
    this.description = options.description || "Does'nt have description";
    this.usage = options.usage || ((prefix) => `${prefix}${options.name}`);
    this.example = options.example || ((prefix) => `${prefix}${options.name}`);
    this.botPermissions = options.botPermissions || [];
    this.memberPermissions = options.memberPermissions || [];
  }

  async canRun(msg: Message, isDev: boolean) {

    if (this.dev == true && !config.owners.includes(msg.author.id)) return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando es solo para mis desarrolladores**__`);
    if (this.guildOnly == true && !msg.guild?.id) return msg.reply(`> ${emojis.zwo_viendo} __**Es raro ver alguien por aqui... pero este comando solo funciona en servidores**__`);
    if (this.staff == true && !msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando solo funciona para miembros con permisos de administración**__`);
    if (this.mediumStaff && !msg.member.permissions.has("MANAGE_GUILD")) return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando solo funciona para miembros con permisos de administración medio elevados.**__`);
    if (this.highStaff &&  !msg.member.roles.cache.has(`913123943941025822`)) {

      if (msg.member.roles.cache.has(`913123943072813096`) || msg.member.roles.cache.has(`852588734104469535`)) {} else {
        return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando solo funciona para miembros ejecutivos superiores (creadores o owners)**__`);
      }

    }
    if (this.nsfw == true && !msg.channel.nsfw && !config.owners.includes(msg.author.id)) return msg.reply(`> ${emojis.oso_policia} __**Alto ahí horny... Este comando solo funciona en canales marcados como *NSFW***__`);
    if (this.botPermissions.length > 0) {
      let missing = this.botPermissions.filter((perm) => !msg.guild?.me?.permissions.has(perm as PermissionResolvable));
      if (missing.length > 0) return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando no funciona porque necesito los siguientes permisos: ${missing.join(", ")}**__`);
    }
    if (this.memberPermissions.length > 0) {
      let missing = this.memberPermissions.filter((perm) => !msg.member.permissions.has(perm as PermissionResolvable));
      if (missing.length > 0) return msg.reply(`> ${emojis.zdo_sospechoso} __**Este comando no funciona porque necesitas los siguientes permisos: ${missing.join(", ")}**__`);
    }
    if (this.cooldownManger(msg) && !config.owners.includes(msg.author.id)) {
      const timeLeft = Math.round(
        (this.cooldowns.get(msg.author.id) || 0) - Date.now()
      );

      return msg.reply(
        `> ${emojis.rana_fire} __**Este comando está en cooldown por ${(timeLeft / 1000).toFixed(1)} segundos, harás que me queme..**__`
      );
    }

     

  
  return false
  }

  cooldownManger(message: Message) {
    if (this.cooldowns.has(message.author.id)) return true;
    this.cooldowns.set(message.author.id, Date.now() + this.cooldown * 1000);
    const cooldown = message.client.cooldoown.get(message.author.id);
    

    setTimeout(() => {
      this.cooldowns.delete(message.author.id);
      message.client.cooldoown.delete(message.author.id);
    }, this.cooldown * 1000);

    return false;
  }

  run(ctx: TempContext) {}
}
