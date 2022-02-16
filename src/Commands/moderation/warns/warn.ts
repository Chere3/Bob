import { Base, Client, MessageEmbed } from "discord.js";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { getMember } from "../../../Util/Functions/utils/apiUtil";
import { warnManager } from '../../../Util/managers/moderationManager';
import { emojis } from "../../../Util/constants/emojis";
import { transaction, sentry } from '../../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "warn",
description: "warnea con este comando a los chicos malos",
category: "Categoría",
staff: true,
cooldown: 30,
aliases: ["w", "advertir", "cwarn"],
example: (prefix: "prefix") => "warn [usuario | id | tag | apodo] [razón]",
      })
  }


async run(base: TempContext) {


  if (!base.args[0]) return base.message.reply(`> ${emojis.perro_tonto} **Debes de colocar un usuario para warnear.**\n\n\`\`\`!warn @${base.member.nickname || base.member.user.username} Flood\n!warn <usuario | tag | apodo | id> <razon>\`\`\``);
  if (!base.args[1]) return base.message.reply(`> ${emojis.perro_tonto} **Debes de colocar una razón para warnear.**\n\n\`\`\`!warn @${base.member.nickname || base.member.user.username} Flood\n!warn <usuario | tag | apodo | id> <razon>\`\`\``);


  const member = await getMember(base.args[0], base.message).catch(() => {})
  const reason = base.args.slice(1).join(" ");
  if (!member) return base.message.reply(`> ${emojis.perro_tonto} **El usuario que tratas de especificar no existe.**`);

  // search for numbers in first arg 
  const number = base.args[0].match(/\d+/g);

  var force = false;

  if (base.flags[0] == "f" && base.config.owners.includes(base.message.author.id)) force = true;
  if (!number) {
    const embed = new MessageEmbed().setAuthor({name:`Advertencia 🔩`}).setDescription(`¿Estas seguro que deseas warnear a \n**${member.user.tag}**?`).setColor("DARK_PURPLE").setTimestamp();
    
    const w = await base.message.reply({embeds: [embed], components: [base.ar(base.b(`PRIMARY`, `Sí`, `si`), base.b(`SECONDARY`, `No`, `no`))]});
  const a = w.createMessageComponentCollector({max: 15, time: 30000, componentType: "BUTTON"})

  a.on("collect", async (c) => {

    if (c.member.id !== base.member.id) return c.reply({content: `> ${emojis.zwo_viendo} **__Solo el autor del mensaje puede hacer esto.__**`, ephemeral: true});

    if (c.customId === "si") {
      transaction
      try {
        await new warnManager(member, base.member, reason, force).warn();
        base.channel.sendTyping()
        await w.edit({content: `> ${emojis.warn} **El usuario ${member.user.tag} ha sido warneado.**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))]});
        await w.suppressEmbeds();
        
      } catch  (e) {


        if (!String(e).startsWith(`Error:`)) {
          await w.edit(`> ${emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`)
          sentry.captureException(e);
          return transaction.finish(); 
        }

        await w.edit({content: `> ${emojis.perro_tonto} **${String(e).slice(6)}**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))]});
        await w.suppressEmbeds()
        await c.deferUpdate();
        
      }
    } else if (c.customId === "no") {
      await w.edit({content: `> ${emojis.perro_tonto} **Comando cancelado.**`, components: [base.ar(base.b(`SECONDARY`, `ㅤ`, `a`, true))]});
      await w.suppressEmbeds()
      await c.deferUpdate();
    }
  })
  } else {
    transaction
  try {
    await new warnManager(member, base.member, reason, force).warn();
    base.channel.sendTyping()
    base.message.reply(`> ${emojis.warn} **El usuario \`${member.user.tag}\` ha sido warneado.**`);
  } catch (e) {
    if (!String(e).startsWith(`Error:`)) {
      await base.message.reply(`> ${emojis.oso_policia} __**Mis sistemas han detectado un error en mi programación, el error se ha guardado en la base de datos y será revisado más adelante; Intenta ejecutar este comando más tarde.**__`)
      await sentry.captureException(e);
      return await transaction.finish(); 
    }
    base.message.reply(`> ${emojis.perro_tonto} **${String(e).slice(6)}**`)
  }}
}}