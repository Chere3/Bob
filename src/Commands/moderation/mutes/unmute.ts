import { Client } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { muteManager } from '../../../Util/managers/moderationManager';
import { sentry, transaction } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "unmute",
description: "Desmutea a un usuario con este comando.",
category: "moderation",
aliases: ["desmute", "delmute", "deletemute", "um"],
cooldown: 30,
usage: (prefix: "prefix") => "unmute <usuario>",
example: (prefix: "prefix") => "unmute @usuario",
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} __**Debes de mencionar a un usuario para desmutear.**__\n\`\`\`!unmute <usuario> [razon]\n!unmute @${base.member.displayName} se portó bien.\`\`\``);
    const member = await getMember(base.args[0], base.message);
    var force = false;
    if (base.config.owners.includes(base.member.id) && base.flags[0] == "f") force = true;
    transaction 
    try {
        const data = await new muteManager(member, base.member, base.args.slice(1).join(" "), null, force).unmute();
        await base.channel.sendTyping();
        await base.message.reply(`> ${emojis.zdo_sospechoso} **__${member.user.tag}__ ha sido desmuteado satisfactoriamente.**`);
    } catch (e) {
        if (!String(e).startsWith(`Error:`)) {
            sentry.captureException(e);
            base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
            return transaction.finish();
        }
        await base.channel.sendTyping();
        await base.message.reply(`> ${emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
    }
}}