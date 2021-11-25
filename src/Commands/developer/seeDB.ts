import { Client } from "discord.js";
import { inspect } from "util";
import { BaseCommand } from "../../Util/Classes/BaseCommand";
import { TempContext } from "../../Util/Classes/Context";
import { getUserDB } from "../../Util/Functions/utils/DBUtil";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "seedb",
      description: "Descripcion",
    });
  }

  async run(base: TempContext) {
    const a = await getUserDB(base.member.id);

    const b = inspect(a);

    base.message.reply(`\`\`\`json\n${b}\`\`\``);
  }
}
