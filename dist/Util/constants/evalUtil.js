"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUtil = exports.APIUtil = exports.cacheUtil = exports.moderationutil = exports.dbUtil = exports.textUtil = exports.socialCommandUtil = exports.snipeUtil = void 0;
const editSnipeManager_1 = require("../managers/littleManagers/editSnipeManager");
const snipeManager_1 = require("../managers/littleManagers/snipeManager");
const socialCommandsManager_1 = require("../managers/littleManagers/socialCommandsManager");
const Images_1 = require("../../Database/schemas/Images");
const textUtil_1 = require("../Functions/utils/textUtil");
const generalUtil_1 = require("../Functions/utils/generalUtil");
const moderationManager_1 = require("../managers/moderationManager");
const apiUtil_1 = require("../Functions/utils/apiUtil");
const channelManager_1 = require("../managers/channelManager");
const DBUtil_1 = require("../Functions/utils/DBUtil");
const loggerManager_1 = require("../managers/loggerManager");
const privateIntancesManager_1 = require("../managers/privateIntancesManager");
const User_1 = require("../../Database/schemas/User");
const cacheManager_1 = require("../managers/cacheManager");
const globals_1 = require("./globals");
const util_1 = require("util");
const discord_js_1 = __importDefault(require("discord.js"));
const index = __importStar(require("../.."));
exports.snipeUtil = {
    checkImages: socialCommandsManager_1.checkImage,
    uploadImage: snipeManager_1.uploadImageToA,
    moveImages: snipeManager_1.detectAndMoveImages,
    moveStickers: snipeManager_1.detectAndMoveStickers,
    moveEmbeds: editSnipeManager_1.detectAndMoveEmbeds,
    addSnipe: snipeManager_1.addSnipe
};
exports.socialCommandUtil = {
    addImage: socialCommandsManager_1.addImage,
    getImages: socialCommandsManager_1.getDBImages,
    imageModel: Images_1.imagesModel,
    sortImages: socialCommandsManager_1.sortImages,
    getImage: socialCommandsManager_1.getRandomCategorieImage,
    getDesc: socialCommandsManager_1.getDBDescriptions,
    getNumber: socialCommandsManager_1.getIntNumber1,
    checkDescription: socialCommandsManager_1.checkDescription,
    final: socialCommandsManager_1.getFinalResult,
    deleteImage: socialCommandsManager_1.deleteImage
};
exports.textUtil = {
    separeText: textUtil_1.separeTexto,
    separeArray: generalUtil_1.separateArray,
    constructMenu: snipeManager_1.constructMenu,
    inspect: util_1.inspect,
    discord: discord_js_1.default
};
exports.dbUtil = {
    getChannel: apiUtil_1.getChannel,
    getDBChannel: channelManager_1.getDBChannel,
    getUser: DBUtil_1.getUserDB,
    getDBImages: socialCommandsManager_1.getDBImages,
    userModel: User_1.userModel,
    imagesModel: Images_1.imagesModel,
};
exports.moderationutil = {
    muteManager: moderationManager_1.muteManager,
    warnManager: moderationManager_1.warnManager,
    historialManager: moderationManager_1.historialManager,
    logsManagerBot: loggerManager_1.moderationBotLogs,
    checkLevel: globals_1.checkLevel,
    moderationUtil: moderationManager_1.moderationUtil,
    timeoutManager: moderationManager_1.timeoutManager,
    banManager: moderationManager_1.banManager,
    kickManager: moderationManager_1.kickManager,
    translateTime: globals_1.Translatetime,
};
exports.cacheUtil = {
    cache: index.db,
    cacheManager: cacheManager_1.CacheManager,
    privateInstances: privateIntancesManager_1.PrivateInstances
};
exports.APIUtil = {
    validate: apiUtil_1.validate,
    getApiUser: apiUtil_1.getApiUser,
    getPerson: apiUtil_1.getPerson,
    getChannel: apiUtil_1.getChannel,
    searchUser: apiUtil_1.SearchUser,
    getColor: apiUtil_1.getColor,
    getMember: apiUtil_1.getMember,
    getBan: apiUtil_1.getBannedUser
};
exports.allUtil = {
    snipeCore: exports.snipeUtil,
    socialCommandsCore: exports.socialCommandUtil,
    textCore: exports.textUtil,
    databaseCore: exports.dbUtil,
    moderationCore: moderationManager_1.moderationUtil,
    cacheCore: exports.cacheUtil,
    APIUtil: exports.APIUtil
};
