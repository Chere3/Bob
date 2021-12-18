import { ButtonInteraction, Client, MessageEmbed } from 'discord.js';
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { db } from '../../index';


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "testmode",
dev: true,
      })
  }


async run(base: TempContext) {
    const embed = new MessageEmbed().setAuthor(`Modo canary.`).setDescription(`Activar este modo desactiva muchas de las funciones centrales del bot y cambia el prefix a \`!!\``).setColor("PURPLE");


    const m1 = await base.message.reply({embeds: [embed], components: [base.ar(base.b("PRIMARY", "Activar", "a"), base.b("SECONDARY", "Desactivar", "b"))]});


   const aw1=  m1.createMessageComponentCollector({componentType: "BUTTON", filter: b => b.member.id == base.message.author.id});

   aw1.on("collect",  a => {
       a = a as ButtonInteraction
         if (a.customId == "a") {
              db.push("/", {test: true})
              base.message.reply("Modo canary activado.");
         } else if (a.customId == "b") {
            db.push("/", {test: false})
              base.message.reply("Modo canary desactivado.");
         }
   })


}}