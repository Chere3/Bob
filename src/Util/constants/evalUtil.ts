import { detectAndMoveEmbeds } from "../managers/littleManagers/editSnipeManager";
import { addSnipe, constructMenu, detectAndMoveImages, detectAndMoveStickers, uploadImageToA } from "../managers/littleManagers/snipeManager";
import { addImage, checkDescription, checkImage, deleteImage, finalSocialCommand, getDBDescriptions, getDBImages, getFinalResult, getIntNumber1, getRandomCategorieImage, sortImages } from "../managers/littleManagers/socialCommandsManager";
import { images, imagesModel } from '../../Database/schemas/Images';
import { separeTexto } from '../Functions/utils/textUtil';
import { separateArray } from '../Functions/utils/generalUtil';
import { muteManager, warnManager, historialManager, moderationUtil, timeoutManager, kickManager, banManager } from '../managers/moderationManager';
import { getApiUser, getBannedUser, getChannel, getColor, getMember, getPerson, SearchUser, validate } from "../Functions/utils/apiUtil";
import { getDBChannel } from "../managers/channelManager";
import { getUserDB } from "../Functions/utils/DBUtil";
import { moderationBotLogs } from '../managers/loggerManager';
import { DBUser, userModel } from '../../Database/schemas/User';
import { db } from '../../index';
import { CacheManager } from '../managers/cacheManager';
import { checkLevel, Translatetime } from './globals';
import { inspect } from "util";
import discord, { GuildBan, Message, MessageActionRow } from "discord.js";
import { deletedImageData, imageAPI, imagesDB } from "./imagesDB";
import { DBChannel } from "../../Database/schemas/Channel";
import { Document, Model } from "mongoose";
import { descriptions } from "../../Database/schemas/descriptions";
import { Channel } from "diagnostics_channel";
import { levels } from "./moderationDataManager";
import { JsonDB } from "node-json-db";

export const snipeUtil = {
    checkImages: checkImage,
    uploadImage: uploadImageToA,
    moveImages: detectAndMoveImages,
    moveStickers: detectAndMoveStickers,
    moveEmbeds: detectAndMoveEmbeds,
    addSnipe: addSnipe
}

export const socialCommandUtil = {
    addImage: addImage,
    getImages: getDBImages,
    imageModel: imagesModel,
    sortImages: sortImages,
    getImage: getRandomCategorieImage,
    getDesc: getDBDescriptions,
    getNumber: getIntNumber1,
    checkDescription: checkDescription,
    final: getFinalResult,
    deleteImage: deleteImage
}

export const textUtil = {
    separeText: separeTexto,
    separeArray: separateArray,
    constructMenu: constructMenu,
    inspect: inspect,
    discord: discord
}

export const dbUtil = {
    getChannel: getChannel,
    getDBChannel: getDBChannel,
    getUser: getUserDB,
    getDBImages: getDBImages,
    userModel: userModel,
    imagesModel: imagesModel,
}

export const moderationutil = {
    muteManager: muteManager,
    warnManager: warnManager,
    historialManager: historialManager,
    logsManagerBot: moderationBotLogs,
    checkLevel: checkLevel,
    moderationUtil: moderationUtil,
    timeoutManager: timeoutManager,
    banManager: banManager,
    kickManager: kickManager,
    translateTime: Translatetime,
}

export const cacheUtil = {
    cache: db,
    cacheManager: CacheManager
}

export const APIUtil = {
    validate: validate,
    getApiUser: getApiUser,
    getPerson: getPerson,
    getChannel: getChannel,
    searchUser: SearchUser,
    getColor: getColor,
    getMember: getMember,
    getBan: getBannedUser
}

export const allUtil = {
    snipeCore: snipeUtil,
    socialCommandsCore: socialCommandUtil,
    textCore: textUtil,
    databaseCore: dbUtil,
    moderationCore: moderationUtil,
    cacheCore: cacheUtil,
    APIUtil: APIUtil
}