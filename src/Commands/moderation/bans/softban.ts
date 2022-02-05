import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { sentry, transaction } from '../../../index';
import { banManager } from '../../../Util/managers/moderationManager';


export default class SoftBan extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "softban",
description: "Banea y desbanea a un usuario para eliminar sus mensajes en el servidor.",
category: "moderation",
aliases: ["softbann", "sofyban", "softbam"],
mediumStaff: true,
usage: (prefix: "prefix") => "softban <@usuario> [días de eliminación de mensajes] [razón]",
example: (prefix: "prefix") => "softban @usuario 1d flood en todos los canales"
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} __**Debes de colocar al usuario que quieres softbanear**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);
    if (!base.args[1]) return base.message.reply(`> ${emojis.zdo_tonto} __**Debes de colocar el tiempo de eliminación de mensajes o una razón**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);

    var force = false;
    if (base.flags[0] == "#f" && base.config.owners.includes(base.member.id)) force = true
    const member = await getMember(base.args[0], base.message);

    if (!member) return base.message.reply(`> ${emojis.zdo_tonto} __**No se pudo encontrar al usuario**__\n\`\`\`!softban <usuario> [días de eliminación de mensajes] [razón]\n!softban <usuario> [razón]\n!softban @${base.member.displayName} 1d spam\`\`\``);
    if (!base.args[1].match(/\d+[d]/)) {
        transaction
        try {
            await new banManager(member, base.member, base.args.slice(1).join(" "), force).softban(member.user.id, 3);
            base.message.reply(`> ${emojis.zdo_tonto} __**El usuario ha sido softbaneado satisfactoriamente**__`);
        } catch (e) {
            if (!String(e).startsWith("Error:")) {
                sentry.captureException(e)
                base.message.reply(`> ${emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`)
                return transaction.finish();
            }
            base.message.reply(`> ${emojis.zdo_tonto} __**${String(e).slice(6)}**__`)
        }
    } else {
        transaction
        try {
            await new banManager(member, base.member, base.args.slice(2).join(" "), force).softban(member.user.id, parseInt(base.args[1].slice(0, -1)));
            base.message.reply(`> ${emojis.zdo_tonto} __**El usuario ha sido softbaneado satisfactoriamente**__`);
        } catch (e) {
            if (!String(e).startsWith("Error:")) {
                sentry.captureException(e)
                base.message.reply(`> ${emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`)
                return transaction.finish();
            }
            base.message.reply(`> ${emojis.zdo_tonto} __**${String(e).slice(6)}**__`)
        }
    }
}}