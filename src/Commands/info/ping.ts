import { Client } from "discord.js";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "ping",
      description: "Pinguea con este comando",
    });
  }

  async run(base: TempContext) {
    base.message.reply(`**Ping de ${base.client.ws.ping}ms** !`);
  }
}
