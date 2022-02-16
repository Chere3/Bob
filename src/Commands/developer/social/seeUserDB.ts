import { Client } from "discord.js";
import { inspect } from "util";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";
import { getUserDB } from "../../../Util/Functions/utils/DBUtil";

export default class NameCommand extends BaseCommand {
  constructor(client: Client) {
    super(client, {
      name: "userdb",
      description: "Descripcion",
    });
  }

  async run(base: TempContext) {
    if (!base.args[0])
      return base.message.reply(`El ID del usuario es obligatorio.`);
    const a = await getUserDB(base.args[0]).catch((a) => {
      base.message.reply(a);
    });

    const b = inspect(a, { depth: Number(base.args[1] || 1) });

    base.message.reply(`\`\`\`json\n${b}\`\`\``);
  }
}
