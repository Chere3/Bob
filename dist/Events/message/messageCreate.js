"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Context_1 = require("../../Util/Classes/Context");
const config_1 = require("../../config");
const userManager_1 = require("../../Util/managers/userManager");
const autoresponder_1 = require("../../Util/managers/littleManagers/autoresponder");
const socialCommandsManager_1 = require("../../Util/managers/littleManagers/socialCommandsManager");
const channelManager_1 = require("../../Util/managers/channelManager");
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const __1 = require("../..");
const index_1 = require("../../index");
const emojis_1 = require("../../Util/constants/emojis");
var prefix = config_1.config.prefix;
const run = (bot, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true) {
        prefix = "!!";
    }
    index_1.transaction;
    (0, autoresponder_1.spammer)(msg);
    if (msg.author.bot)
        return;
    yield (0, socialCommandsManager_1.getDBDescriptions)();
    yield (0, socialCommandsManager_1.getDBImages)();
    yield (0, userManager_1.getDBUser)(msg.author.id);
    yield (0, channelManager_1.getDBChannel)(msg.channel.id);
    if (!msg.content.startsWith(prefix))
        return;
    if ((0, cacheManager_1.getTestMode)() == true && !config_1.config.owners.includes(msg.member.id))
        return msg.reply(`> __**Lo siento, pero cuando estoy en modo de pruebas solo mis desarrolladores pueden usarme.**__`);
    const message = new Context_1.TempContext(bot, msg);
    var argss = msg.content.slice(prefix.length).trim().split(/ +/g);
    var args = [];
    var flags = [];
    for (const arg of argss) {
        if (arg.startsWith("#")) {
            flags.push(arg.slice(1));
        }
        else {
            args.push(arg);
        }
    }
    message.args = args;
    const command = args.shift().toLowerCase();
    message.flags = flags;
    let cmd = message.client.commands.get(command) ||
        message.client.commands.find((c) => c.aliases && c.aliases.includes(command));
    if (!cmd)
        return;
    if ((yield cmd.canRun(msg, false)) !== false)
        return;
    try {
        cmd.run(message);
    }
    catch (e) {
        __1.sentry.captureException(e);
        msg.reply(`> ${emojis_1.emojis.zdo_sospechoso} __**He detectado un error en la ejecución del comando, el error ha sido puesto en la base de datos y pronto será solucionado**__`);
    }
    finally {
        index_1.transaction.finish();
    }
});
exports.run = run;
