import { Client, MessageEmbed, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, ButtonInteraction } from 'discord.js';
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { getDBUser } from "../../../Util/managers/userManager";
import { getPerson } from "../../../Util/Functions/utils/apiUtil";
import { separateArray } from '../../../Util/Functions/utils/generalUtil';
import { modLog, warn } from '../../../Database/schemas/User';
import { emojis } from '../../../Util/constants/emojis';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "modlogs",
description: "Muestra el historial que un moderador ha tenido en el servidor.",
category: "moderation",
aliases: ["logsmod", "logs"],
staff: true,
cooldown: 10,
usage: (prefix: "prefix") => "COMANDO",
example: (prefix: "prefix") => "COMANDO"
      })
  }


async run(base: TempContext) {
    try {
    const user = await getPerson(base.args[0], base.message) || base.message.author;
    const logs = await (await getDBUser(user.id)).modLogs;

    if (!logs || logs.length <= 0) return base.message.reply(`> ${emojis.zwo_viendo} __**${user.username}** no tiene registros de moderación.__`);



    const arrays = separateArray(logs, 10) as Array<Array<modLog>>
    

    const embed = new MessageEmbed().setColor("DARK_PURPLE").setAuthor(`Registros de moderación de ${user.username}`, user.displayAvatarURL());

    if (arrays.length == 1) {
        const text = constructWarns(arrays[0])
        var n = 1;
        const a1= await base.message.reply({embeds: [embed.setDescription(`${text.slice(9)}`)], components: [base.ar(constructMenu(arrays[0]))]});
        const aw1 = a1.createMessageComponentCollector({componentType: "SELECT_MENU", max: 15, time: 60000});

        aw1.on("collect", async (m) => {
            const ar = arrays[0]
            const aa = m as SelectMenuInteraction;
            const b = Number(aa.values[0])
            const embed = new MessageEmbed().setColor("PURPLE").setAuthor(`${user.username}`, user.displayAvatarURL()).setThumbnail(base.guild.members.cache.get(ar[b].userID)?.displayAvatarURL() || await (await base.client.users.fetch(ar[b].userID)).displayAvatarURL()).setDescription(`__**${user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${await (await base.client.users.fetch(ar[b].userID)).tag}**__\n\n__${emojis.razon} **Razón:**__ ${ar[b].reason}\n${emojis.zd_regalo} **__Estado:__** ${ar[b].status == "activo" ? `Activo ${emojis.status_activo} ` : `Borrado: ${emojis.status_inactivo}`}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0,-3)}>**`)
            aa.update({embeds: [embed]});
        })

    } else {
        const m1 = await base.message.reply({embeds: [embed.setDescription(constructWarns(arrays[0]).slice(9))], components: [base.ar(base.b("SECONDARY", ".", "right", false, "<:rs_arrow_right:925996565049516062>"),base.b("SECONDARY", "ㅤ", "a", true), base.b("SECONDARY", "ㅤ", "b", true), base.b("SECONDARY", "<:rs_arrow_right:925996565049516062>", "left", false, "<:rs_arrow_left:925998028467351552>")), base.ar(constructMenu(arrays[0]))]});

        const embeds = [];
        for (let i = 0; i < arrays.length; i++) {
            embeds.push(new MessageEmbed().setColor("DARK_PURPLE").setAuthor(`Registros de moderación de ${user.username}`, user.displayAvatarURL() || base.member.user.displayAvatarURL()).setDescription(constructWarns(arrays[i], i).slice(9)));
        }

        var page: any = 0



        const aw1 = m1.createMessageComponentCollector({componentType: "SELECT_MENU", max: 15, time: 60000});
        const aw2 = m1.createMessageComponentCollector({componentType: "BUTTON", max: 15, time: 60000});


        

        aw1.on("collect", async (m) => {

            if (m.member.id != base.member.id) return m.reply({content: `${emojis.zwo_viendo} __**¡Hey!, solo el autor del mensaje puede hacer esto**_`, ephemeral: true})
            const ar = arrays[page]
            const aa = m as SelectMenuInteraction;
            const b = Number(aa.values[0])
            const embed = new MessageEmbed().setColor("PURPLE").setAuthor(`${user.username}`, user.displayAvatarURL()).setThumbnail(base.guild.members.cache.get(ar[b].userID)?.displayAvatarURL() || await (await base.client.users.fetch(ar[b].userID)).displayAvatarURL()).setDescription(`__**${user.tag} ${ar[b].type == "unmute" ? `desmuteó` : `${ar[b].type}eó`} a ${await (await base.client.users.fetch(ar[b].userID)).tag}**__\n\n__${emojis.razon} **Razón:**__ ${ar[b].reason}\n${emojis.zd_regalo} **__Estado:__** ${ar[b].status == "activo" ? `Activo ${emojis.status_activo} ` : `Borrado ${emojis.status_inactivo}`}\n⏰ **__El:__ <t:${String(ar[b].at).slice(0,-3)}>**`)
            m.update({embeds: [embed], components: [base.ar(constructMenu(arrays[page], page))]});
        })

        aw2.on("collect", async (m) => {
            const cc = m as ButtonInteraction;

            if (cc.member.id !== base.message.author.id) return cc.reply({content: `${emojis.zwo_viendo} __**Hey! Solo el autor del mensaje puede hacer esto**__`, ephemeral: true});

            if (cc.customId == "right") {
                if (page !== 0) {
                    --page;
                    cc.update({embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow)),base.ar(constructMenu(arrays[page], page))]});
                } else {
                    page = [embeds.length - 1];
                    cc.update({embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow)),base.ar(constructMenu(arrays[page], page))]});
                }
            } else if (cc.customId == "left") {
                if (page < embeds.length - 1) {
                    page++;
                    cc.update({embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow)),base.ar(constructMenu(arrays[page], page))]});
                } else {
                    page = 0
                    cc.update({embeds: [embeds[page]], components: [base.ar(base.b(`SECONDARY`, `.`, `right`, false, emojis.right_arrow), base.b(`SECONDARY`, `ㅤ`, `a`, true), base.b(`SECONDARY`, `ㅤ`, `b`, true), base.b(`SECONDARY`, `.`, `left`, false, emojis.left_arrow)),base.ar(constructMenu(arrays[page], page))]});
                }
            }
        })
    }






///////////////////////////////////////////////////////////////////////








    function constructWarns(warns: modLog[], page: number = 0) {
        var owo;

        var num = 1;

        if (page > 0) {
            num = page * 10 + 1
        }

        for (let i = 0; i < warns.length; i++) {
            owo += ` ${warns[i].status == "activo" ? "<:resource_active:925990699130814495>" : "<:resource_inactive:925990473682784316>"} #${num}: **${ucFirst(warns[i].type)}** - ${base.client.users.cache.get(warns[i].userID) || `No encontrado`}\n\n`
            num = num + 1;
        }
    
        return owo;
    }

    function constructMenu(modlogs: modLog[], page: number = 0) {

var a = []




var number = 0;
var nn = 0

if (page > 0) {
    number = page * 10 + 1;
}
        for (const log of modlogs) {

            const emoji = log.status == "activo" ? "<:resource_active:925990699130814495>" : "<:resource_inactive:925990473682784316>";

            const option = {
                value: `${nn}`,
                label: `#${number}: ${ucFirst(log.type)} - ${base.client.users.cache.get(log.userID)?.tag || "No encontrado"}`,	
                description: `${log.reason}`,
                emoji: emoji
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
    }} catch (e) {
        console.log(e)
    }
}}