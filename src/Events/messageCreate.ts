import { TempContext } from "../Util/Classes/Context";
import { config } from "../config";
import { getDBUser } from "../Util/Functions/managers/userManager";
import { getCleverbot } from "../Util/Functions/utils/textUtil";
import { Message } from "discord.js";

const { prefix } = config;

export const run = async (bot, msg: Message) => {
  if (msg.author.bot) return;

  if (msg.channel.id == "914963515205378078") {
    const a = await getCleverbot(msg.content).catch((a) => {
      return msg.reply(
        `\`\`\`diff\n- Ha ocurrido un error cuando cleverbot te iba a contestar, por favor intentalo más tarde.\n${a}\`\`\``
      );
    });

    return msg
      .reply({ content: a, allowedMentions: { repliedUser: true } })
      .catch((a) => {
        msg.reply(
          `\`\`\`diff\n- Ha ocurrido un error cuando clverbot te iba a responder.\n${a}\`\`\``
        );
      });
  }

  await getDBUser(msg.author.id);
  if (!msg.content.startsWith(prefix)) return;
  const message = new TempContext(bot, msg);

  message.args = msg.content.slice(prefix.length).trim().split(/ +/g);

  const args = message.args,
    command = args.shift().toLowerCase();

  let cmd =
    message.client.commands.get(command) ||
    message.client.commands.find(
      (c) => c.aliases && c.aliases.includes(command)
    );
  if (!cmd) return;
  if (cmd.canRun(msg, false)) return;

  cmd.run(message);
};
