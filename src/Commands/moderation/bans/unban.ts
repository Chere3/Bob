import { Client } from "discord.js";
import { sentry, transaction } from "../../..";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getBannedUser } from "../../../Util/Functions/utils/apiUtil";
import { banManager } from '../../../Util/managers/moderationManager';


export default class unbanCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "unban",
description: "Desbanea a un usuario con este comando",
category: "Categoría",
aliases: ["umbam", "ub"],
mediumStaff: true,
usage: (prefix: "prefix") => "COMANDO",
example: (prefix: "prefix") => "COMANDO"
      })
  }


async run(base: TempContext) {
if (!base.args[0]) return base.message.reply(`> ${emojis.zwo_viendo} __**Debes de colocar un usuario para banear.**__\n\`\`\`!unban <usuario> [razón]\n!unban ${base.member.displayName} Apeló.\`\`\``);
const bans = await base.message.guild.bans.fetch();
const ban = await getBannedUser(base.args[0], bans.map(x => x));

var force = false;
if (base.flags[0] == "f" && base.config.owners.includes(base.member.id)) force = true;

if (!ban) return base.message.reply(`> ${emojis.zdo_tonto} __**No pude encontrar al usuario que tratas de desbanear.**__\n\`\`\`!unban <usuario> [razón]\n!unban @${base.member.displayName} Apeló.\`\`\``);
transaction
try {
  const data = await new banManager(null, base.member, base.args?.slice(1)?.join(" ") || `Sin razón`, force).unban(ban.user.id)
  await base.message.reply(`> ${emojis.zwo_viendo} __**Has desbaneado a ${ban.user.tag} satisfactoriamente**__`);
} catch (e) {
  if (!String(e).startsWith(`Error:`)) {
    sentry.captureException(e);
    base.message.reply(`> ${emojis.internal_error} __**${base._INTERNAL_E_TEXT}__**`)
    return transaction.finish();
  }
  await base.message.reply(`> ${emojis.zdo_tonto} __**${String(e).slice(6)}__**`);
}
}}