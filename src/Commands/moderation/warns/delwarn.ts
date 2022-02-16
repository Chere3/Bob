import { ButtonInteraction, Client, MessageEmbed, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import { userModel, warn } from "../../../Database/schemas/User";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { emojis } from "../../../Util/constants/emojis";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { getUserDB } from "../../../Util/Functions/utils/DBUtil";
import { separateArray } from "../../../Util/Functions/utils/generalUtil";
import { getDBUser } from "../../../Util/managers/userManager";
import { warnManager } from '../../../Util/managers/moderationManager';
import { sentry, transaction } from "../../..";


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "delwarn",
description: "Elimina un warn.",
category: "moderation",
aliases: ["warndelete", "delete-warn", "warndel", "dw"],
highStaff: true,
cooldown: 10,
usage: (prefix: "prefix") => "delwarn [usuario - warn]",
example: (prefix: "prefix") => "delwarn @user"
      })
  }


async run(base: TempContext) {

  const arg = base.args[0];
  var force = false;
  if (base.flags[0] == "f" && base.config.owners.includes(base.user.id)) force = true; 

  if (!base.args[0]) {
    return base.message.reply(`> ${emojis.zdo_tonto} __**Debes de colocar un usuario o caso del warn para borrar.**__\n\`\`\`!delwarn GV5M-5VHZ-O8#%-#6%9\n!delwarn @${base.user.username}\`\`\``)
  } else if (base.args[0].match(/^.{4}-.{4}-.{4}-.{4}$/) == null) {
    const member = await getMember(base.args.join(" "), base.message).catch(() => {}) || base.member;
    const warns = await (await getUserDB(member.id)).warnsHistory;

    if (!warns || warns.length === 0) return base.message.reply(`> ${emojis.zwo_viendo} __**${member.user.tag}** no tiene warns__`);
    const embed = new MessageEmbed().setDescription(`${constructWarns(warns).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, await base.avatar(member.id)).setColor(`PURPLE`);
    if (warns.length < 10) {
        const m1 = await base.message.reply({embeds: [embed], components: [base.ar(constructMenu(warns))]});

       const w1 = m1.createMessageComponentCollector({time: 60000, max: 15, componentType: "SELECT_MENU"});
       const w2 = m1.createMessageComponentCollector({time: 60000, max: 15, componentType: "BUTTON"});

       var b;
         w1.on("collect", async (c) => {
             const cc = c as SelectMenuInteraction;

             if (cc.member.id !== base.member.id) return cc.reply({content: `${emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true})
             b = Number(cc.values[0])
             const embed = new MessageEmbed().setAuthor(base.Getmember(warns[b].id).constructor.name == "GuildMember" ? base.Getmember(warns[b].id).user.username : base.Getmember(warns[b].id).username, await base.avatar(warns[b].id)).setThumbnail(await base.avatar(warns[b].moderator)).setDescription(`${emojis.razon} __**Razón**:__ ${warns[b].reason}\n${emojis.oso_policia} __**Moderador**:__${base.Getmember(warns[b].moderator)}\n⏰ __**El:**__ **<t:${String(warns[b].at).slice(0, -3)}>**\n🔩 __**ID del caso:**__\`\`\`fix\n${warns[b].case}\`\`\`\n\n**¿Estas seguro que deseas __eliminar este warn__?**`).setColor(`PURPLE`);

             await cc.update({embeds: [embed], components: [base.ar(base.b("SECONDARY", ".", "si", false, emojis.rs_palomita), base.b("SECONDARY", ".", "no", false, emojis.rs_x)), base.ar(constructMenu(warns))]});
         });

         w2.on("collect", async (d) => {
           const dd = d as ButtonInteraction;

           if (dd.member.id !== base.member.id) return dd.reply({content: `${emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true});
           if (dd.customId == "si") {
             const caseNumber = warns[b].case;
             try {
             const data = await new warnManager(null, base.member, null, force, caseNumber).delWarn();
             await m1.suppressEmbeds();
             dd.update({content: `${emojis.zdo_sospechoso} __**El warn con el caso \`${data.case}\` ha sido eliminado satisfactoriamente**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]})
             w2.emit("end", null, null, "si_button");
             w1.emit("end")
             } catch (e) {
                 await m1.suppressEmbeds();
                 if (!String(e).startsWith(`Error:`)) {
                    await dd.update(`> ${emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`)
                    sentry.captureException(e);
                    return transaction.finish(); 
                  }
                 dd.update({content: `${emojis.zdo_tonto} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]});
                 w2.emit("end", null, null, "si_error_button")
                w1.emit("end")
             }
           } else if (dd.customId == "no") {
                await m1.suppressEmbeds();
                dd.update({content: `${emojis.zdo_sospechoso} __**Has cancelado la eliminación de un warn**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]})
                w2.emit("end", null, null, "no_button");
                w1.emit("end")
           }
         })

        w2.on("end", async (e, a, d) => {
            if (!d) {m1.edit({embeds: [m1.embeds[0]], components: [base.ar(m1.components[0].components[0].setDisabled(true))]})}
        })
    } else {
        const ws = separateArray(warns, 10) as Array<Array<warn>>
        const m1 = await base.message.reply({embeds: [embed.setDescription(constructWarns(ws[0] as warn[]).slice(9))], components: [base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow)) ,base.ar(constructMenu(ws[0] as warn[]))]});	
        const emds = [] as MessageEmbed[];
        for (let i = 0; i < ws.length; i++) {
            emds.push(new MessageEmbed().setDescription(`${constructWarns(ws[i], i).slice(9)}`).setAuthor(`Warns de ${member.user.tag}`, await base.avatar(member.id)).setColor(`PURPLE`).setFooter(`El usuario tiene ${warns.length} warns en total.`));
        }

        var p: any = 0;
        var b;
        var ar;

        const aw1 = m1.createMessageComponentCollector({componentType: "SELECT_MENU", max: 15, time: 60000});
        const aw2 = m1.createMessageComponentCollector({componentType: "BUTTON", max: 15, time: 60000});

        aw1.on("collect", async (c) => {
            if (c.member.id !== base.member.id) return c.reply({content: `${emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true});

            ar = ws[p];
            b = Number(c.values[0]);
            const caseNumber = ar[b].case;

            const e = new MessageEmbed().setAuthor(base.Getmember(ar[b].id).constructor.name == "GuildMember" ? base.Getmember(ar[b].id).user.username : base.Getmember(ar[b].id).username, await base.avatar(ar[b].id)).setThumbnail(await base.avatar(ar[b].moderator)).setDescription(`${emojis.razon} __**Razón**:__ ${ar[b].reason}\n${emojis.oso_policia} __**Moderador**:__${base.Getmember(ar[b].moderator)}\n⏰ __**El:**__ **<t:${String(ar[b].warnedAt).slice(0, -3)}>**\n${emojis.razon} __**ID del caso:**__\`\`\`fix\n${ar[b].case}\`\`\`\n\n¿Estas seguro de __**eliminar este warn?**__`).setColor(`PURPLE`);
            c.update({embeds: [e], components: [base.ar(base.b(`SECONDARY`, `si`, `si`, false, emojis.rs_palomita), base.b(`SECONDARY`, `si`, `no`, false, emojis.rs_x)),base.ar(constructMenu(ws[p], p))]});
        })

        aw2.on("collect", async (c) => {
            const cc = c as ButtonInteraction;

            if (cc.member.id !== base.member.id) return cc.reply({content: `${emojis.zdo_tonto} __**Hey, solo el autor del mensaje puede hacer esto**__`, ephemeral: true});
            if (cc.customId == "right") {
                if (p !== 0) {
                    --p;
                    cc.update({embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow))]});
                } else {
                    p = [emds.length -1];
                    cc.update({embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow))]});
                }
            } else if (cc.customId == "left") {
                if (p < emds.length - 1) {
                    p++;
                    cc.update({embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow))]});
                } else {
                    p = 0;
                    cc.update({embeds: [emds[p]], components: [base.ar(constructMenu(ws[p], p)), base.ar(base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow))]});
                }
            } else if (cc.customId == "si") {
                const caseNumber = ar[b].case;
                try {
                    const data = await new warnManager(null, base.member, null, force, caseNumber).delWarn();
                    await m1.suppressEmbeds();
                    cc.update({content: `${emojis.zdo_sospechoso} __**La advertencia con caso \`${data.caseOfDeletedWarn}\` se ha eliminado satisfactoriamente.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]});
                } catch (e) {
                    await m1.suppressEmbeds();
                    cc.update({content: `${emojis.zdo_tonto} __**${String(e).slice(6)}**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]});
                }
            } else if (cc.customId == "no") {
                await m1.suppressEmbeds();
                cc.update({content: `${emojis.zwo_viendo} __**El comando de ha cancelado.**__`, components: [base.ar(base.b("SECONDARY", "ㅤ", "ㅤ", true))]});
            }
        })

            
    }

//////////////////////////////////

function constructWarns(warns: warn[], page: number = 0) {
    var owo;

    var num = 1;

    if (page > 0) {
        num = page * 10 + 1
    }


    for (let i = 0; i < warns.length; i++) {

        if (warns[i].reason.length >= 20) {
            var reason = warns[i].reason.slice(0, 20) + "...";
        } else {
            reason = warns[i].reason;
        }
        owo += `${emojis.razon} **${num}** - ${reason} - ${base.client.users.cache.get(warns[i].moderator) || warns[i].moderator}\n\n`
        num = num + 1;
    }

    return owo as string
}

function constructMenu(modlogs: warn[], page: number = 0) {

var a = []




var number = 0;
var nn = 0

if (page > 0) {
number = page * 10 + 1;
}
    for (const log of modlogs) {

        

        const option = {
            value: `${nn}`,
            label: `#${number}: ${base.client.users.cache.get(`${log.moderator}`)?.tag || log.moderator}`,	
            description: `${log.reason.slice(0, 10)}...`
        } as MessageSelectOptionData;
        a.push(option);
        number = number + 1;
        nn = nn + 1;
    }


    var menu = new MessageSelectMenu().addOptions(a).setCustomId("owo").setPlaceholder(`Selecciona una opción para ver el registro`)

    return menu;
}

// Convert the first letter of a string to uppercase
function ucFirst(str: string) {

    return str.charAt(0).toUpperCase() + str.slice(1);
}
  } else {
      transaction
      try {
          const data = await new warnManager(null, base.member, base.args.slice(1)?.join(" "), false, base.args[0]).delWarn();
          base.message.reply(`${emojis.zdo_sospechoso} > __**El warn del usuario ${await base.Getmember(data.id)} con caso \`${data.caseOfDeletedWarn}\` se ha eliminado satisfactoriamente.**__`);
      } catch (e) {
        if (!String(e).startsWith(`Error:`)) {
            await base.message.reply(`> ${emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`)
            sentry.captureException(e);
            return transaction.finish(); 
          }
            base.message.reply(`${emojis.zdo_tonto} __**${String(e).slice(6)}**__`);
      }
  }
}}