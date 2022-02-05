import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { moab } from "../../Util/managers/littleManagers/snipeManager";


export default class NameCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "moab",
dev: true,
      })
  }


async run(base: TempContext) {
    await moab(base.args[0] || base.message.channel.id)

    const channel = base.client.channels.cache.get(base.args[0] || base.message.channel.id).name

    return base.message.reply(` Borrados todos los snipes en el canal ${channel}`)
}}