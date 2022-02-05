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
exports.getDBChannel = void 0;
const Channel_1 = require("../../Database/schemas/Channel");
function getDBChannel(channelID) {
    return __awaiter(this, void 0, void 0, function* () {
        var channel = yield Channel_1.channelModel
            .findOne({ id: channelID })
            .catch((err) => err);
        if (!channel) {
            const canal = new Channel_1.channelModel({
                id: `${channelID}`,
            });
            channel = yield canal.save().catch((err) => console.log(err));
        }
        const channnel = channel;
        return channnel;
    });
}
exports.getDBChannel = getDBChannel;
