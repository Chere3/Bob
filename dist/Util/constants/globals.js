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
exports.Translatetime = exports.checkLevel = exports.avatar = void 0;
function avatar(member) {
    return __awaiter(this, void 0, void 0, function* () {
        return member.displayAvatarURL() || member.user.displayAvatarURL();
    });
}
exports.avatar = avatar;
function checkLevel(member) {
    if (member.permissions.has('ADMINISTRATOR'))
        return 'creator';
    if (member.roles.cache.has(`913123943941025822`))
        return `high staff`;
    if (member.roles.cache.has(`913123947397148682`))
        return `medium staff`;
    if (member.permissions.has(`MANAGE_MESSAGES`))
        return `staff`;
    return `normal member`;
}
exports.checkLevel = checkLevel;
function Translatetime(time) {
    if (time.includes('s'))
        return `${time.replace('s', '')} segundos`;
    if (time.includes('m'))
        return `${time.replace('m', '')} minutos`;
    if (time.includes('h'))
        return `${time.replace('h', '')} horas`;
    if (time.includes('d'))
        return `${time.replace('d', '')} días`;
    if (time.includes('w'))
        return `${time.replace('w', '')} meses`;
    if (time.includes('y'))
        return `${time.replace('y', '')} años`;
    return;
}
exports.Translatetime = Translatetime;
