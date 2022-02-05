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
const discord_js_1 = require("discord.js");
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const Images_1 = require("../../Database/schemas/Images");
const socialCommandsManager_1 = require("../../Util/managers/littleManagers/socialCommandsManager");
const socialCommandsManager_2 = require("../../Util/managers/littleManagers/socialCommandsManager");
const textUtil_1 = require("../../Util/Functions/utils/textUtil");
const snipeManager_1 = require("../../Util/managers/littleManagers/snipeManager");
const apiUtil_1 = require("../../Util/Functions/utils/apiUtil");
const channelManager_1 = require("../../Util/managers/channelManager");
const listBanManager_1 = require("../../Util/managers/littleManagers/listBanManager");
const index_1 = require("../../index");
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const moderationManager_1 = require("../../Util/managers/moderationManager");
const generalUtil_1 = require("../../Util/Functions/utils/generalUtil");
const loggerManager_1 = require("../../Util/managers/loggerManager");
const User_1 = require("../../Database/schemas/User");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Saca un eval del código.",
            category: "dev",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkearImagen = socialCommandsManager_2.checkImage;
            const imgadd = socialCommandsManager_2.addImage;
            const imagenes = socialCommandsManager_2.getDBImages;
            const imgs = Images_1.imagesModel;
            const sortear = socialCommandsManager_2.sortImages;
            const getImage = socialCommandsManager_2.getRandomCategorieImage;
            const getD = socialCommandsManager_2.getDBDescriptions;
            const intnumber = socialCommandsManager_1.getIntNumber1;
            const checkD = socialCommandsManager_1.checkDescription;
            const separe = textUtil_1.separeTexto;
            const result = socialCommandsManager_1.getFinalResult;
            const uplImg = snipeManager_1.uploadImageToA;
            const upl = snipeManager_1.detectAndMoveImages;
            const upt = snipeManager_1.detectAndMoveStickers;
            const upy = snipeManager_1.detectEmbeds;
            const separate = generalUtil_1.separateArray;
            const addsnipe = snipeManager_1.addSnipe;
            const getCh = apiUtil_1.getChannel;
            const dbchannel = channelManager_1.getDBChannel;
            const formatT = moderationManager_1.formatTime;
            const constructmenu = snipeManager_1.constructMenu;
            const usermodel = User_1.userModel;
            const list = listBanManager_1.formatBans;
            const test = cacheManager_1.getTestMode;
            const cache = index_1.db;
            const casee = moderationManager_1.createCaseNumber;
            const mm = moderationManager_1.muteManager;
            const wm = moderationManager_1.warnManager;
            const hm = moderationManager_1.historialManager;
            const blm = loggerManager_1.moderationBotLogs;
            const { query, flags } = (0, textUtil_1.parseQuery)(base.args);
            if (!query.length)
                return;
            let input = query.join(" ");
            const embed = new discord_js_1.MessageEmbed().setAuthor(`🧠 Calculado.`);
            try {
                if (flags.includes("async")) {
                    input = `(async () => { ${input} })()`;
                }
                if (flags.includes("delete"))
                    base.message.delete();
                let { evaled, type } = yield (0, textUtil_1.parseEval)(eval(input));
                let depth = `0`;
                if (flags.some((input) => input.includes("depth"))) {
                    depth = flags.find((number) => number.includes("depth")).split("=")[1];
                    depth = parseInt(`${depth}`, 10);
                }
                if (flags.includes("silent"))
                    return;
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled, { depth });
                let output = evaled
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
                if (output.length > 4096) {
                    (0, textUtil_1.separeTexto)(output, 4000).map((x) => {
                        base.channel.send({
                            embeds: [embed.setDescription(`\`\`\`javascript\n${x}\`\`\``)],
                        });
                    });
                }
                else {
                    embed.setDescription("```js\n" + output + "```");
                }
                embed.setFooter(`Tipo: ${type} | Ping: ${base.client.ws.ping}ms`);
                embed.setColor(0x002c2f33);
                return base.channel.send({ embeds: [embed] });
            }
            catch (error) {
                if (error.length > 6000) {
                    (0, textUtil_1.separeTexto)(error, 5000).map((x) => {
                        base.channel.send({
                            embeds: [embed.setDescription(`\`\`\`javascript\n${x}\`\`\``)],
                        });
                    });
                }
                else {
                    embed.setDescription("```js\n" + error + "```");
                }
                embed.setFooter(`Tipo: ${(0, textUtil_1.parseType)(error)} | Ping: ${base.client.ws.ping}ms`);
                return base.channel.send({ embeds: [embed] });
            }
        });
    }
}
exports.default = NameCommand;
