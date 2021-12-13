import { Client, MessageEmbed } from 'discord.js';
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { formatBans } from "../../Util/Functions/managers/littleManagers/listBanManager";


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "setlist",
dev: true,
      })
  }


async run(base: TempContext) {
    const bans = await formatBans(base.message) as Array<Array<String>>

    var one = 1;
    for (const ban of bans) {
        
        const embed = new MessageEmbed().setDescription(ban.join("\n")).setAuthor(`Lista de baneos ${one}`).setTimestamp().setColor(`ORANGE`).setFooter(`${ban.length} baneados en esta página.`)
        base.message.channel.send({embeds: [embed]})

        one = one + 1
    }
}}