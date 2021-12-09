import { TempContext } from "../Util/Classes/Context";
import { config } from "../config";
import { getDBUser } from "../Util/Functions/managers/userManager";
import { Message } from "discord.js";
import { spammer } from "../Util/Functions/managers/littleManagers/autoresponder";
import {
  getDBDescriptions,
  getDBImages,
} from "../Util/Functions/managers/littleManagers/socialCommandsManager";
import { MasterCleverbot } from "../Util/Functions/managers/littleManagers/cleverbotManager";
import { getDBChannel } from "../Util/Functions/managers/channelManager";

const { prefix } = config;

export const run = async (bot, msg: Message) => {
  spammer(msg);
  if (msg.author.bot) return;

  var name = (await msg.channel.name) || " ";

  if (msg.channel.type !== "GUILD_TEXT") {
    return;
  } else if (name.includes("cleverbot") == true) {
    return MasterCleverbot(msg);
  }

  await getDBDescriptions();
  await getDBImages();

  await getDBUser(msg.author.id);
  await getDBChannel(msg.channel.id);
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
