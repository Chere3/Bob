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
const cacheManager_1 = require("../Util/managers/littleManagers/cacheManager");
const editSnipeManager_1 = require("../Util/managers/littleManagers/editSnipeManager");
const run = (client, message, editedMessage) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    (0, editSnipeManager_1.editSnipeCore)(message, editedMessage);
});
exports.run = run;
