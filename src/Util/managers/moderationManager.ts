import { User, GuildMember, Client, Role } from 'discord.js';
import { db, managerError, sentry } from '../../index';
import { muted, unmuteAction, modActions, deleteWarnAction, deleteWarnsAction, globalAction, muteAction, timeoutAction, kickAction, ban } from '../constants/moderationDataManager';
import { getDBUser } from './userManager';
import { DBUser, warn, userModel, modLog, mute } from '../../Database/schemas/User';
import { moderationBotLogs } from './loggerManager';
import { historialModel, historial } from '../../Database/schemas/ModerationServer';
import { getUserDB } from '../Functions/utils/DBUtil';
import { CacheModerationManager, CacheManager } from './cacheManager';
import { cachedWarn } from '../constants/cache';
import { Translatetime } from '../constants/globals';




export class moderationUtil {
    constructor() {
    }

/**
 * @method deleteWarnDB - Deletes a warn from the database
 * @param {GuildMember} member - The member to delete the warn
 * @param {GuildMember} moderator - The moderator who deleted the warn
 * @param {string} case - The warn case to delete case.
 * @param {string} reason - The reason to delete the warn
 * @todo Updates the db to delete the warn, the moderator db, the member db, the server history, and modlogs
 */

     async deleteWarnDB(memberID: string, moderatorID: string, caseNumber: string, reason: string = "No se puso una razón.", guildID: string = "912858763126538281") {
        const now = Date.now();
        const dataUser = await getDBUser(memberID);
        const dataMod = await getDBUser(moderatorID);
        const cache = db.getData("/warns") as cachedWarn[];
        const dataHistorial = await new historialManager(null, null, null, null, null, null, null, guildID).getHistorial();
    
        const warn = dataUser.warnsHistory.find(x => x.case == caseNumber);
        const caseN = await this.createCaseNumber();
        if (!warn) throw new Error("El warn que has especificado no existe.");
    
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
        } as deleteWarnAction;
    
        const a = [];
        const b = [];
        const c = [];
        const filter = dataUser.warnsHistory.filter(x => x.case != caseNumber);
        const cachefilter = cache.filter(x => x.case !== caseNumber);
    
        const modlog = dataMod.modLogs.find(x => x.moderator == moderatorID && (warn.at - x.at) <= 1000);
        if (!modlog) throw new Error("No se encontro el modlog");
        const filter2 = dataMod.modLogs.filter(x => x.moderator == warn.moderator && warn.at == x.at && x.type == "warn");
    
        for (const warn of filter) {
            a.push(warn);
        }
    
        for (const warn of filter2) {
            b.push(warn);
        }
    
        const deletedWarns = dataHistorial.warnsDelete || []
    
    
        b.unshift({
            "userID": modlog.userID,
            "moderator": modlog.moderator,
            "reason": modlog.reason,
            "status": "borrada",
            "type": "warn",
            "at": modlog.at,
        })
    
        for (const warn of deletedWarns) {
            c.push(warn);
        }
    
        c.unshift(action);
    
        managerError
        try {
        await userModel.findOneAndUpdate({ id: memberID }, { warnsHistory: a, warns: Number(a.length) || 0});
        await userModel.findOneAndUpdate({ id: moderatorID }, { modLogs: b });
        await historialModel.findOneAndUpdate({ id: guildID }, { warnsDelete: c });
        await db.push("/warns", cachefilter);
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
    
        return action;
    }

    /**
 * @method createWarn - Creates a warn in the database
 * @param {Member} member - The member to warn
 * @param {Member} moderator - The moderator who warned the user
 * @param {string} reason - The reason for the warn
 * @returns {Promise<void>} - The data of the warn.
 * @todo - Add a function to create a warn
 */

 async createWarn(member: GuildMember, moderator: GuildMember, reason: string, caseN: string, now: number) {
    const user = await getDBUser(member.id);

    const warn = {
        id: member.id,
        moderator: moderator.id,
        reason: reason,
        case: caseN,
        at: now,
    } as warn

    const quantity = user.warns + 1;

    var b = [];	
    
    for (const warn of user.warnsHistory) {
        b.push(warn)
    }

    b.unshift(warn);

    managerError;
    try {
    await this.addModLog(caseN, "warn", member.id, moderator.id, reason, "activo", now);

    return userModel.findOneAndUpdate({ id: member.id }, { warns: quantity, warnsHistory: b });
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }
}

/**
 * @function formatTime - Formats a time string to a timestamp with the end of the mute
 * @param {string} time - The time to format
 * @returns {number} - The timestamp of the end of the mute
 */

 formatTime(time: string) {
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

    // separate the time string in array for each character
    for (var i = 0; i < time.length; i++) {
        time2 = time.split("");
    }

    // get the time unit
    for (var i = 0; i < time2.length; i++) {
        if (times.includes(time2[i])) {
            t = time2[i];
        }
    }

    // if the time unit is not a valid one, throw an error
    if (!t) throw Error(`El formato de la hora es invalido.`);

   // extract only numbers of time
    for (var i = 0; i < time.length; i++) {
        if (time[i] == t) {
            timeString = time.substring(0, i);
        }
    }


    timeString = Number(timeString);

    if (!timeString || isNaN(timeString)) throw TypeError(`La hora proporcionada es inválida.`);
  

    if (t == "s") return Date.now() + (timeString * second);
    if (t == "m") return Date.now() + (timeString * minute);
    if (t == "h") return Date.now() + (timeString * hour);
    if (t == "d") return Date.now() + (timeString * day);
    if (t == "w") return Date.now() + (timeString * week);
    if (t == "m") return Date.now() + (timeString * month);
    if (t == "y") return Date.now() + (timeString * year);
}

/**
 * @function timeConvert - Converts the time to a timestamp
 * @param {string} time - The time to convert
 */

timeConvert(time: string) {
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

    // separate the time string in array for each character
    for (var i = 0; i < time.length; i++) {
        time2 = time.split("");
    }

    // get the time unit
    for (var i = 0; i < time2.length; i++) {
        if (times.includes(time2[i])) {
            t = time2[i];
        }
    }

    // if the time unit is not a valid one, throw an error
    if (!t) throw Error(`El formato de la hora es invalido.`);

   // extract only numbers of time
    for (var i = 0; i < time.length; i++) {
        if (time[i] == t) {
            timeString = time.substring(0, i);
        }
    }


    timeString = Number(timeString);

    if (!timeString || isNaN(timeString)) throw Error(`La hora proporcionada es inválida.`);
  

    if (t == "s") return (timeString * second);
    if (t == "m") return (timeString * minute);
    if (t == "h") return (timeString * hour);
    if (t == "d") return (timeString * day);
    if (t == "w") return (timeString * week);
    if (t == "m") return (timeString * month);
    if (t == "y") return (timeString * year);
}

/**
 * @function roleMutedManager - Manages the roles of the muted users
 * @param {Member} member - The member to manage
 * @returns {Promise<void>} - The data of the mute.
 * @todo - Add a function to remove the role of the muted user
 */

roleMutedManager(member: GuildMember) {
    managerError;
    try {
    const roles = member.roles.cache.map(x => x);


    const roless = [];
    for (const role of roles) {
        roless.push(role)
        member.roles.remove(role.id);
    }

    const muteado = member.guild.roles.cache.find(r => r.name == "Silenciado");
    member.roles.add(muteado.id);

    return roless as Role[];
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }
}





/**
 * @function createCaseNumer - Creates a case number
 * @returns {number} - The case number
 * @todo - Add a function to create a case number
 */

createCaseNumber() {
   
    const one = this.childRandom();
    const two = this.childRandom();
    const three = this.childRandom();
    const four = this.childRandom();

    return `${one}-${two}-${three}-${four}`;

    
}

/**
 * @function chileRandom - Returns a child random code
 * @returns {string} - The child random code
 */

childRandom() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }

   return result;
}

/**
 * @function addModLog - Adds a mod log
 * @param {string} caseNumber - The case number
 * @param {string} type - The type of the log
 * @param {string} userID - The user ID
 * @param {string} moderatorID - The moderator ID
 * @param {string} reason - The reason for the log
 * @returns {Promise<void>} - The data of the log.
 */

async addModLog(caseNumber: string, type: "ban" | "warn" | "mute" | "unmute" | "kick", userID: string, moderatorID: string, reason: string, status: "activo" | "borrada", time: number) {
    const user = await getDBUser(moderatorID);


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
    } as modLog;

    a.unshift(log);

    managerError
    try {
    return userModel.findOneAndUpdate({ id: moderatorID }, {modLogs: a});
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }
}

}





//////////////////////////////////////////////////// END OF UTILS ////////////////////////////////////////////////////


/**
 * @class historialManager - Manages the historial of the server
 * @param {string} UserID - The ID of the user
 * @param {string} moderatorID - The ID of the moderator
 * @param {string} reason - The reason for the action
 * @param {string} caseNumber - The case number
 * @param {string} time - The time of the action
 * @param {number} at - The time at executed the action
 * 
 * @param {string} caseOfDeletedWarn - The case of the deleted warning
 * @param {string} reasonOfDeletedWarn - The reason of the deleted warning
 * @param {string} deletedWarnAt - The time of the deleted warning
 */

 export class historialManager extends moderationUtil {
    UserID: string
    moderatorID: string
    reason: string
    caseNumber?: string
    time?: string
    at?: number
    guildID?: string
    caseOfDeletedWarn?: string
    reasonOfDeletedWarn?: string
    deletedWarnAt?: number

    /**
     * @constructor historialManager - Creates a new historialManager
     * @param UserID - The ID of the user
     * @param moderatorID - The ID of the moderator
     * @param reason - The reason for the action
     * @param caseNumber - The case number
     * @param time - The time of the action
     * @param at - The time at executed the action
     * 
     * @param caseOfDeletedWarn - The case of the deleted warning
     * @param reasonOfDeletedWarn - The reason of the deleted warning
     * @param deletedWarnAt - The time of the deleted warning
     * 
     * @returns {Object} - The data of the action.
     */

    constructor(UserID: string, moderatorID: string, reason: string, caseNumber?: string, time?: string, at?: number, caseOfDeletedWarn?: string, guildID?: string, reasonOfDeletedWarn?: string, deletedWarnAt?: number) {
        super()
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

    /**
     * @method addWarnHistorial - Adds a warn to the historial
     */

    async addWarnHistorial() {
        if (!this.UserID) throw Error(`El usuario que intentas warnear es invalido.`);
        if (!this.moderatorID) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);

        const data = await this.getHistorial();

        const p = [] as warn[];
        const caca = [] as globalAction[]; 

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
        } as warn;

        const caquita = {
            id: this.UserID,
            moderator: this.moderatorID,
            type: "warn",
            reason: this.reason,
            case: this.caseNumber,
            at: this.at
        } as globalAction;

        p.unshift(a);
        caca.unshift(caquita);

        managerError
        try {
        await historialModel.findOneAndUpdate({id: this.guildID}, {warns: p, all: caca})
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
        return a;
    }

    /**
     * @method addMuteHistorial - Adds a mute to the historial
     */

    async addMuteHistorial() {
        if (!this.UserID) throw Error(`El usuario que intentas mutear es invalido.`);
        if (!this.moderatorID) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);

        const data = await this.getHistorial();

        const p = [] as muteAction[];
        const caca = [] as globalAction[];

        for (const mute of data.mutes) {
            p.push(mute)
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
        } as muteAction;

        const caquita = {
            id: this.UserID,
            moderator: this.moderatorID,
            type: "mute",
            reason: this.reason,
            case: this.caseNumber,
            at: this.at
        } as globalAction;

        p.unshift(a);
        caca.unshift(caquita);

        managerError
        try {
        await historialModel.findOneAndUpdate({id: this.guildID}, {mutes: p, all: caca})
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
        return a;
    }

    /**
     * @method addUnmuteHistorial - Adds an unmute to the historial
     */

    async addUnmuteHistorial() {
        if (!this.UserID) throw Error(`El usuario que intentas desmutear es invalido.`);
        if (!this.moderatorID) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);

        const data = await this.getHistorial();

        const p = [] as unmuteAction[];
        const caca = [] as globalAction[];

        for (const unmute of data.unmutes) {
            p.push(unmute)
        }

        for (const action of data.all) {
            caca.push(action);
        }

        const a = {
            id: this.UserID,
            moderator: this.moderatorID,
            reason: this.reason,
            at: this.at,
        } as unmuteAction;

        const caquita = {
            id: this.UserID,
            moderator: this.moderatorID,
            type: "unmute",
            reason: this.reason,
            case: this.caseNumber,
            at: this.at
        } as globalAction;

        p.unshift(a);
        caca.unshift(caquita);
        managerError
        try {
        await historialModel.findOneAndUpdate({id: this.guildID}, {unmutes: p, all: caca})
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }

        return a;
    }

    /**
     * @method getHistorial - Gets the historial of the server
     */

    async getHistorial(): Promise<historial> {
        managerError
        try {
        const a = await historialModel.findOne({ id: this.guildID }).catch(() => {})

        if (!a) {
            const historial = new historialModel({
                id: this.guildID,
            })
            await historial.save();
            return historial as historial;
        }

        return a as historial;
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
    }

}

//////////////////////////////////// END OF HISTORIAL MANAGER ///////////////////////////////////////////////////////











/**
 * @class muteManager - The part of the moderation that manages the mutes
 * @param {GuildMember} member - The member that is muted
 * @param {GuildMember} moderator - The moderator that muted the member
 * @param {string} reason - The reason for the mute
 * @param {number} time - The time of the mute
 * @param {boolean} force - If the mute is forced
 */

export class muteManager extends moderationUtil {
    member: GuildMember
    author: GuildMember
    reason?: string
    time?: string
    force?: boolean



    constructor(member: GuildMember, author: GuildMember, reason: string = "No se dio una razón", time: string = "15m", force: boolean = false) {
        super()
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.time = time;
        this.force = force;
    }


    /**
 * @method mute - Mutes a user
 */

    async mute() {
        if (this.force == false && this.author.id !== this.member.guild.ownerId) {
            if (this.member.user.id == this.author.id) throw Error(`No puedes mutearte a ti mismo.`);
            if (this.member.roles.cache.has("913124108512931861") || this.member.communicationDisabledUntilTimestamp !== null) throw Error(`No puedes mutear a alguien que ya está muteado.`);
            if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes mutear a un creador.`)
            if (this.member.id == this.member.guild.ownerId) throw Error(`No puedes mutear al dueño del servidor.`);
            if (!this.member) throw Error(`El usuario que intentas mutear es invalido.`);
        }

        const data = await getUserDB(this.member.id);
        const now = Date.now();
        const caseNumber =  this.createCaseNumber();
    
        let muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
    
        if (!muteRole) throw Error(`He detectado una corrupción en el servidor.\nNo hay ningún rol que complete las características de un mute.\nPor favor, contacta con un administrador.`);
        
        var timee = this.formatTime(this.time);
        if (timee == undefined) throw Error(`El tiempo que ingresaste no es válido.`);
    
        const mutes = [] as mute[];

        for (const mute of data.mutesHistory) {
            mutes.push(mute);
        }

        mutes.unshift({
            id: this.member.id,
            moderator: this.author.id,
            reason: this.reason,
            mutedAt: now,
            case: caseNumber
        })

        managerError
        try {
        const roles = await this.roleMutedManager(this.member);
        const a = await new CacheModerationManager(this.member.id, this.author, this.reason, caseNumber, now).createCacheMute(this.member, timee, roles);
        await new historialManager(this.member.id, this.author.id, this.reason, caseNumber, this.time, now, null, this.member.guild.id, null, null).addMuteHistorial();
        
        await this.addModLog(caseNumber, "mute", this.member.id, this.author.id, this.reason, "activo", now);
        await userModel.findOneAndUpdate({id: this.member.id}, {mutesHistory: mutes});
        await new moderationBotLogs(this.member, this.author, this.reason, caseNumber, this.time).sendMuteLog();

        return {
            userID: this.member.id,
            moderatorID: this.author.id,
            highestRole: this.member.roles.highest.id,
            reason: this.reason,
            case: caseNumber,
            time: timee,
            mutedAt: now,
            roles: this.member.roles.cache.map(r => r.id)
        } as muted
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
    }

/**
 * @method unmute - Unmutes a user
 */

    async unmute() {
        if (!this.member) throw Error(`El usuario al que intentas desmutear no es válido.`);
        if (!this.author) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);
    
        const muteRole = this.member.guild.roles.cache.find(r => r.name == "Silenciado");
        const now = Date.now();
        const caseNumber = this.createCaseNumber();

        if (this.member.communicationDisabledUntilTimestamp !== null) {
            await new moderationBotLogs(this.member, this.author, this.reason, caseNumber).sendUnmuteLog();
            return this.member.timeout(null, `${this.author.user.tag}: ${this.reason}`);
        }
        if (this.member.roles.cache.has(muteRole.id) == false) throw Error(`El usuario que intentas desmutear no esta muteado.`);


        managerError;
        try {
        await this.addModLog(caseNumber, "unmute", this.member.id, this.author.id, this.reason, "activo", now);
        await new historialManager(this.member.id, this.author.id, this.reason, caseNumber, this.time, now, null, this.member.guild.id, null, null).addUnmuteHistorial();
        await new moderationBotLogs(this.member, this.author, this.reason, caseNumber).sendUnmuteLog();


        const data = db.getData("/muted") as muted[];
    
        const mute = data.find(m => m.userID == this.member.id);
        if (!mute) return this.member.roles.remove(muteRole.id);
    
        await mute.roles.map(x => this.member.roles.add(x));
        this.member.roles.remove(muteRole.id);
    
        const filter = data.filter(m => m.userID !== this.member.id);
    
         db.push(`/muted`, filter);
    
         return {
            id: this.member.id,
            moderator: this.author.id,
            reason: this.reason,
            at: now
         } as unmuteAction
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
    }

    /**
     * @method automaticUnmute - Unmutes a user automatically
     */

async automaticUnmute(): Promise<unmuteAction[]> {
    managerError
    try {
    const data = db.getData("/muted") as muted[];
    const filter = data.filter(m => m.time < Date.now());

    if (!filter || filter.length < 1) return;


    var a = []

    for (const mute of filter) {
    
    managerError;    
    const member = await this.author.guild.members.cache.get(mute.userID);
        try {
            var b  = await new muteManager(member, this.author, this.reason, this.time).unmute();
        } catch (e) {
            console.log(e);
        }
        a.push(b);
    }

    return a;
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }
   }
}











////////////////////////// Timeout //////////////////////////


/**
 * @class timeoutManager - Manages the timeout of a user
 * @param {GuildMember} member - The user to timeout
 * @param {GuildMember} author - The moderator who timeout the user
 * @param {string} reason - The reason of the timeout
 * @param {number} time - The time of the timeout
 * @param {caseNumber} caseNumber - The case number of the timeout
 * @param {boolean} force - If the timeout is forced
 */

export class timeoutManager extends moderationUtil {
    member: GuildMember;
    author: GuildMember;
    reason: string;
    time: string;
    caseNumber: string;
    force: boolean;

    /**
     * @constructor - Creates a new timeoutManager
     * @param {GuildMember} member - The user to timeout
     * @param {GuildMember} author - The moderator who timeout the user
     * @param {string} reason - The reason of the timeout
     * @param {number} time - The time of the timeout
     * @param {caseNumber} caseNumber - The case number of the timeout
     * @param {boolean} force - If the timeout is forced
     */

    constructor(member: GuildMember, author: GuildMember, reason: string = "No hay razón", time: string = "15m", force: boolean = false) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.time = time;
        this.caseNumber = this.createCaseNumber();
        this.force = force;
    }

    /**
     * @method timeout - Timeouts a user
     */

    async timeout() {
        if (!this.member) throw Error(`El usuario al que intentas timeout no es válido.`);
        if (!this.author) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`); 

        if (this.force == false) {
            if (this.member.communicationDisabledUntilTimestamp != null) throw Error(`El usuario que intentas timeoutear ya esta timeouteado.`);
            if (this.member.roles.cache.has(`913124108512931861`)) throw Error(`El usuario que intentas hacer timeout esta silenciado. Por lo cuál no puedes hacerlo.`);
            if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition) throw Error(`No puedes timeoutear a un usuario con un rol mayor al tuyo.`);
            if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition) throw Error(`El usuario que intentas timeout tiene tu mismo rango, así que no puedes hacerlo.`);
        }

        const now = Date.now();
        const timee = this.timeConvert(this.time);
        managerError;
        try {
        await this.member.timeout(timee, `${this.author.user.tag}: ${this.reason || "Sin razón"}`);
        await new moderationBotLogs(this.member, this.author, this.reason, this.caseNumber, this.time).sendTimeoutLog();

        return {
            id: this.member.id,
            moderator: this.author.id,
            reason: this.reason,
            case: this.caseNumber,
            time: this.time,
            at: now
        } as timeoutAction;
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        } 
    }

    /**
     * @method unTimeout - Untimeout a user
     */

    async unTimeout() {
        if (!this.member) throw Error(`El usuario al que intentas timeout no es válido.`);
        if (!this.author) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`); 

        if (this.force == false) {
            if (this.member.roles.cache.has(`913124108512931861`)) throw Error(`El usuario que intentas hacer timeout esta silenciado. Por lo cuál no puedes hacerlo.`);
            if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition) throw Error(`No puedes timeoutear a un usuario con un rol mayor al tuyo.`);
            if (this.member.roles.highest.rawPosition == this.author.roles.highest.rawPosition) throw Error(`El usuario que intentas timeout tiene tu mismo rango, así que no puedes hacerlo.`);
        }

        const now = Date.now();
    
        managerError;
        try {
        await this.member.timeout(null, `${this.author.user.tag}: ${this.reason || "Sin razón"}`);
        await new moderationBotLogs(this.member, this.author, this.reason, this.caseNumber, this.time).sendUntimeoutLog();

        return {
            id: this.member.id,
            moderator: this.author.id,
            reason: this.reason,
            case: this.caseNumber,
            time: this.time,
            at: now
        } as timeoutAction;
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        } 
    }
}




/////////////////////// WARN ///////////////////////////////








/**
 * @class warnManager - Manages the warns of a user
 * @param {Member} member - The member to warn
 * @param {Member} author - The moderator who warned the user
 * @param {string} reason - The reason for the warn
 * @param {boolean} force - Whether to check the different charateristics of the warn
 * @returns {Promise<Object>} - The data of the warn.
 */

export class warnManager extends moderationUtil {
    member: GuildMember
    author: GuildMember
    reason?: string
    force?: boolean
    caseNumber?: string

    /**
     * @constructor warnManager - Creates a new warnManager
     * @param member - The member to warn 
     * @param author - The moderator who warned the user
     * @param reason - The reason for the warn
     * @param force - Whether to check the different charateristics of the warn
     */

    constructor(member: GuildMember, author: GuildMember, reason: string = "No se dio una razón", force: boolean = false, caseNumber?: string) {
        // Language: typescript
        super()
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.force = force;
        this.caseNumber = caseNumber;
    }

    /**
     * @method warn - Warns a user
     */
    async warn() {
        if (this.force == false && this.author.id !== this.member.guild.ownerId) {
            if (this.reason == "No se dio una razón") throw Error(`La razón es obligatoria, colocala.`);
            if (this.reason.length > 300) throw Error(`La razón no puede tener más de 300 caracteres.`);
            if (this.reason.length < 3) throw Error(`La razón no puede tener menos de 3 caracteres.`);
            if (this.member.user.bot) throw Error(`No puedes advertir a un bot.`);
            if (this.member.id == this.author.id) throw Error(`No te puedes warnear a ti mismo.`)
            if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes warnear a un creador.`);
            if (this.member.id == this.member.guild.ownerId) throw Error(`No puedes warnear al dueño del servidor.`);
        }

        if (!this.member) throw Error(`El usuario que intentas warnear es invalido.`);
        if (!this.author) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi prograador para solucionar el problema.`);

        const caseN = await this.createCaseNumber();
        const now = Date.now();
    
        managerError;
        try {
        await this.createWarn(this.member, this.author, this.reason, caseN, now);
        await new historialManager(this.member.id, this.author.id, this.reason, caseN, null, Date.now(), null, this.member.guild.id).addWarnHistorial();
        await new moderationBotLogs(this.member, this.author, this.reason, caseN).logWarn();
        await new CacheModerationManager(this.member.id, this.author, this.reason, caseN).createCacheWarn({id: this.member.id, moderator: this.author.id, reason: this.reason, case: caseN, at: now});
        return {
            "id": this.member.id,
            "moderator": this.author.id,
            "reason": this.reason,
            "case": caseN,
            "at": now
        } as warn
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }
    }

    /**
     * @method delWarn - Deletes a warn
     */

    async delWarn() {
        if (!this.caseNumber == false) {
            const data = await userModel.find({}).exec() as DBUser[];

            const user = data.find(u => u.warnsHistory.find(w => w.case == this.caseNumber));
            if (!user) throw Error(`El caso que intentas eliminar no existe.`);
            const member = await this.author.guild.members.cache.get(user.id);

            if (!this.force) {
                
                if (member.id == this.author.id) throw Error(`No puedes borrar tus propios warns.`);
                if (member.roles.highest.rawPosition > this.author.roles.highest.rawPosition) throw Error(`No puedes borrar un warn de un usuario que tiene un rol mayor que tú.`);
                if (member.roles.highest.rawPosition == this.author.roles.highest.rawPosition) throw Error(`No puedes borrar un warn de un usuario que tiene el mismo rol que tú.`);
                
            }


            if (!user) throw Error(`El caso que intentas borrar no existe.`);
            const warn = user.warnsHistory.find(w => w.case == this.caseNumber);
            if (!warn) throw Error(`El warn que intentas borrar no existe. Intenta poniendo otro warn.`);
            managerError;
            try {
            const deletedData = await this.deleteWarnDB(warn.id, this.author.id, warn.case, this.reason || null);
            new moderationBotLogs(member, this.author, this.reason, deletedData.case, null, deletedData.caseOfDeletedWarn).sendWarnDeleteLog();
            return deletedData
            } catch (error) {
                sentry.captureException(error);
            } finally {
                managerError.finish()
            }            
        } else if (!this.caseNumber) {
            throw Error(`El caso de warn que has puesto no existe.`);
        }
    }

    /**
     * @method delWarns - Deletes all warns of user.
     */

async delwarns() {

    const userDB = await getUserDB(this.member.id);
    const modDB = await getUserDB(this.author.id);
    const cache = await new CacheManager(this.author.client).get();

    if (this.force == false) {
        if (this.author.id == this.member.id) throw Error(`No puedes borrar tus propios warns.`);
        if (this.member.roles.highest.rawPosition > this.author.roles.highest.rawPosition) throw Error(`No puedes borrar los warns de un usuario que tiene roles mayores que tú.`);
        if (this.author.roles.highest.rawPosition == this.member.roles.highest.rawPosition) throw Error(`No puedes borrar los warns de un usuario que tiene los mismos roles que tú.`);
        if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`Los creadores no tienen warns.`);
        if (this.member.id == this.member.guild.ownerId) throw Error(`No puedes borrar los warns de un usuario que es el dueño del servidor.`);
        if (userDB.warnsHistory[0] == undefined) throw Error(`El usuario no tiene warns para borrar.`)
    }

    if (!this.member) throw Error(`El usuario que intentas borrar los warns es invalido.`);
    if (!this.author) throw Error(`Corrupción. El autor del comando no es válido. Contacta con mi programador para solucionar el problema.`);

    const caseNumber = this.createCaseNumber();
    const now = Date.now();

    const historial = await new historialManager(null, this.author.id, null, caseNumber, null, now, null, this.member.guild.id, null, null).getHistorial();
    const deletewarn = [] as deleteWarnAction[];

    const deleted = historial.warnsDelete || null

    for (let deleteWarn of deleted) {
        deletewarn.push(deleteWarn)
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
    const modLogs = [] as modLog[];

    for (let modlog of filter2) {
        modLogs.push(modlog)
    }

    for (let modlog of filter) {
        modLogs.push({
            at: modlog.at,
            moderator: modlog.moderator,
            reason: modlog.reason,
            status: "borrada",
            type: "warn",
            userID: modlog.userID
        })
    }

    const a = {
        caseNumber: caseNumber,
        moderatorID: this.author.id,
        deletedWarns: userDB.warnsHistory
    } as deleteWarnsAction;
    managerError;
    try {
    await new moderationBotLogs(this.member, this.author, this.reason, a.caseNumber, null).sendWarnsDeleteLog(userDB.warnsHistory);
    await userModel.findOneAndUpdate({id: this.member.id}, {warnsHistory: [], warns: 0});
    await userModel.findOneAndUpdate({id: this.author.id}, {modLogs: modLogs});
    await historialModel.findOneAndUpdate({id: this.member.guild.id}, {warnsDelete: deletewarn});
    await db.push("/warns", filter3);

    return a;
    } catch (error) {
        sentry.captureException(error);
    } finally {
        managerError.finish()
    }

     }

    /**
     * @method automaticWarnDelete - Deletes the warns detected with more of 1 month of age.
     */

async automaticWarnDelete() {
    
    const cache = await new CacheManager(this.author.client).get();
    const filter = cache.warns.filter(x => x.expiration <= Date.now());

    if (!filter[0]) return "No hay warns detectados para borrar";

    const w = await this.bulkWarnDelete(filter);

    const a = {
        caseNumber: w[0].case,
        moderatorID: this.author.id,
        deletedWarns: w as any
    } as deleteWarnsAction;


}

/**
 * @method bulkWarnDelete - Deletes all the warns specified in the array.
 * @param {cachedWarn[]} warns - Array of warns to delete.
 */

async bulkWarnDelete(cachedWarnsToDelete: cachedWarn[]) {
    managerError;
    try {
    const cache = await new CacheManager(this.author.client).get();
    const filter = cache.warns.filter(x => cachedWarnsToDelete.find(y => y.id == x.id).case !== x.case);
    const caseN = this.createCaseNumber();


    for (const cacheWarn of cachedWarnsToDelete) {
        
        // get the mongoDB database of the user and the moderator
        const userDB = await getUserDB(cacheWarn.id);

        // get the moderator searching in the warn and searching the moderator in the warn
        const warn = userDB.warnsHistory.find(x => x.case == cacheWarn.case);
        const modDB = await getUserDB(warn.moderator);

        // filter the warns wihout the warn to delete
        const filter = userDB.warnsHistory.filter(x => x.case !== cacheWarn.case);
        
        // find the modlog to edit and makes a filter to delete the modlog
        const fi = modDB.modLogs.filter(x => x.at !== warn.at && x.moderator !== warn.moderator);
        const modLog = modDB.modLogs.find(x => x.at == warn.at && x.moderator == warn.moderator && x.reason == warn.reason && x.type == "warn");

        const modLogs = [] as modLog[];
        

        // push the modlogs to the array
        for (let modlog of fi) {
        modLogs.push(modlog);    
        }

        // push the edited modlog to the array

        modLogs.unshift({
            at: modLog.at,
            moderator: modLog.moderator,
            reason: modLog.reason,
            status: "borrada",
            type: "warn",
            userID: modLog.userID
        })

        // get the historial of the server
        const historial = await new historialManager(null, this.author.id, null, caseN, null, Date.now(), null, this.author.guild.id, null, null).getHistorial();

        // Make a new array and push all the deleted warns of the history
        const deletewarn = [] as deleteWarnAction[];

        for (let deleteWarn of historial.warnsDelete) {
            deletewarn.push(deleteWarn)
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
        } as deleteWarnAction;

        var b = [] as deleteWarnAction[];

        // push the deleted warn to the array
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


        // edit all databases with new values
        await userModel.findOneAndUpdate({id: cacheWarn.id}, {warnsHistory: filter, warns: filter.length})
        await userModel.findOneAndUpdate({id: warn.moderator}, {modLogs: modLogs});
        await historialModel.findOneAndUpdate({id: this.author.guild.id}, {warnsDelete: deletewarn});
        

        // log all deleted warns
        await new moderationBotLogs(this.author.guild.members.cache.get(cacheWarn.id), this.author, `Automoderador, eliminados warns con más de 7 días de existencia.`, caseN, null, warn.case).sendWarnDeleteLog();
    }

    // edit the cache with the new warns
    db.push("/warns", filter);
    return b;
} catch (error) {
    sentry.captureException(error);
} finally {
    managerError.finish()
}
   }
}




















/**
 * @class kickManager - Class that manages the kick actions.
 * @param {GuildMember} member - Member to kick.
 * @param {GuildMember} moderator - Moderator who kicked the member.
 * @param {string} reason - Reason of the kick.
 * @param {string} caseNumber - Case number of the kick.
 */

export class kickManager extends moderationUtil {
    member: GuildMember;
    author: GuildMember;
    reason: string;
    force: boolean;
    case: string;


    /**
     * @constructor kickManager - Constructor of the kickManager class.
     * @param {GuildMember} member - Member to kick.
     * @param {GuildMember} moderator - Moderator who kicked the member.
     * @param {string} reason - Reason of the kick.
     * @param {boolean} force - Force kick?
     */



    constructor(member: GuildMember, author: GuildMember, reason: string = "Sin razón", force: boolean = false) {
        super();
        this.member = member;
        this.author = author;
        this.reason = reason;
        this.force = force;
        this.case = this.createCaseNumber();
    }

    /**
     * @method kick - Kick the member.
     */

    async kick() {
        if (this.force == false) {
            if (!this.member) throw Error(`El miembro es invalido`);
            if (this.member.id == this.author.id) throw Error(`No puedes expulsarte a ti mismo`);
            if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes expulsar a un creador`);
            if (this.member.id == this.member.guild.ownerId) throw Error(`No se puede expulsar al creador del servidor`);
        }

        const now = Date.now();
        const data = await getDBUser(this.member.id);
        const modlog = await this.addModLog(this.case, "kick", this.member.id, this.author.id, this.reason || "Sin razón", "activo", now);
        const historial = await new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();

        const kick = {
            id: this.member.id,
            at: now,
            moderator: this.author.id,
            reason: this.reason,
            case: this.case
        } as kickAction;

        const global = {
            id: this.member.id,
            at: now,
            moderator: this.author.id,
            reason: this.reason,
            case: this.case,
            type: "kick"
        } as globalAction;

        const a = [] as kickAction[];
        const b = [] as globalAction[];
        
        for (const q of historial.kicks) {
            a.push(q);
        }

        for (const q of historial.all) {
            b.push(q);
        }

        b.unshift(global);
        a.unshift(kick);

        managerError
        try {
        await new moderationBotLogs(this.member, this.author, this.reason || `Sin razón`, this.case).sendKickLog();
        await this.member.kick(this.reason)

        await historialModel.findOneAndUpdate({id: this.member.guild.id}, {kicks: a, all: b});
        await userModel.findOneAndUpdate({id: this.member.id}, {kicks: data.kicks + 1});


        return kick;
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
    }
}















/**
 * @class banManager - Class that manages the ban actions.
 * @param {GuildMember} member - Member to ban.
 * @param {GuildMember} moderator - Moderator who banned the member.
 * @param {string} reason - Reason of the ban.
 * @param {string} caseNumber - Case number of the ban.
 * @param {boolean} force - Force ban?
 */

export class banManager extends moderationUtil {
    member: GuildMember;
    moderator: GuildMember;
    reason: string;
    case: string;
    force: boolean;

    /**
     * @constructor banManager - Constructor of the banManager class.
     * @param {GuildMember} member - Member to ban.
     * @param {GuildMember} moderator - Moderator who banned the member.
     * @param {string} reason - Reason of the ban.
     * @param {boolean} force - Force ban?
     */

    constructor(member: GuildMember, moderator: GuildMember, reason: string = "Sin razón", force: boolean = false) {
        super();
        this.member = member;
        this.moderator = moderator;
        this.reason = reason;
        this.force = force;
        this.case = this.createCaseNumber();
    }

    /**
     * @method ban - Ban the member.
     * @param {string} time - Time of the ban.
     */

    async ban(time: string = null, days: number = 3) {
        if (!time) {
            const userdb = await getDBUser(this.member.id);
            const moddb = await getDBUser(this.moderator.id);
            const cache = await this.moderator.client.cache;

            if (this.force == false) {
                if (!this.member) throw Error(`El miembro es invalido`);
                if (this.member.id == this.moderator.id) throw Error(`No te puedes banear a ti mismo`);
                if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes banear a un creador`);
                if (this.member.id == this.member.guild.ownerId) throw Error(`No se puede banear al creador del servidor`);
                if (days > 7) throw Error(`El tiempo de eliminación de mensajes no puede ser mayor a 7.`);
                if (days < 0) throw Error(`El tiempo de eliminación de mensajes no puede ser menor a 0.`);
            }


            const now = Date.now();

            const modlogs = await this.addModLog(this.case, "ban", this.member.id, this.moderator.id, this.reason || "Sin razón", "activo", now);
            const historial = await new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();

            const ban = {
                id: this.member.id,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case
            } as ban;

            const global = {
                id: this.member.id,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                type: "ban"
            } as globalAction;

            const a = [] as ban[];
            const b = [] as globalAction[];
            const d = [] as ban[];

            for (const q of historial.bans) {
                a.push(q);
            }

            for (const q of historial.all) {
                b.push(q);
            }
            
            for (const ban of cache.bans) {
                d.push(ban)
            } 

            b.unshift(global);
            d.unshift(ban);
            a.unshift(ban);

            managerError
            try {
                await new moderationBotLogs(this.member, this.moderator, this.reason || `Sin razón`, this.case).sendBanLog();
                await this.member.ban({reason: this.reason, days: days})
                await db.push("/bans", d)
                await historialModel.findOneAndUpdate({id: this.member.guild.id}, {bans: a, all: b});
                await userModel.findOneAndUpdate({id: this.member.id}, {bans: userdb.bans + 1});
                
                return ban;
            } catch (error) {
                sentry.captureException(error);
            } finally {
                managerError.finish()
            }
        } else {
            const userdb = await getDBUser(this.member.id);
            const moddb = await getDBUser(this.moderator.id);
            const cache = this.moderator.client.cache;

            if (this.force == false) {
                if (!this.member) throw Error(`El miembro es invalido`);
                if (this.member.id == this.moderator.id) throw Error(`No te puedes banear a ti mismo`);
                if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes banear a un creador`);
                if (this.member.id == this.member.guild.ownerId) throw Error(`No se puede banear al creador del servidor`);
                if (days > 7) throw Error(`El tiempo de eliminación de mensajes no puede ser mayor a 7.`);
                if (days < 0) throw Error(`El tiempo de eliminación de mensajes no puede ser menor a 0.`);
            }

            const now = Date.now();

            const modlogs = await this.addModLog(this.case, "ban", this.member.id, this.moderator.id, this.reason || "Sin razón", "activo", now);
            const historial = await new historialManager(null, this.member.id, null, this.case, null, now, null, this.member.guild.id, null, null).getHistorial();
            const timee = this.formatTime(time);

            const ban = {
                id: this.member.id,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                time: timee
            } as ban;

            const global = {
                id: this.member.id,
                at: now,
                moderator: this.moderator.id,
                reason: this.reason,
                case: this.case,
                type: "ban"
            } as globalAction;

            const a = [] as ban[];
            const b = [] as globalAction[];
            const d = [] as ban[];

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

            managerError
            try {
                await new moderationBotLogs(this.member, this.moderator, this.reason, this.case, Translatetime(time)).sendBanLog();
                await this.member.ban({reason: this.reason, days: days})
                await db.push("/bans", d)
                await historialModel.findOneAndUpdate({id: this.member.guild.id}, {bans: a, all: b});
                await userModel.findOneAndUpdate({id: this.member.id}, {bans: userdb.bans + 1});
                await new CacheModerationManager(this.member.id, this.moderator, this.reason, this.case, now).createCacheBan(this.member, timee);
                return ban;
            }
            catch (error) {
                sentry.captureException(error);
            } finally {
                managerError.finish()
            }
        }
    }

    /**
     * @method unban - Unban the member.
     * @param {string} id - ID of the member.
     */

    async unban(userID: string) {
        
        await this.moderator.guild.bans.fetch();
        

        if(this.force == false) {
        if (await (await this.moderator.client.users.fetch(userID, {force: true})) == undefined) throw Error(`El usuario que has especificado no existe.`);
        var userData = await this.moderator.client.users.fetch(userID, {force: true});
        if (this.moderator.guild.members.cache.get(userID) !== undefined) throw Error(`No puedes desbanear a un usuario que ya se encuentra en el servidor.`);
        if (userData.id == this.moderator.id) throw Error(`No puedes desbanearte a ti mismo tonto.`);
        }

        const ban = await (await this.moderator.guild.bans.fetch()).find(x => x.user.id == userData.id);
        if (!ban) throw Error(`El usuario que has especificado no esta baneado.`);

        const now = Date.now();
        const cache = new CacheManager(this.moderator.client).get();
        const history = await new historialManager(null, userData.id, null, this.case, null, now, null, this.moderator.guild.id, null, null).getHistorial();
        
        // filter the ban cache data to remove the ban
        const filtered = cache.bans.filter(x => x.id !== userData.id);
        const a = [] as globalAction[];

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
        })




        managerError;
        try {
            // update the cache
            await historialModel.findOneAndUpdate({id: this.moderator.guild.id}, {all: a});
            await db.push("/bans", filtered);
            await new moderationBotLogs(null, this.moderator, this.reason, this.case).sendUnbanLog(userData);
            await this.moderator.guild.members.unban(userData, `${this.moderator.user.tag}: ${this.reason}`);
            
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
        
    }

    
    
    /**
     * @method automaticUnban - Automatic unban the member.
     */

    async automaticUnban() {
        const cache = new CacheManager(this.moderator.client).get();
        const filter = await cache.bans.filter(x => x.time <= Date.now());
        const filter2 = await cache.bans.filter(x => x.time > Date.now());        

        if (!filter || filter[0] == undefined) return;

        await db.push("/bans", filter2);

        for (const ban of filter) {
            await this.moderator.guild.members.unban(ban.id, this.reason);
            const history = await new historialManager(null, ban.id, null, this.case, null, Date.now(), null, this.moderator.guild.id, null, null).getHistorial();
            const a = [] as globalAction[];

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
            })

            managerError;
            try {
                await historialModel.findOneAndUpdate({id: this.moderator.guild.id}, {all: a});

            } catch (error) {
                sentry.captureException(error);
            } finally {
                managerError.finish()
            }
        }


        managerError;
        try {
            
        } catch (error) {
            sentry.captureException(error);
        } finally {
            managerError.finish()
        }
        
    }

    /**
     * @method softban - Softban the member.
     * @param {string} id - ID of the member.
     * @param {number} days - Days to delete the messages.
     */

    async softban(userID: string, days: number) {
        if (this.force == false) {
            if (!this.member) throw Error(`El usuario que has puesto no existe.`);
            if (!this.moderator) throw Error(`He detectado una corrupción de tipo __PPP_USER_AUTHOR_MEMBER_ por favor contecta con mi desarrollador para informar de este error.`);
            if (this.member.roles.cache.has(`913123943072813096`)) throw Error(`No puedes softbanear a un usuario que es creador del servidor.`);
            if (this.member.id == this.member.guild.ownerId) throw Error(`No puedes softbanear a un usuario que es el dueño del servidor.`);
            if (this.member.id == this.moderator.id) throw Error(`No puedes softbanear a ti mismo tonto.`);
        }

        const history = await new historialManager(null, userID, null, this.case, null, Date.now(), null, this.moderator.guild.id, null, null).getHistorial();
        const now = Date.now();

        const ban = {
            id: userID,
            at: now,
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case,
        } as ban;

        const unban = {
            id: userID, 
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case,
            type: "unban",
            at: now
        } as globalAction;

        const bann = {
            id: userID,
            at: now,
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case,
            type: "ban"
        } as globalAction;

        const a = [] as globalAction[];
        const b = [] as ban[];

        for (const q of history.all) {
            a.push(q);
        }

        for (const q of history.bans) {
            b.push(q);
        }

        a.unshift(bann, unban);
        b.unshift(ban)


        managerError
        try {
            await historialModel.findOneAndUpdate({id: this.moderator.guild.id}, {all: a, bans: b});
            await new moderationBotLogs(this.member, this.moderator, this.reason, this.case).sendSoftBanLog();
            await this.moderator.guild.members.ban(userID, {days: days, reason: `${this.moderator.user.tag}: ${this.reason}`});
            await this.moderator.guild.members.unban(userID, `${this.moderator.user.tag}: ${this.reason ?? "Sin razón"}`);
            
            return ban;
        } catch (e) {
            sentry.captureException
        } finally {
            managerError.finish()
        }
    }
}