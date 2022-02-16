import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { timeoutManager } from '../../../Util/managers/moderationManager';
import { Translatetime } from '../../../Util/constants/globals';
import { sentry, transaction } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "timeout",
description: "Caracteristica de discord para reemplazar al mute",
category: "moderation",
aliases: ["mutte", "fuera", "t"],
highStaff: true,
usage: (prefix: "prefix") => "timeout <usuario> <tiempo> <razon>",
example: (prefix: "prefix") => "timeout @user 5m No se ha estado en el chat",
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar al usuario que quieres dejar tiempo fuera.__**\n\n\`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);
    if (!base.args[1]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar el tiempo o la razón por la que quieres dejar fuera al usuario.__**\n\n\`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);

    const member = await getMember(base.args[0], base.message);
    var force = false;

    if (base.config.owners.includes(base.member.id) && base.flags[0] == "f") force = true;
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__No pude encontrar al usuario que especificaste__**\n\n \`\`\`!timeout <usuario> [tiempo (1m | 1h | 1d | 1w | 1y)] [razón]\n!timeout <usuario> [razon]\n!timeout @${base.member.displayName} 15m flood\`\`\``);
  
    
    //check if the second argument is a time or a reason
    if (base.args[1].match(/\d+[smhdwmy]/) == null) {
        transaction
        try {
            const data = await new timeoutManager(member, base.member, base.args.slice(1).join(" "), "15m", force).timeout();
            await base.channel.sendTyping();
            await base.channel.send(`> ${emojis.zwo_viendo} **__${member.user.tag} ha sido dejado fuera por__** \`15 minutos\`.`);
        } catch (e) {
            if (!String(e).startsWith(`Error:`)) {
                sentry.captureException(e);
                base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
                return transaction.finish();
            }
            base.message.reply(`> ${emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
        }

    } else {
        transaction
        try {
            const data = await new timeoutManager(member, base.member, base.args.slice(2).join(" "), base.args[1].match(/\d+[smhdwmy]/)[0], force).timeout();
            await base.channel.sendTyping();
            await base.channel.send(`> ${emojis.zwo_viendo} **__${member.user.tag} ha sido dejado fuera por__** \`${Translatetime(base.args[1].match(/\d+[smhdmwy]/)[0])}\`.`);
        } catch (e) {
            if (!String(e).startsWith(`Error:`)) {
                sentry.captureException(e);
                base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
                return transaction.finish();
            }
            base.message.reply(`> ${emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
        }
    }
}}