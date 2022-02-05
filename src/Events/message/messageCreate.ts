import { TempContext } from "../../Util/Classes/Context";
import { config } from "../../config";
import { getDBUser } from "../../Util/managers/userManager";
import { Message } from "discord.js";
import { spammer } from "../../Util/managers/littleManagers/autoresponder";
import {
  getDBDescriptions,
  getDBImages,
} from "../../Util/managers/littleManagers/socialCommandsManager";
import { getDBChannel } from "../../Util/managers/channelManager";
import { getTestMode } from "../../Util/managers/littleManagers/cacheManager";
import { sentry } from "../..";
import { transaction } from '../../index';
import { emojis } from "../../Util/constants/emojis";

var prefix  = config.prefix;

export const run = async (bot, msg: Message) => {

  if (getTestMode() == true) {prefix = "!!"}

  transaction
  

  spammer(msg);
  if (msg.author.bot) return;
  await getDBDescriptions();
  await getDBImages();

  await getDBUser(msg.author.id);
  await getDBChannel(msg.channel.id);
  if (!msg.content.startsWith(prefix)) return;
  if (getTestMode() == true && !config.owners.includes(msg.member.id)) return msg.reply(`> __**Lo siento, pero cuando estoy en modo de pruebas solo mis desarrolladores pueden usarme.**__`)
  const message = new TempContext(bot, msg);


  var argss = msg.content.slice(prefix.length).trim().split(/ +/g);
  var args = [];    
  var flags = [];

  for (const arg of argss) {
    if (arg.startsWith("#")) {
      flags.push(arg.slice(1));
    } else {
      args.push(arg);
    }
  }
  message.args = args
  const command = args.shift().toLowerCase();
  message.flags = flags;

  let cmd =
    message.client.commands.get(command) ||
    message.client.commands.find(
      (c) => c.aliases && c.aliases.includes(command)
    );
  if (!cmd) return;
  if (await cmd.canRun(msg, false) !== false) return;

  try {
  cmd.run(message);
  } catch (e) {
    sentry.captureException(e);
    msg.reply(`> ${emojis.zdo_sospechoso} __**He detectado un error en la ejecución del comando, el error ha sido puesto en la base de datos y pronto será solucionado**__`)
  } finally {
    transaction.finish();
  }
};
