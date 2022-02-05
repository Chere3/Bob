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
exports.constructMenu = exports.editSnipeCore = exports.deleteSnipe = exports.addSnipe = exports.detectAndMoveEmbeds = exports.getAttachments = void 0;
const discord_js_1 = require("discord.js");
const channelManager_1 = require("../channelManager");
const snipeManager_1 = require("./snipeManager");
const socialCommandsManager_1 = require("./socialCommandsManager");
const Channel_1 = require("../../../Database/schemas/Channel");
function getAttachments(message, editedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.attachments.size == 0 && editedMessage.attachments.size == 0)
            return [];
        if (message.attachments.size == editedMessage.attachments.size)
            return [];
        const attachments = message.attachments.map((attachment) => attachment);
        const editedAttachments = editedMessage.attachments.map((attachment) => attachment);
        var array = [];
        for (const attachment of attachments) {
            if (editedAttachments.find((editedAttachment) => editedAttachment.proxyURL == attachment.proxyURL)) {
            }
            else {
                try {
                    yield (0, socialCommandsManager_1.checkImage)(attachment.url);
                    const image = yield (0, snipeManager_1.uploadImageToA)(attachment.proxyURL);
                    array.push(image.url);
                }
                catch (error) {
                    array.push(attachment.proxyURL);
                }
            }
        }
        return array;
    });
}
exports.getAttachments = getAttachments;
function detectAndMoveEmbeds(message, editedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.embeds.length == 0 && editedMessage.embeds.length == 0)
            return [];
        var array = [];
        const embeds = message.embeds.map((embed) => embed);
        const editedEmbeds = editedMessage.embeds.map((embed) => embed);
        for (const embed of embeds) {
            if (editedEmbeds.find((editedEmbed) => editedEmbed == embed)) {
            }
            else {
                array.push(embed);
            }
        }
        return array;
    });
}
exports.detectAndMoveEmbeds = detectAndMoveEmbeds;
function addSnipe(message, editedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, channelManager_1.getDBChannel)(message.channel.id);
        const attachments = yield getAttachments(message, editedMessage);
        const embeds = yield detectAndMoveEmbeds(message, editedMessage);
        const array = [];
        for (const snipe of channel.editsnipes) {
            array.push(snipe);
        }
        yield array.unshift({
            messageID: message.id,
            messageAuthor: message.member.nickname || message.member.user.username,
            messageAuthorAvatar: message.author.avatarURL(),
            messageContent: message.content,
            messageLink: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
            messageAttachments: attachments,
            messageEmbeds: embeds,
            messageTimestamp: message.createdTimestamp,
        });
        return Channel_1.channelModel.findOneAndUpdate({ id: message.channel.id }, { editsnipes: array });
    });
}
exports.addSnipe = addSnipe;
function deleteSnipe(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, channelManager_1.getDBChannel)(message.channel.id);
        const array = [];
        if (channel == undefined)
            return;
        for (const snipe of channel.editsnipes) {
            array.push(snipe);
        }
        if (array.length == 24) {
            array.pop();
        }
        else if (array.length > 24) {
            while (array.length > 24) {
                array.pop();
            }
        }
        return Channel_1.channelModel.findOneAndUpdate({ id: message.channel.id }, { editsnipes: array });
    });
}
exports.deleteSnipe = deleteSnipe;
function editSnipeCore(message, editedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteSnipe(message).catch((error) => console.log(error));
        return (yield addSnipe(message, editedMessage));
    });
}
exports.editSnipeCore = editSnipeCore;
function constructMenu(message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (yield (0, channelManager_1.getDBChannel)(message.channel.id)).editsnipes;
        const array = [];
        var page = 0;
        for (const snipe of channel) {
            page = page + 1;
            const valor = {
                label: `${page} - ${snipe.messageAuthor}`,
                description: `${((_a = snipe.messageContent) === null || _a === void 0 ? void 0 : _a.slice(0, 30)) || ((_b = snipe.messageAttachments[0]) === null || _b === void 0 ? void 0 : _b.slice(0, 30)) || "."}... `,
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
