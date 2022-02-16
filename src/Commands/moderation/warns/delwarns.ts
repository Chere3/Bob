import { Client, MessageEmbed, ButtonInteraction } from 'discord.js';
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { getDBUser } from '../../../Util/managers/userManager';
import { warnManager } from '../../../Util/managers/moderationManager';
import { sentry } from '../../..';
import { transaction } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "caca",
aliases: ["dws"],
highStaff: true,
cooldown: 30,
dev: true
      })
  }


async run(base: TempContext) {
    if (!base.args[0]) return base.message.reply(`> ${emojis.zdo_tonto} __**Debes de especificar un usuario para borrar todos sus warns.**__\n\`\`\`!delwarns <usuario | tag | id | apodo | nickname> [razon opcional]\n!delwarns @${base.message.author.username} flood.\`\`\``);
    var force = false;

    if (base.flags[0] == "f" && base.config.owners.includes(base.member.id)) {force = true};

    const member = await getMember(base.args[0], base.message);
    if (!member) return base.message.reply(`> ${emojis.zdo_tonto} __**No se encontro al usuario.**__`)
    const dbuser = await getDBUser(member.id);

    if (dbuser.warns == 0 && dbuser.warnsHistory.length == 0) return base.message.reply(`> ${emojis.zdo_tonto} __**No puedes eliminar los warns de ${await base.name(member.id)}. dado que el/ella no tiene warns.**__`);
     
    const embed = new MessageEmbed().setAuthor({name: `Borrar los warns de ${await base.name(member.id)}`, iconURL: await base.avatar(member.id)}).setDescription(`¿Estas seguro que __**deseas eliminar todos los warns de**__ \`${await base.name(member.id)}\`?`).setColor("ORANGE")
    const m1 = await base.message.reply({embeds: [embed], components: [base.ar(base.b("SECONDARY", ".", "si", false, emojis.rs_palomita), base.b("SECONDARY", ".", "no", false, emojis.rs_x))]});
    const w1 = await m1.createMessageComponentCollector({filter: (m) => m.member.id == base.message.author.id, time: 60000});

    w1.on("collect", async (m) => {
        const mm = m as ButtonInteraction;
        if (mm.customId == "si") {
            transaction
            try {
                mm.update({content: `> ${emojis.zwo_viendo} __**Se han eliminado ${dbuser.warnsHistory.length} warns de ${await base.name(member.id)}.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", ".", true ))]});
                await new warnManager(member, base.member, base.args.slice(1)?.join(" ") || null, force).delwarns();
                await m1.suppressEmbeds();
               
            } catch (e) {
                if (!String(e).startsWith(`Error:`)) {
                    sentry.captureException(e);
                    base.message.reply(`> ${emojis.internal_error} **__${base._INTERNAL_E_TEXT}__**`)
                    return transaction.finish();
                }
                m1.edit({content: `> ${emojis.zwo_viendo} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", ".", true ))]});
                await m1.suppressEmbeds();
            }
        }
    })
}}