import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { Translatetime } from "../../../Util/constants/globals";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { banManager } from "../../../Util/managers/moderationManager";
import { transaction, sentry } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "ban",
description: "Banea a un usuario con este comando.",
category: "moderation",
aliases: ["bann", "banear", "bam", "b"],
mediumStaff: true,
botPermissions: ["BAN_MEMBERS"],
usage: (prefix: "prefix") => "ban <usuario> <razón | tiempo> [razón]",
example: (prefix: "prefix") => "ban @user flood"
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> __**${emojis.zdo_tonto} Debes de poner el usuario que quieres banear**__\n\`\`\`!ban <usuario> <razon>\n!ban <usuario> <tiempo> [razon]\n!ban <usuario> <tiempo> [días de mensajes borrados] [razón]\n!ban @${base.member.displayName} 2d 1d flood de spaguetti\`\`\``);
    if (!base.args[1]) return base.message.reply(`> __**${emojis.zdo_tonto} Debes de colocar la razón, o tiempo que quieres banear al usuario**__\n\`\`\`!ban <usuario> <razon>\n!ban <usuario> <tiempo> [razon]\n!ban <usuario> <tiempo> [días de mensajes borrados] [razón]\n!ban @${base.member.displayName} 2d 1d flood de spaguetti\`\`\``);

    const member = await getMember(base.args[0], base.message);
    var force = false;
    if (base.config.owners.includes(base.member.id) && base.flags[0] == "f") force = true;
    if (!member) return base.message.reply(`> __${emojis.zdo_tonto} **El usuario que diste es invalido o no se encuentra en el servidor, intenta con otro o intenta escribiendolo diferente.**__`);
    if (base.args[1].match(/\d+[smh]/) !== null) return base.message.reply(`> ${emojis.zdo_tonto} __**Lo siento, pero lo minimo que permito es \`1 día\` en formato de tiempo.**__`);

    if (base.args[1].match(/\d+[dmwy]/) !== null) {
        if (base.args[2].match(/\d+[smhmwy]/) !== null) return base.message.reply(`> ${emojis.zdo_tonto} __**Lo siento, pero lo minimo que permito es \`1 día\` en formato de tiempo en la eliminación de mensajes del usuario.**__`);
        if (base.args[2].match(/\d+[d]/) !== null) {
            const days = parseInt(base.args[2].match(/\d+[d]/)[0]);
            const duration = base.args[1].match(/\d+[dmwy]/)[0];
            transaction;
            try {
                const data = await new banManager(member, base.member, base.args.slice(3)?.join(" ") || "Sin razón", force).ban(duration, days);
                base.channel.sendTyping();
                await base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así por ${Translatetime(duration)}**__`)
            } catch (e) {
                if (!String(e).startsWith("Error:")) {
                    sentry.captureException(e)
                    base.message.reply(`> ${emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`)
                    return transaction.finish();
                }
                base.message.reply(`> ${emojis.zdo_tonto} __**${String(e).slice(6)}**__`)
            }
        } else {
            transaction;
            try {
                const data = await new banManager(member, base.member, base.args.slice(2)?.join(" ") || "Sin razón", force).ban(base.args[1].match(/\d+[dmwy]/)[0]);
                base.channel.sendTyping();
                await base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así por ${Translatetime(base.args[1].match(/\d+[dmwy]/)[0])}**__`)
            } catch (e) {
                if (!String(e).startsWith("Error:")) {
                    sentry.captureException(e)
                    base.message.reply(`> ${emojis.internal_error} __**${base._INTERNAL_E_TEXT}**__`)
                    return transaction.finish();
                }
                base.message.reply(`> ${emojis.zdo_tonto} __**${String(e).slice(6)}**__`)
            }
        }
    } else {
        transaction
        try {
            const data = await new banManager(member, base.member, base.args.slice(1)?.join(" ") || "Sin razón", force).ban();
            base.channel.sendTyping();
            await base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag} ha sido baneado satisfactoriamente, y seguirá así indefinidamente**__`)
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