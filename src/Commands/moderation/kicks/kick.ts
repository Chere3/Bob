import { Client } from "discord.js";
import { sentry, transaction } from "../../..";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { kickManager } from '../../../Util/managers/moderationManager';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "kick",
description: "Kickea a la persona mencionada con este comando.",
category: "moderation",
aliases: ["expulsar", "kicks"],
staff: true,
usage: (prefix: "prefix") => "kick <usuario> [razón]",
example: (prefix: "prefix") => "kick @user flood"
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} **__Debes de colocar el usuario que quieres expulsar.__**\n\n\`\`\`!kick <usuario> [razón]\n!kick @${base.member.displayName} spam de su cuenta de pornhub.\`\`\``);
    const member = await getMember(base.args[0], base.message);
    var force = false;
    if (base.flags[0] == "f" && base.config.owners.includes(base.member.id)) force = true;


    if (!member) return base.message.reply(`> ${emojis.zdo_tonto} **__No pude encontar al usuario que tratas de expulsar__**\n\`\`\`!kick <usuario> [razón]\n!kick @${base.member.displayName} flood\`\`\``);
    transaction
    try {
        const data = await new kickManager(member, base.member, base.args.slice(1).join(" ") || `Sin razón`, force).kick();
        await base.message.reply(`> ${emojis.zwo_viendo} **__Has expulsado a ${member.user.tag} satisfactoriamente__**`);
    } catch (e) {
        if (!String(e).startsWith(`Error:`)) {
            sentry.captureException(e);
            base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
            return transaction.finish();
        }
        await base.message.reply(`> ${emojis.zdo_tonto} **__${String(e).slice(6)}__**`);
    }
}}