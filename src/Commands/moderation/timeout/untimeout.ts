import { Client } from "discord.js";
import { sentry, transaction } from "../../..";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { timeoutManager } from '../../../Util/managers/moderationManager';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "untimeout",
description: "Caracteristica de discord para reemplazar el unmute.",
category: "moderation",
aliases: ["untimeout", "dentro", "ut"],
highStaff: true,
usage: (prefix: "prefix") => "untimeout <usuario>",
example: (prefix: "prefix") => "untimeout @user"
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar el usuario que quieres quitarle el tiempo fuera.__**\n\n\`\`\`!untimeout <usuario> [razón]\n!untimeout @${base.member.displayName}\`\`\``);
    
    const member = await getMember(base.args[0], base.message);
    var force = false;

    if (base.config.owners.includes(base.member.id) && base.flags[0] == "f") force = true;
    if (!member) return base.message.reply(`> ${emojis.zdo_tonto} **__No pude encontar al usuario que tratas de quitarle el tiempo fuera__**\n\`\`\`!untimeout <usuario> [razón]\n!untimeout @${base.member.displayName} fue un error\`\`\``);
    transaction
    try {
        const data = await new timeoutManager(member, base.member, base.args.slice(1).join(" "), null, force).unTimeout();
        await base.channel.sendTyping();
        base.channel.send(`> ${emojis.zdo_tonto} **__${member.displayName} ha sido retirado del tiempo fuera.__**`);
    } catch (e) {
        if (!String(e).startsWith(`Error:`)) {
            sentry.captureException(e);
            base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
            return transaction.finish();
        }
        base.message.reply(`> ${emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
    }
}}