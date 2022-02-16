import { ButtonInteraction, Client, MessageEmbed, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from 'discord.js';
import { inspect } from "util";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { historialManager } from '../../../Util/managers/moderationManager';
import { globalAction, deleteWarnAction, ban, muteAction, unmuteAction } from '../../../Util/constants/moderationDataManager';
import { warn } from '../../../Database/schemas/User';
import { separateArray } from '../../../Util/Functions/utils/generalUtil';
import { emojis } from '../../../Util/constants/emojis';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "history",
description: "Muestra el historial de todas las acciones moderativas del servidor.",
category: "moderation",
aliases: ["historial", "modhistory"],
staff: true,
cooldown: 10,
})
  }



async run(base: TempContext) {
  const data = await new historialManager(null, null, null, null, null, null, null, base.member.guild.id).getHistorial();
  if (!data.all || data.all.length === 0) return base.message.reply(`> ${emojis.zwo_viendo} **__No he detectado que haya historial__**`);
  const arrays = separateArray(data.all, 10) as Array<Array<globalAction>>;

  const embed = new MessageEmbed().setColor(`DARK_PURPLE`).setAuthor({name: `Registros de moderación del servidor`, iconURL: base.guild.iconURL()})

  if (arrays.length == 1) {
    const text = constructWarns(arrays[0]); var n = 1;
    const a1 = await base.message.reply({embeds: [embed.setDescription(`${text.slice(9)}`)], components: [base.ar(constructMenu(arrays[0]))]});
    const aw1 = a1.createMessageComponentCollector({componentType: "SELECT_MENU", max: 15, time: 60000});

    aw1.on("collect", async (c) => {
      const ar = arrays[0]; const aa = c as SelectMenuInteraction; const b = Number(aa.values[0]);
      const embed = new MessageEmbed().setColor("PURPLE").setDescription(`__**${base.guild.members.cache.get(ar[b].moderator).user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${await (await base.client.users.fetch(ar[b].id, {force: true})).tag}**__\n\n__${emojis.razon} **Razón:**__ ${ar[b].reason}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0,-3)}>**`).setAuthor({name: await (await base.client.users.fetch(ar[b].id, {force: true})).tag, iconURL: await base.avatar(ar[b].id)}).setThumbnail(await base.avatar(ar[b].moderator));
      aa.update({embeds: [embed]});
    })
  } else {
    const m1 = await base.message.reply({embeds: [embed.setDescription(constructWarns(arrays[0]).slice(9))], components: [base.ar(base.b("SECONDARY", ".", "right", false, emojis.right_arrow),base.b("SECONDARY", "ㅤ", "a", true) ,base.b("SECONDARY", "ㅤ", "b", true), base.b("SECONDARY", "q.", "left", false, emojis.left_arrow)), base.ar(constructMenu(arrays[0]))]});

    const embeds = [];
    for (let i = 0; i < arrays.length; i++) {
      embeds.push(new MessageEmbed().setColor("PURPLE").setDescription(constructWarns(arrays[i], i).slice(9)).setAuthor({name: `Registro de moderación`, iconURL: base.guild.iconURL()}).setFooter({text: `Página ${i+1} de ${arrays.length}`}));
    }

    var page: any = 0;

    const aw1 = m1.createMessageComponentCollector({componentType: "SELECT_MENU", max: 15, time: 60000});
    const aw2 = m1.createMessageComponentCollector({componentType: "BUTTON", max: 15, time: 60000});

    aw1.on("collect", async (m) => {
      if (m.member.id !== base.member.id) return m.reply(`blep`);
      const ar = arrays[page]; const aa = m as SelectMenuInteraction; const b = Number(aa.values[0]);
      const embed = new MessageEmbed().setColor("PURPLE").setDescription(`__**${base.guild.members.cache.get(ar[b].moderator).user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${await (await base.client.users.fetch(ar[b].id)).tag}**__\n\n__${emojis.razon} **Razón:**__ ${ar[b].reason}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0,-3)}>**`).setAuthor({name: await (await base.client.users.fetch(ar[b].id, {force: true})).tag, iconURL: await base.avatar(ar[b].id)}).setThumbnail(await base.avatar(ar[b].moderator));
      m.update({embeds: [embed], components: [base.ar(constructMenu(arrays[page], page))]});  
    })

    aw2.on("collect", async (m) => {
      const cc = m as ButtonInteraction;

      if (cc.member.id !== base.message.author.id) return cc.reply({content: `blep`});

      if (cc.customId == "right") {
        if (page !== 0) {
          --page;
          await cc.update({embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow)),base.ar(constructMenu(arrays[page], page))]});
        } else {
          page = [embeds.length - 1];
          await cc.update({embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))]});
        }
      } else if (cc.customId == "left") {
        if (page < embeds.length - 1) {
          page++;
          await cc.update({embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))]});
        } else {
          page = 0;
          await cc.update({embeds: [embeds[page]], components: [base.ar((base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow))), base.ar(constructMenu(arrays[page], page))]});
        }
      }
    })
  }




  // funciones //

  function constructWarns(actions: globalAction[], page: number = 0) {
    var owo; var num = 1;
    if (page > 0) {
      num = page * 10 + 1;
    }

    var emoji;
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].type == "warn") {
        emoji = "⚠"
      } else if (actions[i].type == "kick") {
        emoji= "🚷"
      } else if (actions[i].type == "ban") {
        emoji = "🔨"
      } else if (actions[i].type == "unban") {
        emoji = "💨"
      } else if (actions[i].type == "mute") {
        emoji = "🔇"
      } else if (actions[i].type == "unmute") {
        emoji = "<:resource_basura:924934786928246794>"
      } else if (actions[i].type == "delwarn") {
        emoji = "<:resource_basura:924934786928246794>"
      } else {
        emoji = "DONT FOUND EMOJI _ERROR_1"
      }
      owo+= `${emoji} #${num}: **${ucFirst(actions[i].type)}** - ${base.guild.members.cache.get(actions[i].moderator) || `No encontrado`}\n\n`;
      num = num + 1;
    }

    return owo;
  }



  function constructMenu(actions: globalAction[], page: number = 0) {
    var a = []; var n = 0; var nn = 0;
    if (page > 0) {
      n = page * 10 + 1;
    }

    for (const action of actions) {
      const emoji = action.type == "warn" ? "⚠" : action.type == "kick" ? "🚷" : action.type == "ban" ? "🔨" : action.type == "unban" ? "💨" : action.type == "mute" ? "🔇" : action.type == "unmute" ? "<:resource_basura:924934786928246794>" : `Error in emoji for type ${action.type}`;

      const option = {
        value: `${nn}`,
        label: `#${n}: ${ucFirst(action.type)} - ${base.client.users.cache.get(action.id)?.tag || `No encontrado`}`,
        description: `${action.reason}`,
        emoji: emoji
      } as MessageSelectOptionData;
      a.push(option); n = n + 1; nn = nn + 1;
    }
  
  var menu = new MessageSelectMenu().addOptions(a).setCustomId("owo").setPlaceholder(`Selecciona un registro.`)
  return menu;
  
  }


  function ucFirst(text: string) {
    // make the first character of text upper case using regex
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}


}