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
const Context_1 = require("../Util/Classes/Context");
const config_1 = require("../config");
const userManager_1 = require("../Util/managers/userManager");
const autoresponder_1 = require("../Util/managers/littleManagers/autoresponder");
const socialCommandsManager_1 = require("../Util/managers/littleManagers/socialCommandsManager");
const channelManager_1 = require("../Util/managers/channelManager");
const cacheManager_1 = require("../Util/managers/littleManagers/cacheManager");
var prefix = config_1.config.prefix;
const run = (bot, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true) {
        prefix = "!!";
    }
    (0, autoresponder_1.spammer)(msg);
    if (msg.author.bot)
        return;
    yield (0, socialCommandsManager_1.getDBDescriptions)();
    yield (0, socialCommandsManager_1.getDBImages)();
    yield (0, userManager_1.getDBUser)(msg.author.id);
    yield (0, channelManager_1.getDBChannel)(msg.channel.id);
    if (!msg.content.startsWith(prefix))
        return;
    const message = new Context_1.TempContext(bot, msg);
    message.args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const args = message.args, command = args.shift().toLowerCase();
    let cmd = message.client.commands.get(command) ||
        message.client.commands.find((c) => c.aliases && c.aliases.includes(command));
    if (!cmd)
        return;
    if ((yield cmd.canRun(msg, false)) !== false)
        return;
    cmd.run(message);
});
exports.run = run;
