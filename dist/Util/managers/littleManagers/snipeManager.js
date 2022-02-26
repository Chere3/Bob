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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructMenu = exports.combineAll = exports.moab = exports.snipeCore = exports.deleteLastSnipe = exports.addSnipe = exports.uploadImageToA = exports.detectEmbeds = exports.detectAndMoveStickers = exports.detectAndMoveImages = void 0;
const discord_js_1 = require("discord.js");
const superagent_1 = __importDefault(require("superagent"));
const channelManager_1 = require("../channelManager");
const socialCommandsManager_1 = require("./socialCommandsManager");
const Channel_1 = require("../../../Database/schemas/Channel");
const emojis_1 = require("../../constants/emojis");
const __1 = require("../../..");
function detectAndMoveImages(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.attachments.size == 0 && message.embeds.length == 0)
            return [];
        var array = [];
        const attachments = message.attachments.map(attachment => attachment);
        const embeds = message.embeds.filter(embed => embed.type == "image");
        for (const embed of embeds) {
            array.push(embed.url);
        }
        for (const attachment of attachments) {
            try {
                yield (0, socialCommandsManager_1.checkImage)(attachment.proxyURL);
                const image = yield uploadImageToA(attachment.proxyURL);
                array.push(image.url);
            }
            catch (error) {
                array.push(attachment.proxyURL);
                console.log(error);
            }
        }
        return array;
    });
}
exports.detectAndMoveImages = detectAndMoveImages;
function detectAndMoveStickers(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.stickers.size == 0)
            return [];
        var array = [];
        const stickers = message.stickers.map(attachment => attachment);
        for (const sticker of stickers) {
            try {
                yield sticker.fetch();
                yield (0, socialCommandsManager_1.checkImage)(sticker.url);
                const image = yield uploadImageToA(sticker.url);
                array.push(image.url);
            }
            catch (error) {
                array.push(sticker.url);
            }
        }
        return array;
    });
}
exports.detectAndMoveStickers = detectAndMoveStickers;
function detectEmbeds(message) {
    var _a;
    if (((_a = message.embeds) === null || _a === void 0 ? void 0 : _a.length) == 0)
        return [];
    return message.embeds;
}
exports.detectEmbeds = detectEmbeds;
function uploadImageToA(imageURL) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.transaction;
        try {
            const a = yield superagent_1.default.get(`https://api.imgbb.com/1/upload?key=${process.env.API_IMGS}&image=${imageURL}`);
            return a.body.data;
        }
        catch (error) {
            try {
                const a = yield superagent_1.default.get(`https://api.imgbb.com/1/upload?key=${process.env.API_IMGS2}&image=${imageURL}`);
                return a.body.data;
            }
            catch (error) {
                try {
                    const a = yield superagent_1.default.get(`https://api.imgbb.com/1/upload?key=${process.env.API_IMGS3}&image=${imageURL}`);
                    return a.body.data;
                }
                catch (error) {
                    try {
                        const a = yield superagent_1.default.get(`https://api.imgbb.com/1/upload?key=${process.env.API_IMGS4}&image=${imageURL}`);
                        return a.body.data;
                    }
                    catch (error) {
                        __1.sentry.captureException(error);
                    }
                    finally {
                        __1.transaction.finish();
                    }
                }
            }
        }
    });
}
exports.uploadImageToA = uploadImageToA;
function addSnipe(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, channelManager_1.getDBChannel)(message.channel.id);
        const attachments = yield detectAndMoveImages(message);
        const stickers = yield detectAndMoveStickers(message);
        const array = [];
        for (const snipe of channel.snipes) {
            array.push(snipe);
        }
        yield array.unshift({
            messageID: message.id,
            messageAuthor: message.member.nickname || message.author.username,
            messageAuthorAvatar: message.author.displayAvatarURL(),
            messageContent: message.content,
            messageAttachments: attachments,
            messageEmbeds: detectEmbeds(message),
            messageStickers: stickers,
            messageTimestamp: message.createdTimestamp,
        });
        return Channel_1.channelModel.findOneAndUpdate({ id: message.channel.id }, { snipes: array });
    });
}
exports.addSnipe = addSnipe;
function deleteLastSnipe(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, channelManager_1.getDBChannel)(message.channel.id);
        const array = [];
        for (const snipe of channel.snipes) {
            array.push(snipe);
        }
        if (array.length == 24) {
            array.pop();
        }
        else if (array.length > 24) {
            while (array.length > 24) {
                array.pop();
            }
            return Channel_1.channelModel.findOneAndUpdate({ id: message.channel.id }, { snipes: array });
        }
    });
}
exports.deleteLastSnipe = deleteLastSnipe;
function snipeCore(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteLastSnipe(message);
        return yield addSnipe(message);
    });
}
exports.snipeCore = snipeCore;
function moab(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, channelManager_1.getDBChannel)(id);
        const array = [];
        return Channel_1.channelModel.findOneAndUpdate({ id: id }, { snipes: array });
    });
}
exports.moab = moab;
function combineAll(stickerArray, imageArray) {
    var array = [];
    for (const sticker of stickerArray) {
        array.push(sticker);
    }
    for (const image of imageArray) {
        array.push(image);
    }
    return array;
}
exports.combineAll = combineAll;
function constructMenu(message) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (yield (0, channelManager_1.getDBChannel)(message.channel.id)).snipes;
        const array = [];
        var page = 0;
        for (const snipe of channel) {
            page = page + 1;
            var emoji;
            snipe.messageContent == null && snipe.messageAttachments[0] == undefined ? emoji = emojis_1.emojis.rs_censura : snipe.messageAttachments[0] !== undefined ? emoji = emojis_1.emojis.rs_image : emoji = emojis_1.emojis.rs_mensaje;
            const valor = {
                label: `${page} - ${snipe.messageAuthor}`,
                emoji: emoji,
                description: `${((_a = snipe.messageContent) === null || _a === void 0 ? void 0 : _a.slice(0, 30)) || ((_b = snipe.messageAttachments[0]) === null || _b === void 0 ? void 0 : _b.slice(0, 30)) || ((_c = snipe.messageStickers[0]) === null || _c === void 0 ? void 0 : _c.slice(0, 30)) || "."}... `,
                value: `${page - 1}`
            };
            array.push(valor);
        }
        while (array.length > 24) {
            array.pop();
        }
        const menu = new discord_js_1.MessageSelectMenu().addOptions(array).setCustomId("si").setPlaceholder(`Selecciona un mensaje`);
        const action = new discord_js_1.MessageActionRow().addComponents(menu);
        return action;
    });
}
exports.constructMenu = constructMenu;
