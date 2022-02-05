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
exports.getDBUser = void 0;
const User_1 = require("../../Database/schemas/User");
function getDBUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield User_1.userModel
            .findOne({ id: userID })
            .catch((err) => err);
        if (!user) {
            const usuario = new User_1.userModel({
                id: `${userID}`,
            });
            user = yield usuario.save().catch((err) => console.log(err));
        }
        const usser = user;
        return usser;
    });
}
exports.getDBUser = getDBUser;
