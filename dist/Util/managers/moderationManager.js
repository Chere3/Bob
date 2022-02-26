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
exports.banManager = exports.kickManager = exports.warnManager = exports.timeoutManager = exports.muteManager = exports.historialManager = exports.moderationUtil = void 0;
const index_1 = require("../../index");
const userManager_1 = require("./userManager");
const User_1 = require("../../Database/schemas/User");
const loggerManager_1 = require("./loggerManager");
const ModerationServer_1 = require("../../Database/schemas/ModerationServer");
const DBUtil_1 = require("../Functions/utils/DBUtil");
const cacheManager_1 = require("./cacheManager");
const globals_1 = require("../constants/globals");
class moderationUtil {
    constructor() {
    }
    deleteWarnDB(memberID, moderatorID, caseNumber, reason = "No se puso una razón.", guildID = "912858763126538281") {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const dataUser = yield (0, userManager_1.getDBUser)(memberID);
            const dataMod = yield (0, userManager_1.getDBUser)(moderatorID);
            const cache = global.client.cache.getData("/warns");
            const dataHistorial = yield new historialManager(null, null, null, null, null, null, null, guildID).getHistorial();
            const warn = dataUser.warnsHistory.find(x => x.case == caseNumber);
            const caseN = yield this.createCaseNumber();
            if (!warn)
                throw new Error("El warn que has especificado no existe.");
            const action = {
                id: dataUser.id,
                moderator: moderatorID,
                reason: reason,
                case: caseN,
                at: now,
                caseOfDeletedWarn: warn.case,
                reasonOfDeletedWarn: warn.reason,
                deletedWarnAt: warn.at,
                moderatorOfDeletedWarn: warn.moderator
            };
            const a = [];
            const b = [];
            const c = [];
            const filter = dataUser.warnsHistory.filter(x => x.case != caseNumber);
            const cachefilter = cache.filter(x => x.case !== caseNumber);
            const modlog = dataMod.modLogs.find(x => x.moderator == moderatorID && (warn.at - x.at) <= 1000);
            if (!modlog)
                throw new Error("No se encontro el modlog");
            const filter2 = dataMod.modLogs.filter(x => x.moderator == warn.moderator && warn.at == x.at && x.type == "warn");
            for (const warn of filter) {
                a.push(warn);
            }
            for (const warn of filter2) {
                b.push(warn);
            }
            const deletedWarns = dataHistorial.warnsDelete || [];
            b.unshift({
                "userID": modlog.userID,
                "moderator": modlog.moderator,
                "reason": modlog.reason,
                "status": "borrada",
                "type": "warn",
                "at": modlog.at,
            });
            for (const warn of deletedWarns) {
                c.push(warn);
            }
            c.unshift(action);
            index_1.managerError;
            try {
                yield User_1.userModel.findOneAndUpdate({ id: memberID }, { warnsHistory: a, warns: Number(a.length) || 0 });
                yield User_1.userModel.findOneAndUpdate({ id: moderatorID }, { modLogs: b });
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: guildID }, { warnsDelete: c });
                index_1.db.push("/warns", cachefilter);
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
            return action;
        });
    }
    createWarn(member, moderator, reason, caseN, now) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, userManager_1.getDBUser)(member.id);
            const warn = {
                id: member.id,
                moderator: moderator.id,
                reason: reason,
                case: caseN,
                at: now,
            };
            const quantity = user.warns + 1;
            var b = [];
            for (const warn of user.warnsHistory) {
                b.push(warn);
            }
            b.unshift(warn);
            index_1.managerError;
            try {
                yield this.addModLog(caseN, "warn", member.id, moderator.id, reason, "activo", now);
                return User_1.userModel.findOneAndUpdate({ id: member.id }, { warns: quantity, warnsHistory: b });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    formatTime(time) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const year = day * 365;
        const times = ["s", "m", "h", "d", "w", "m", "y"];
        var time2;
        var t;
        var timeString;
        time = time.toLowerCase();
        for (var i = 0; i < time.length; i++) {
            time2 = time.split("");
        }
        for (var i = 0; i < time2.length; i++) {
            if (times.includes(time2[i])) {
                t = time2[i];
            }
        }
        if (!t)
            throw Error(`El formato de la hora es invalido.`);
        for (var i = 0; i < time.length; i++) {
            if (time[i] == t) {
                timeString = time.substring(0, i);
            }
        }
        timeString = Number(timeString);
        if (!timeString || isNaN(timeString))
            throw TypeError(`La hora proporcionada es inválida.`);
        if (t == "s")
            return Date.now() + (timeString * second);
        if (t == "m")
            return Date.now() + (timeString * minute);
        if (t == "h")
            return Date.now() + (timeString * hour);
        if (t == "d")
            return Date.now() + (timeString * day);
        if (t == "w")
            return Date.now() + (timeString * week);
        if (t == "m")
            return Date.now() + (timeString * month);
        if (t == "y")
            return Date.now() + (timeString * year);
    }
    timeConvert(time) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const year = day * 365;
        const times = ["s", "m", "h", "d", "w", "m", "y"];
        var time2;
        var t;
        var timeString;
        time = time.toLowerCase();
        for (var i = 0; i < time.length; i++) {
            time2 = time.split("");
        }
        for (var i = 0; i < time2.length; i++) {
            if (times.includes(time2[i])) {
                t = time2[i];
            }
        }
        if (!t)
            throw Error(`El formato de la hora es invalido.`);
        for (var i = 0; i < time.length; i++) {
            if (time[i] == t) {
                timeString = time.substring(0, i);
            }
        }
        timeString = Number(timeString);
        if (!timeString || isNaN(timeString))
            throw Error(`La hora proporcionada es inválida.`);
        if (t == "s")
            return (timeString * second);
        if (t == "m")
            return (timeString * minute);
        if (t == "h")
            return (timeString * hour);
        if (t == "d")
            return (timeString * day);
        if (t == "w")
            return (timeString * week);
        if (t == "m")
            return (timeString * month);
        if (t == "y")
            return (timeString * year);
    }
    roleMutedManager(member) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("a");
            index_1.managerError;
            try {
                const roles = member.roles.cache.map(x => x);
                yield member.roles.add(`913124108512931861`);
                const roless = [];
                for (const role of roles) {
                    roless.push(role);
                    yield member.roles.remove(role.id, "Roles quitados después de que el usuario fue muteado.");
                }
                if (member.roles.cache.map(x => x).length > 1) {
                    yield member.roles.add(`913124108512931861`);
                }
                if (member.roles.cache.map(x => x).length == 0) {
                    yield member.roles.add(`913124108512931861`);
                }
                return roless;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    createCaseNumber() {
        const one = this.childRandom();
        const two = this.childRandom();
        const three = this.childRandom();
        const four = this.childRandom();
        return `${one}-${two}-${three}-${four}`;
    }
    childRandom() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';
        var charactersLength = characters.length;
        for (var i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    addModLog(caseNumber, type, userID, moderatorID, reason, status, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, userManager_1.getDBUser)(moderatorID);
            const a = [];
            for (const log of user.modLogs) {
                a.push(log);
            }
            const log = {
                userID: userID,
                moderator: moderatorID,
                reason: reason,
                type: type,
                case: caseNumber,
                at: time,
                status: status
            };
            a.unshift(log);
            index_1.managerError;
            try {
                return User_1.userModel.findOneAndUpdate({ id: moderatorID }, { modLogs: a });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.moderationUtil = moderationUtil;
class historialManager extends moderationUtil {
    constructor(UserID, moderatorID, reason, caseNumber, time, at, caseOfDeletedWarn, guildID, reasonOfDeletedWarn, deletedWarnAt) {
        super();
        this.UserID = UserID;
        this.moderatorID = moderatorID;
        this.reason = reason;
        this.caseNumber = caseNumber;
        this.time = time;
        this.at = at;
        this.guildID = guildID;
        this.caseOfDeletedWarn = caseOfDeletedWarn;
        this.reasonOfDeletedWarn = reasonOfDeletedWarn;
        this.deletedWarnAt = deletedWarnAt;
    }
    addWarnHistorial() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.UserID)
                throw Error(`El usuario que intentas warnear es invalido.`);
            if (!this.moderatorID)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const data = yield this.getHistorial();
            const p = [];
            const caca = [];
            for (const warn of data.warns) {
                p.push(warn);
            }
            for (const action of data.all) {
                caca.push(action);
            }
            const a = {
                id: this.UserID,
                moderator: this.moderatorID,
                reason: this.reason,
                case: this.caseNumber,
                at: this.at
            };
            const caquita = {
                id: this.UserID,
                moderator: this.moderatorID,
                type: "warn",
                reason: this.reason,
                case: this.caseNumber,
                at: this.at
            };
            p.unshift(a);
            caca.unshift(caquita);
            index_1.managerError;
            try {
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.guildID }, { warns: p, all: caca });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
            return a;
        });
    }
    addMuteHistorial() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.UserID)
                throw Error(`El usuario que intentas mutear es invalido.`);
            if (!this.moderatorID)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const data = yield this.getHistorial();
            const p = [];
            const caca = [];
            for (const mute of data.mutes) {
                p.push(mute);
            }
            for (const action of data.all) {
                caca.push(action);
            }
            const a = {
                id: this.UserID,
                moderator: this.moderatorID,
                reason: this.reason,
                at: this.at,
                time: this.time,
                case: this.caseNumber
            };
            const caquita = {
                id: this.UserID,
                moderator: this.moderatorID,
                type: "mute",
                reason: this.reason,
                case: this.caseNumber,
                at: this.at
            };
            p.unshift(a);
            caca.unshift(caquita);
            index_1.managerError;
            try {
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.guildID }, { mutes: p, all: caca });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
            return a;
        });
    }
    addUnmuteHistorial() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.UserID)
                throw Error(`El usuario que intentas desmutear es invalido.`);
            if (!this.moderatorID)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const data = yield this.getHistorial();
            const p = [];
            const caca = [];
            for (const unmute of data.unmutes) {
                p.push(unmute);
            }
            for (const action of data.all) {
                caca.push(action);
            }
            const a = {
                id: this.UserID,
                moderator: this.moderatorID,
                reason: this.reason,
                at: this.at,
            };
            const caquita = {
                id: this.UserID,
                moderator: this.moderatorID,
                type: "unmute",
                reason: this.reason,
                case: this.caseNumber,
                at: this.at
            };
            p.unshift(a);
            caca.unshift(caquita);
            index_1.managerError;
            try {
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.guildID }, { unmutes: p, all: caca });
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
            return a;
        });
    }
    getHistorial() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const a = yield ModerationServer_1.historialModel.findOne({ id: this.guildID }).catch(() => { });
                if (!a) {
                    const historial = new ModerationServer_1.historialModel({
                        id: this.guildID,
                    });
                    yield historial.save();
                    return historial;
                }
                return a;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.historialManager = historialManager;
class muteManager extends moderationUtil {
    constructor(member, author, reason = "No se dio una razón", time = "15m", force = false) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.time = time;
        this.force = force;
    }
    mute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false && this.author.id !== this.member.guild.ownerId) {
                if (this.member.user.id == this.author.id)
                    throw Error(`No puedes mutearte a ti mismo.`);
                if (this.member.roles.cache.has("913124108512931861") || this.member.communicationDisabledUntilTimestamp !== null)
                    throw Error(`No puedes mutear a alguien que ya está muteado.`);
                if (this.member.roles.cache.has(`913123943072813096`))
                    throw Error(`No puedes mutear a un creador.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes mutear al dueño del servidor.`);
                if (!this.member)
                    throw Error(`El usuario que intentas mutear es invalido.`);
            }
            const data = yield (0, DBUtil_1.getUserDB)(this.member.id);
            const now = Date.now();
            const caseNumber = this.createCaseNumber();
            let muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
            if (!muteRole)
                throw Error(`He detectado una corrupción en el servidor.\nNo hay ningún rol que complete las características de un mute.\nPor favor, contacta con un administrador.`);
            var timee = this.formatTime(this.time);
            if (timee == undefined)
                throw Error(`El tiempo que ingresaste no es válido.`);
            const mutes = [];
            for (const mute of data.mutesHistory) {
                mutes.push(mute);
            }
            mutes.unshift({
                id: this.member.id,
                moderator: this.author.id,
                reason: this.reason,
                mutedAt: now,
                case: caseNumber
            });
            index_1.managerError;
            try {
                const roles = yield this.roleMutedManager(this.member);
                const a = yield new cacheManager_1.CacheModerationManager(this.member.id, this.author, this.reason, caseNumber, now).createCacheMute(this.member, timee, roles);
                yield new historialManager(this.member.id, this.author.id, this.reason, caseNumber, this.time, now, null, this.member.guild.id, null, null).addMuteHistorial();
                yield this.addModLog(caseNumber, "mute", this.member.id, this.author.id, this.reason, "activo", now);
                yield User_1.userModel.findOneAndUpdate({ id: this.member.id }, { mutesHistory: mutes });
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, caseNumber, this.time).sendMuteLog();
                return {
                    userID: this.member.id,
                    moderatorID: this.author.id,
                    highestRole: this.member.roles.highest.id,
                    reason: this.reason,
                    case: caseNumber,
                    time: timee,
                    mutedAt: now,
                    roles: this.member.roles.cache.map(r => r.id)
                };
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    unmute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.member)
                throw Error(`El usuario al que intentas desmutear no es válido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);
            const muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
            const now = Date.now();
            const caseNumber = this.createCaseNumber();
            if (this.member.communicationDisabledUntilTimestamp !== null) {
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, caseNumber).sendUnmuteLog();
                return this.member.timeout(null, `${this.author.user.tag}: ${this.reason}`);
            }
            if (this.member.roles.cache.has(muteRole.id) == false)
                throw Error(`El usuario que intentas desmutear no esta muteado.`);
            index_1.managerError;
            try {
                yield this.addModLog(caseNumber, "unmute", this.member.id, this.author.id, this.reason, "activo", now);
                yield new historialManager(this.member.id, this.author.id, this.reason, caseNumber, this.time, now, null, this.member.guild.id, null, null).addUnmuteHistorial();
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, caseNumber).sendUnmuteLog();
                const data = global.client.cache.getData("/muted");
                const mute = data.find(m => m.userID == this.member.id);
                if (!mute)
                    return this.member.roles.remove(muteRole.id);
                yield mute.roles.map(x => this.member.roles.add(x));
                this.member.roles.remove(muteRole.id);
                const filter = data.filter(m => m.userID !== this.member.id);
                index_1.db.push(`/muted`, filter);
                return {
                    id: this.member.id,
                    moderator: this.author.id,
                    reason: this.reason,
                    at: now
                };
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    automaticUnmute() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const data = global.client.cache.getData("/muted");
                const filter = data.filter(m => m.time < Date.now());
                if (!filter || filter.length < 1)
                    return;
                var a = [];
                for (const mute of filter) {
                    index_1.managerError;
                    const member = yield this.author.guild.members.cache.get(mute.userID);
                    try {
                        var b = yield new muteManager(member, this.author, this.reason, this.time).unmute();
                    }
                    catch (e) {
                        console.log(e);
                    }
                    a.push(b);
                }
                return a;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.muteManager = muteManager;
class timeoutManager extends moderationUtil {
    constructor(member, author, reason = "No hay razón", time = "15m", force = false) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.time = time;
        this.caseNumber = this.createCaseNumber();
        this.force = force;
    }
    timeout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.member)
                throw Error(`El usuario al que intentas timeout no es válido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);
            if (this.force == false) {
                if (this.member.communicationDisabledUntilTimestamp != null)
                    throw Error(`El usuario que intentas timeoutear ya esta timeouteado.`);
                if (this.member.roles.cache.has(`913124108512931861`))
                    throw Error(`El usuario que intentas hacer timeout esta silenciado. Por lo cuál no puedes hacerlo.`);
                if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                    throw Error(`No puedes timeoutear a un usuario con un rol mayor al tuyo.`);
                if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition)
                    throw Error(`El usuario que intentas timeout tiene tu mismo rango, así que no puedes hacerlo.`);
            }
            const now = Date.now();
            const timee = this.timeConvert(this.time);
            index_1.managerError;
            try {
                yield this.member.timeout(timee, `${this.author.user.tag}: ${this.reason || "Sin razón"}`);
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, this.caseNumber, this.time).sendTimeoutLog();
                return {
                    id: this.member.id,
                    moderator: this.author.id,
                    reason: this.reason,
                    case: this.caseNumber,
                    time: this.time,
                    at: now
                };
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    unTimeout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.member)
                throw Error(`El usuario al que intentas timeout no es válido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);
            if (this.force == false) {
                if (this.member.roles.cache.has(`913124108512931861`))
                    throw Error(`El usuario que intentas hacer timeout esta silenciado. Por lo cuál no puedes hacerlo.`);
                if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                    throw Error(`No puedes timeoutear a un usuario con un rol mayor al tuyo.`);
                if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition)
                    throw Error(`El usuario que intentas timeout tiene tu mismo rango, así que no puedes hacerlo.`);
            }
            const now = Date.now();
            index_1.managerError;
            try {
                yield this.member.timeout(null, `${this.author.user.tag}: ${this.reason || "Sin razón"}`);
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, this.caseNumber, this.time).sendUntimeoutLog();
                return {
                    id: this.member.id,
                    moderator: this.author.id,
                    reason: this.reason,
                    case: this.caseNumber,
                    time: this.time,
                    at: now
                };
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.timeoutManager = timeoutManager;
class warnManager extends moderationUtil {
    constructor(member, author, reason = "No se dio una razón", force = false, caseNumber) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.force = force;
        this.caseNumber = caseNumber;
    }
    warn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false && this.author.id !== this.member.guild.ownerId) {
                if (this.reason == "No se dio una razón")
                    throw Error(`La razón es obligatoria, colocala.`);
                if (this.reason.length > 300)
                    throw Error(`La razón no puede tener más de 300 caracteres.`);
                if (this.reason.length < 3)
                    throw Error(`La razón no puede tener menos de 3 caracteres.`);
                if (this.member.user.bot)
                    throw Error(`No puedes advertir a un bot.`);
                if (this.member.id == this.author.id)
                    throw Error(`No te puedes warnear a ti mismo.`);
                if (this.member.roles.cache.has(`913123943072813096`))
                    throw Error(`No puedes warnear a un creador.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes warnear al dueño del servidor.`);
            }
            if (!this.member)
                throw Error(`El usuario que intentas warnear es invalido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const caseN = yield this.createCaseNumber();
            const now = Date.now();
            index_1.managerError;
            try {
                yield this.createWarn(this.member, this.author, this.reason, caseN, now);
                yield new historialManager(this.member.id, this.author.id, this.reason, caseN, null, Date.now(), null, this.member.guild.id).addWarnHistorial();
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, caseN).logWarn();
                yield new cacheManager_1.CacheModerationManager(this.member.id, this.author, this.reason, caseN).createCacheWarn({ id: this.member.id, moderator: this.author.id, reason: this.reason, case: caseN, at: now });
                return {
                    "id": this.member.id,
                    "moderator": this.author.id,
                    "reason": this.reason,
                    "case": caseN,
                    "at": now
                };
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    delWarn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.caseNumber == false) {
                const data = yield User_1.userModel.find({}).exec();
                const user = data.find(u => u.warnsHistory.find(w => w.case == this.caseNumber));
                if (!user)
                    throw Error(`El caso que intentas eliminar no existe.`);
                const member = yield this.author.guild.members.cache.get(user.id);
                if (!this.force) {
                    if (member.id == this.author.id)
                        throw Error(`No puedes borrar tus propios warns.`);
                    if (member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                        throw Error(`No puedes borrar un warn de un usuario que tiene un rol mayor que tú.`);
                    if (member.roles.highest.rawPosition == this.author.roles.highest.rawPosition)
                        throw Error(`No puedes borrar un warn de un usuario que tiene el mismo rol que tú.`);
                }
                if (!user)
                    throw Error(`El caso que intentas borrar no existe.`);
                const warn = user.warnsHistory.find(w => w.case == this.caseNumber);
                if (!warn)
                    throw Error(`El warn que intentas borrar no existe. Intenta poniendo otro warn.`);
                index_1.managerError;
                try {
                    const deletedData = yield this.deleteWarnDB(warn.id, this.author.id, warn.case, this.reason || null);
                    new loggerManager_1.moderationBotLogs(member, this.author, this.reason, deletedData.case, null, deletedData.caseOfDeletedWarn).sendWarnDeleteLog();
                    return deletedData;
                }
                catch (error) {
                    index_1.sentry.captureException(error);
                }
                finally {
                    index_1.managerError.finish();
                }
            }
            else if (!this.caseNumber) {
                throw Error(`El caso de warn que has puesto no existe.`);
            }
        });
    }
    delwarns() {
        return __awaiter(this, void 0, void 0, function* () {
            const userDB = yield (0, DBUtil_1.getUserDB)(this.member.id);
            const modDB = yield (0, DBUtil_1.getUserDB)(this.author.id);
            const cache = yield new cacheManager_1.CacheManager(this.author.client).get();
            if (this.force == false) {
                if (this.author.id == this.member.id)
                    throw Error(`No puedes borrar tus propios warns.`);
                if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                    throw Error(`No puedes borrar los warns de un usuario que tiene roles mayores que tú.`);
                if (this.author.roles.highest.rawPosition == this.member.roles.highest.rawPosition)
                    throw Error(`No puedes borrar los warns de un usuario que tiene los mismos roles que tú.`);
                if (this.member.roles.cache.has(`913123943072813096`))
                    throw Error(`Los creadores no tienen warns.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes borrar los warns de un usuario que es el dueño del servidor.`);
                if (userDB.warnsHistory[0] == undefined)
                    throw Error(`El usuario no tiene warns para borrar.`);
            }
            if (!this.member)
                throw Error(`El usuario que intentas borrar los warns es invalido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);
            const caseNumber = this.createCaseNumber();
            const now = Date.now();
            const historial = yield new historialManager(null, this.author.id, null, caseNumber, null, now, null, this.member.guild.id, null, null).getHistorial();
            const deletewarn = [];
            const deleted = historial.warnsDelete || null;
            for (let deleteWarn of deleted) {
                deletewarn.push(deleteWarn);
            }
            for (let warn of userDB.warnsHistory) {
                deletewarn.push({
                    case: caseNumber,
                    caseOfDeletedWarn: warn.case,
                    at: now,
                    deletedWarnAt: warn.at,
                    moderator: this.author.id,
                    moderatorOfDeletedWarn: warn.moderator,
                    reason: this.reason,
                    reasonOfDeletedWarn: warn.reason,
                    id: warn.id
                });
            }
            const filter = modDB.modLogs.filter(x => x.userID == this.member.id);
            const filter2 = modDB.modLogs.filter(x => x.userID !== this.member.id);
            const filter3 = cache.warns.filter(x => x.id !== this.member.id);
            const modLogs = [];
            for (let modlog of filter2) {
                modLogs.push(modlog);
            }
            for (let modlog of filter) {
                modLogs.push({
                    at: modlog.at,
                    moderator: modlog.moderator,
                    reason: modlog.reason,
                    status: "borrada",
                    type: "warn",
                    userID: modlog.userID
                });
            }
            const a = {
                caseNumber: caseNumber,
                moderatorID: this.author.id,
                deletedWarns: userDB.warnsHistory
            };
            index_1.managerError;
            try {
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, a.caseNumber, null).sendWarnsDeleteLog(userDB.warnsHistory);
                yield User_1.userModel.findOneAndUpdate({ id: this.member.id }, { warnsHistory: [], warns: 0 });
                yield User_1.userModel.findOneAndUpdate({ id: this.author.id }, { modLogs: modLogs });
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.member.guild.id }, { warnsDelete: deletewarn });
                index_1.db.push("/warns", filter3);
                return a;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    automaticWarnDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield new cacheManager_1.CacheManager(this.author.client).get();
            const filter = cache.warns.filter(x => x.expiration <= Date.now());
            if (!filter[0])
                return "No hay warns detectados para borrar";
            const w = yield this.bulkWarnDelete(filter);
            const a = {
                caseNumber: w[0].case,
                moderatorID: this.author.id,
                deletedWarns: w
            };
        });
    }
    bulkWarnDelete(cachedWarnsToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.managerError;
            try {
                const cache = yield new cacheManager_1.CacheManager(this.author.client).get();
                const filter = cache.warns.filter(x => cachedWarnsToDelete.find(y => y.id == x.id).case !== x.case);
                const caseN = this.createCaseNumber();
                for (const cacheWarn of cachedWarnsToDelete) {
                    const userDB = yield (0, DBUtil_1.getUserDB)(cacheWarn.id);
                    const warn = userDB.warnsHistory.find(x => x.case == cacheWarn.case);
                    const modDB = yield (0, DBUtil_1.getUserDB)(warn.moderator);
                    const filter = userDB.warnsHistory.filter(x => x.case !== cacheWarn.case);
                    const fi = modDB.modLogs.filter(x => x.at !== warn.at && x.moderator !== warn.moderator);
                    const modLog = modDB.modLogs.find(x => x.at == warn.at && x.moderator == warn.moderator && x.reason == warn.reason && x.type == "warn");
                    const modLogs = [];
                    for (let modlog of fi) {
                        modLogs.push(modlog);
                    }
                    modLogs.unshift({
                        at: modLog.at,
                        moderator: modLog.moderator,
                        reason: modLog.reason,
                        status: "borrada",
                        type: "warn",
                        userID: modLog.userID
                    });
                    const historial = yield new historialManager(null, this.author.id, null, caseN, null, Date.now(), null, this.author.guild.id, null, null).getHistorial();
                    const deletewarn = [];
                    for (let deleteWarn of historial.warnsDelete) {
                        deletewarn.push(deleteWarn);
                    }
                    var a = {
                        case: caseN,
                        caseOfDeletedWarn: warn.case,
                        at: Date.now(),
                        deletedWarnAt: warn.at,
                        moderator: this.author.id,
                        moderatorOfDeletedWarn: warn.moderator,
                        reason: this.reason,
                        reasonOfDeletedWarn: warn.reason,
                        id: warn.id
                    };
                    var b = [];
                    deletewarn.unshift({
                        case: caseN,
                        caseOfDeletedWarn: warn.case,
                        at: Date.now(),
                        deletedWarnAt: warn.at,
                        moderator: this.author.id,
                        moderatorOfDeletedWarn: warn.moderator,
                        reason: this.reason,
                        reasonOfDeletedWarn: warn.reason,
                        id: warn.id
                    });
                    b.push(a);
                    yield User_1.userModel.findOneAndUpdate({ id: cacheWarn.id }, { warnsHistory: filter, warns: filter.length });
                    yield User_1.userModel.findOneAndUpdate({ id: warn.moderator }, { modLogs: modLogs });
                    yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.author.guild.id }, { warnsDelete: deletewarn });
                    yield new loggerManager_1.moderationBotLogs(this.author.guild.members.cache.get(cacheWarn.id), this.author, `Automoderador, eliminados warns con más de 7 días de existencia.`, caseN, null, warn.case).sendWarnDeleteLog();
                }
                return b;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.warnManager = warnManager;
class kickManager extends moderationUtil {
    constructor(member, author, reason = "Sin razón", force = false) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.force = force;
        this.case = this.createCaseNumber();
    }
    kick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false) {
                if (!this.member)
                    throw Error(`El miembro es invalido`);
                if (this.member.id == this.author.id)
                    throw Error(`No puedes expulsarte a ti mismo`);
                if (this.member.roles.cache.has(`913123943072813096`))
                    throw Error(`No puedes expulsar a un creador`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No se puede expulsar al creador del servidor`);
            }
            const now = Date.now();
            const data = yield (0, userManager_1.getDBUser)(this.member.id);
            const modlog = yield this.addModLog(this.case, "kick", this.member.id, this.author.id, this.reason || "Sin razón", "activo", now);
            const historial = yield new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();
            const kick = {
                id: this.member.id,
                at: now,
                moderator: this.author.id,
                reason: this.reason,
                case: this.case
            };
            const global = {
                id: this.member.id,
                at: now,
                moderator: this.author.id,
                reason: this.reason,
                case: this.case,
                type: "kick"
            };
            const a = [];
            const b = [];
            for (const q of historial.kicks) {
                a.push(q);
            }
            for (const q of historial.all) {
                b.push(q);
            }
            b.unshift(global);
            a.unshift(kick);
            index_1.managerError;
            try {
                yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason || `Sin razón`, this.case).sendKickLog();
                yield this.member.kick(this.reason);
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.member.guild.id }, { kicks: a, all: b });
                yield User_1.userModel.findOneAndUpdate({ id: this.member.id }, { kicks: data.kicks + 1 });
                return kick;
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.kickManager = kickManager;
class banManager extends moderationUtil {
    constructor(member, moderator, reason = "Sin razón", force = false) {
        super();
        this.member = member;
        this.moderator = moderator;
        this.reason = reason;
        this.force = force;
        this.case = this.createCaseNumber();
    }
    ban(time = null, days = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!time) {
                const userdb = yield (0, userManager_1.getDBUser)(this.member.id);
                const moddb = yield (0, userManager_1.getDBUser)(this.moderator.id);
                const cache = yield this.moderator.client.cache;
                if (this.force == false) {
                    if (!this.member)
                        throw Error(`El miembro es invalido`);
                    if (this.member.id == this.moderator.id)
                        throw Error(`No te puedes banear a ti mismo`);
                    if (this.member.roles.cache.has(`913123943072813096`))
                        throw Error(`No puedes banear a un creador`);
                    if (this.member.id == this.member.guild.ownerId)
                        throw Error(`No se puede banear al creador del servidor`);
                    if (days > 7)
                        throw Error(`El tiempo de eliminación de mensajes no puede ser mayor a 7.`);
                    if (days < 0)
                        throw Error(`El tiempo de eliminación de mensajes no puede ser menor a 0.`);
                }
                const now = Date.now();
                const modlogs = yield this.addModLog(this.case, "ban", this.member.id, this.moderator.id, this.reason || "Sin razón", "activo", now);
                const historial = yield new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();
                const ban = {
                    id: this.member.id,
                    at: now,
                    moderator: this.moderator.id,
                    reason: this.reason,
                    case: this.case
                };
                const global = {
                    id: this.member.id,
                    at: now,
                    moderator: this.moderator.id,
                    reason: this.reason,
                    case: this.case,
                    type: "ban"
                };
                const a = [];
                const b = [];
                const d = [];
                for (const q of historial.bans) {
                    a.push(q);
                }
                for (const q of historial.all) {
                    b.push(q);
                }
                for (const ban of cache.bans) {
                    d.push(ban);
                }
                b.unshift(global);
                d.unshift(ban);
                a.unshift(ban);
                index_1.managerError;
                try {
                    yield new loggerManager_1.moderationBotLogs(this.member, this.moderator, this.reason || `Sin razón`, this.case).sendBanLog();
                    yield this.member.ban({ reason: this.reason, days: days });
                    yield index_1.db.push("/bans", d);
                    yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.member.guild.id }, { bans: a, all: b });
                    yield User_1.userModel.findOneAndUpdate({ id: this.member.id }, { bans: userdb.bans + 1 });
                    return ban;
                }
                catch (error) {
                    index_1.sentry.captureException(error);
                }
                finally {
                    index_1.managerError.finish();
                }
            }
            else {
                const userdb = yield (0, userManager_1.getDBUser)(this.member.id);
                const moddb = yield (0, userManager_1.getDBUser)(this.moderator.id);
                const cache = this.moderator.client.cache;
                if (this.force == false) {
                    if (!this.member)
                        throw Error(`El miembro es invalido`);
                    if (this.member.id == this.moderator.id)
                        throw Error(`No te puedes banear a ti mismo`);
                    if (this.member.roles.cache.has(`913123943072813096`))
                        throw Error(`No puedes banear a un creador`);
                    if (this.member.id == this.member.guild.ownerId)
                        throw Error(`No se puede banear al creador del servidor`);
                    if (days > 7)
                        throw Error(`El tiempo de eliminación de mensajes no puede ser mayor a 7.`);
                    if (days < 0)
                        throw Error(`El tiempo de eliminación de mensajes no puede ser menor a 0.`);
                }
                const now = Date.now();
                const modlogs = yield this.addModLog(this.case, "ban", this.member.id, this.moderator.id, this.reason || "Sin razón", "activo", now);
                const historial = yield new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();
                const timee = this.formatTime(time);
                const ban = {
                    id: this.member.id,
                    at: now,
                    moderator: this.moderator.id,
                    reason: this.reason,
                    case: this.case,
                    time: timee
                };
                const global = {
                    id: this.member.id,
                    at: now,
                    moderator: this.moderator.id,
                    reason: this.reason,
                    case: this.case,
                    type: "ban"
                };
                const a = [];
                const b = [];
                const d = [];
                for (const q of historial.bans) {
                    a.push(q);
                }
                for (const q of historial.all) {
                    b.push(q);
                }
                for (const ban of cache.bans) {
                    d.push(ban);
                }
                d.unshift(ban);
                b.unshift(global);
                a.unshift(ban);
                index_1.managerError;
                try {
                    yield new loggerManager_1.moderationBotLogs(this.member, this.moderator, this.reason, this.case, (0, globals_1.Translatetime)(time)).sendBanLog();
                    yield this.member.ban({ reason: this.reason, days: days });
                    yield index_1.db.push("/bans", d);
                    yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.member.guild.id }, { bans: a, all: b });
                    yield User_1.userModel.findOneAndUpdate({ id: this.member.id }, { bans: userdb.bans + 1 });
                    yield new cacheManager_1.CacheModerationManager(this.member.id, this.moderator, this.reason, this.case, now).createCacheBan(this.member, timee);
                    return ban;
                }
                catch (error) {
                    index_1.sentry.captureException(error);
                }
                finally {
                    index_1.managerError.finish();
                }
            }
        });
    }
    unban(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.moderator.guild.bans.fetch();
            if (this.force == false) {
                if ((yield (yield this.moderator.client.users.fetch(userID, { force: true }))) == undefined)
                    throw Error(`El usuario que has especificado no existe.`);
                var userData = yield this.moderator.client.users.fetch(userID, { force: true });
                if (this.moderator.guild.members.cache.get(userID) !== undefined)
                    throw Error(`No puedes desbanear a un usuario que ya se encuentra en el servidor.`);
                if (userData.id == this.moderator.id)
                    throw Error(`No puedes desbanearte a ti mismo tonto.`);
            }
            const ban = yield (yield this.moderator.guild.bans.fetch()).find(x => x.user.id == userData.id);
            if (!ban)
                throw Error(`El usuario que has especificado no esta baneado.`);
            const now = Date.now();
            const cache = new cacheManager_1.CacheManager(this.moderator.client).get();
            const history = yield new historialManager(null, userData.id, null, this.case, null, now, null, this.moderator.guild.id, null, null).getHistorial();
            const filtered = cache.bans.filter(x => x.id !== userData.id);
            const a = [];
            for (const q of history.all) {
                a.push(q);
            }
            a.unshift({
                id: userData.id,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                type: "unban"
            });
            index_1.managerError;
            try {
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.moderator.guild.id }, { all: a });
                index_1.db.push("/bans", filtered);
                yield new loggerManager_1.moderationBotLogs(null, this.moderator, this.reason, this.case).sendUnbanLog(userData);
                yield this.moderator.guild.members.unban(userData, `${this.moderator.user.tag}: ${this.reason}`);
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    automaticUnban() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = new cacheManager_1.CacheManager(this.moderator.client).get();
            const filter = yield cache.bans.filter(x => x.time <= Date.now());
            const filter2 = yield cache.bans.filter(x => x.time > Date.now());
            if (!filter || filter[0] == undefined)
                return;
            index_1.db.push("/bans", filter2);
            for (const ban of filter) {
                yield this.moderator.guild.members.unban(ban.id, this.reason);
                const history = yield new historialManager(null, ban.id, null, this.case, null, Date.now(), null, this.moderator.guild.id, null, null).getHistorial();
                const a = [];
                for (const q of history.all) {
                    a.push(q);
                }
                a.unshift({
                    id: ban.id,
                    at: Date.now(),
                    moderator: this.moderator.id,
                    reason: this.reason,
                    case: this.case,
                    type: "unban"
                });
                index_1.managerError;
                try {
                    yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.moderator.guild.id }, { all: a });
                }
                catch (error) {
                    index_1.sentry.captureException(error);
                }
                finally {
                    index_1.managerError.finish();
                }
            }
            index_1.managerError;
            try {
            }
            catch (error) {
                index_1.sentry.captureException(error);
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
    softban(userID, days) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false) {
                if (!this.member)
                    throw Error(`El usuario que has puesto no existe.`);
                if (!this.moderator)
                    throw Error(`He detectado una corrupción de tipo __PPP_USER_AUTHOR_MEMBER_ por favor contecta con mi desarrollador para informar de este error.`);
                if (this.member.roles.cache.has(`913123943072813096`))
                    throw Error(`No puedes softbanear a un usuario que es creador del servidor.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes softbanear a un usuario que es el dueño del servidor.`);
                if (this.member.id == this.moderator.id)
                    throw Error(`No puedes softbanear a ti mismo tonto.`);
            }
            const history = yield new historialManager(null, userID, null, this.case, null, Date.now(), null, this.moderator.guild.id, null, null).getHistorial();
            const now = Date.now();
            const ban = {
                id: userID,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
            };
            const unban = {
                id: userID,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                type: "unban",
                at: now
            };
            const bann = {
                id: userID,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                type: "ban"
            };
            const a = [];
            const b = [];
            for (const q of history.all) {
                a.push(q);
            }
            for (const q of history.bans) {
                b.push(q);
            }
            a.unshift(bann, unban);
            b.unshift(ban);
            index_1.managerError;
            try {
                yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.moderator.guild.id }, { all: a, bans: b });
                yield new loggerManager_1.moderationBotLogs(this.member, this.moderator, this.reason, this.case).sendSoftBanLog();
                yield this.moderator.guild.members.ban(userID, { days: days, reason: `${this.moderator.user.tag}: ${this.reason}` });
                yield this.moderator.guild.members.unban(userID, `${this.moderator.user.tag}: ${(_a = this.reason) !== null && _a !== void 0 ? _a : "Sin razón"}`);
                return ban;
            }
            catch (e) {
                index_1.sentry.captureException;
            }
            finally {
                index_1.managerError.finish();
            }
        });
    }
}
exports.banManager = banManager;
