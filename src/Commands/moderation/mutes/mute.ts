import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { muteManager } from '../../../Util/managers/moderationManager';
import { Translatetime } from '../../../Util/constants/globals';
import { transaction, sentry } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "mute",
description: "Mutea a un comando con este comando.",
category: "moderation",
aliases: ["muted", "mutee", "m"],
staff: true,
cooldown: 30,
usage: (prefix: "prefix") => "mute <user> [time] [reason]",
example: (prefix: "prefix") => "mute @user 1h spam",
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar un usuario para mutear.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);
    if (!base.args[1]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar un tiempo para mutear o una razón para mutear.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);

    
    const member = await getMember(base.args[0], base.message);
    var force = false;
    if (base.config.owners.includes(base.member.id) && base.flags[0] == "f") force = true;
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__No pude encontrar al usuario que has tratado de mencionar.__**\n\n\`\`\`!mute <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!mute <usuario> [razón]\n!mute @${base.member.displayName} 15m spam\`\`\``);

    // check if the second argument is a time or a reason
    if (base.args[1].match(/\d+[smhdmwy]/) == null) {
        transaction
        try {
            const data = await new muteManager(member, base.member, base.args.slice(1).join(" "), "15m", force).mute();
            await base.channel.sendTyping();
            await base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag} ha sido muteado durante**__ \`15 minutos\`.`);
        } catch (error) {
            if (!String(error).startsWith(`Error:`)) {
                sentry.captureException(error);
                base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
                transaction.finish();
            }

            base.message.reply(`> ${emojis.zdo_tonto} **__${String(error).slice(6)}__**`)
            
        }
    } else {
        transaction
        try {
            const data = await new muteManager(member, base.member, base.args.slice(2).join(" "), base.args[1].match(/\d+[smhdmwy]/)[0], force).mute();
            await base.channel.sendTyping();
            await base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag} ha sido muteado durante**__ \`${Translatetime(base.args[1].match(/\d+[smhdmwy]/)[0])}\`.`);
        } catch (error) {
            if (!String(error).startsWith(`Error:`)) {
                sentry.captureException(error);
                base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
                return transaction.finish();
            }
            base.message.reply(`> ${emojis.zdo_tonto} **__${String(error).slice(6)}__**`)
        }
    }


}}