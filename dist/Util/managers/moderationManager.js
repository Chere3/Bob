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
exports.deleteWarnDB = exports.createWarn = exports.addModLog = exports.childRandom = exports.createCaseNumber = exports.cachedMutedUsers = exports.roleMutedManager = exports.formatTime = exports.historialManager = exports.warnManager = exports.muteManager = void 0;
const index_1 = require("../../index");
const userManager_1 = require("./userManager");
const User_1 = require("../../Database/schemas/User");
const loggerManager_1 = require("./loggerManager");
const ModerationServer_1 = require("../../Database/schemas/ModerationServer");
class muteManager {
    constructor(member, author, reason = "No se dio una razón", time = "15m", force = false) {
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.time = time;
        this.force = force;
    }
    mute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false) {
                if (this.member.user.id == this.author.id)
                    throw Error(`No puedes mutearte a ti mismo.`);
                if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                    throw Error(`No puedes mutear a alguien que tiene un rol mayor que tú.`);
                if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition)
                    throw Error(`No puedes mutear a alguien que tiene el mismo rol que tú.`);
                if (this.member.roles.cache.get("739058686549058688") != undefined)
                    throw Error(`No puedes mutear a alguien que ya está muteado.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes mutear al dueño del servidor.`);
                if (!this.member)
                    throw Error(`El usuario que intentas mutear es invalido.`);
            }
            const now = Date.now();
            let muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
            if (!muteRole)
                throw Error(`He detectado una corrupción en el servidor.\nNo hay ningún rol que complete las características de un mute.\nPor favor, contacta con un administrador.`);
            var timee = formatTime(this.time);
            if (timee == undefined)
                throw Error(`El tiempo que ingresaste no es válido.`);
            const a = yield cachedMutedUsers(this.member, this.author, this.reason, timee);
            yield roleMutedManager(this.member);
            const caseNumber = createCaseNumber();
            yield addModLog(caseNumber, "mute", this.member.id, this.author.id, this.reason, "activo", now);
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
        });
    }
    unmute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.member)
                throw Error(`El usuario al que intentas desmutear no es válido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
            const now = Date.now();
            if (!this.member.roles.cache.has(muteRole.id))
                throw Error(`El usuario que intentas desmutear no esta muteado.`);
            const caseNumber = createCaseNumber();
            yield addModLog(caseNumber, "unmute", this.member.id, this.author.id, this.reason, "activo", now);
            const data = index_1.db.getData("/muted");
            const mute = data.find(m => m.userID == this.member.id);
            if (!mute)
                return this.member.roles.remove(muteRole.id);
            yield mute.roles.map(x => this.member.roles.add(x));
            this.member.roles.remove(muteRole.id);
            const filter = data.filter(m => m.userID !== this.member.id);
            index_1.db.push(`/muted`, filter);
            return {
                userID: this.member.id,
                moderatorID: this.author.id,
                reason: this.reason,
                unmutedAt: now
            };
        });
    }
    automaticUnmute() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = index_1.db.getData("/muted");
            const filter = data.filter(m => m.time < Date.now());
            if (!filter || filter.length < 1)
                return;
            var a = [];
            for (const mute of filter) {
                const member = yield this.author.guild.members.cache.get(mute.userID);
                const b = yield new muteManager(member, this.author, this.reason, this.time).unmute();
                a.push(b);
            }
            return a;
        });
    }
}
exports.muteManager = muteManager;
class warnManager {
    constructor(member, author, reason = "No se dio una razón", force = false, caseNumber) {
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.force = force;
        this.caseNumber = caseNumber;
    }
    warn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.force == false) {
                if (this.reason == "No se dio una razón")
                    throw Error(`La razón es obligatoria, colocala.`);
                if (this.reason.length > 300)
                    throw Error(`La razón no puede tener más de 300 caracteres.`);
                if (this.reason.length < 3)
                    throw Error(`La razón no puede tener menos de 3 caracteres.`);
                if (this.member.id == this.author.id)
                    throw Error(`No te puedes warnear a ti mismo.`);
                if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition)
                    throw Error(`No puedes warnear a alguien que tiene un rol mayor que tú.`);
                if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition)
                    throw Error(`No puedes warnear a alguien que tiene el mismo rol que tú.`);
                if (this.member.id == this.member.guild.ownerId)
                    throw Error(`No puedes warnear al dueño del servidor.`);
            }
            if (!this.member)
                throw Error(`El usuario que intentas warnear es invalido.`);
            if (!this.author)
                throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);
            const caseN = yield createCaseNumber();
            const now = Date.now();
            yield createWarn(this.member, this.author, this.reason, caseN, now);
            yield new historialManager(this.member.id, this.author.id, this.reason, caseN, null, Date.now(), null, this.member.guild.id).addWarnHistorial();
            yield new loggerManager_1.moderationBotLogs(this.member, this.author, this.reason, caseN).logWarn();
            return {
                "id": this.member.id,
                "moderator": this.author.id,
                "reason": this.reason,
                "case": caseN,
                "warnedAt": now
            };
        });
    }
    delWarn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.member && this.caseNumber) {
                const data = yield User_1.userModel.find({}).exec();
                const user = data.find(u => u.warnsHistory.find(w => w.case == this.caseNumber));
                if (!user)
                    throw Error(`El caso que intentas borrar no existe.`);
                const warn = user.warnsHistory.find(w => w.case == this.caseNumber);
            }
        });
    }
}
exports.warnManager = warnManager;
class historialManager {
    constructor(UserID, moderatorID, reason, caseNumber, time, at, caseOfDeletedWarn, guildID, reasonOfDeletedWarn, deletedWarnAt) {
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
            for (const warn of data.warns) {
                p.push(warn);
            }
            const a = {
                id: this.UserID,
                moderator: this.moderatorID,
                reason: this.reason,
                case: this.caseNumber,
                warnedAt: this.at
            };
            p.unshift(a);
            yield ModerationServer_1.historialModel.findOneAndUpdate({ id: this.guildID }, { warns: p });
            return a;
        });
    }
    getHistorial() {
        return __awaiter(this, void 0, void 0, function* () {
            const a = yield ModerationServer_1.historialModel.findOne({ id: this.guildID }).catch(() => { });
            if (!a) {
                const historial = new ModerationServer_1.historialModel({
                    id: this.guildID,
                });
                yield historial.save();
                return historial;
            }
            return a;
        });
    }
}
exports.historialManager = historialManager;
function formatTime(time) {
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
exports.formatTime = formatTime;
function roleMutedManager(member) {
    const roles = member.roles.cache.map(x => { member.roles.remove(x.id); });
    const muteado = member.guild.roles.cache.find(r => r.name == "Silenciado");
    member.roles.add(muteado.id);
}
exports.roleMutedManager = roleMutedManager;
function cachedMutedUsers(member, moderator, reason, time) {
    return __awaiter(this, void 0, void 0, function* () {
        var a = [];
        var b = [];
        const roles = member.roles.cache.map(x => x);
        var data = index_1.db.getData("/muted");
        for (const mute of data) {
            b.push(mute);
        }
        for (const role of roles) {
            a.push(role.id);
        }
        const mute = {
            userID: member.id,
            moderatorID: moderator.id,
            highestRole: member.roles.highest.id,
            reason: reason,
            time: time,
            mutedAt: Date.now(),
            roles: a
        };
        b.unshift(mute);
        return index_1.db.push(`/muted`, b);
    });
}
exports.cachedMutedUsers = cachedMutedUsers;
function createCaseNumber() {
    const one = childRandom();
    const two = childRandom();
    const three = childRandom();
    const four = childRandom();
    return `${one}-${two}-${three}-${four}`;
}
exports.createCaseNumber = createCaseNumber;
function childRandom() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
exports.childRandom = childRandom;
function addModLog(caseNumber, type, userID, moderatorID, reason, status, time) {
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
        return User_1.userModel.findOneAndUpdate({ id: moderatorID }, { modLogs: a });
    });
}
exports.addModLog = addModLog;
function createWarn(member, moderator, reason, caseN, now) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, userManager_1.getDBUser)(member.id);
        const warn = {
            id: member.id,
            moderator: moderator.id,
            reason: reason,
            case: caseN,
            warnedAt: now,
        };
        const quantity = user.warns + 1;
        var b = [];
        for (const warn of user.warnsHistory) {
            b.push(warn);
        }
        b.unshift(warn);
        yield addModLog(caseN, "warn", member.id, moderator.id, reason, "activo", now);
        return User_1.userModel.findOneAndUpdate({ id: member.id }, { warns: quantity, warnsHistory: b });
    });
}
exports.createWarn = createWarn;
function deleteWarnDB(memberID, moderatorID, caseNumber, reason, guildID) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        const dataUser = yield (0, userManager_1.getDBUser)(memberID);
        const dataMod = yield (0, userManager_1.getDBUser)(moderatorID);
        const dataHistorial = yield new historialManager(null, null, null, null, null, null, null, guildID).getHistorial();
        const warn = dataUser.warnsHistory.find(x => x.case == caseNumber);
        const action = {
            userWarned: dataUser.id,
            moderatorID: moderatorID,
            reason: reason,
            case: caseNumber,
            deletedAt: now,
            caseOfDeletedWarn: warn.case,
            reasonOfDeletedWarn: warn.reason,
            deletedWarnAt: warn.warnedAt,
            moderatorOfDeletedWarn: warn.moderator
        };
        const a = [];
        const b = [];
        const c = [];
        const filter = dataUser.warnsHistory.filter(x => x.case != caseNumber);
        if (!filter[0])
            throw new Error("No se encontro el warn");
        const modlog = dataMod.modLogs.find(x => x.at == warn.warnedAt && x.type == "warn" && x.moderator == moderatorID);
        if (!modlog)
            throw new Error("No se encontro el modlog");
        const filter2 = dataMod.modLogs.filter(x => x.at !== warn.warnedAt && x.type !== "warn" && x.moderator !== moderatorID);
        if (!filter2[0])
            throw new Error("No se encontro el modlog");
        for (const warn of filter) {
            a.push(warn);
        }
    });
}
exports.deleteWarnDB = deleteWarnDB;
