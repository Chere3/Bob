import { Client, GuildMember, Role } from 'discord.js';
import { db, managerError, sentry, transaction } from '../../index';
import { warn } from '../../Database/schemas/User';
import { cacheStructure, cachetype, cachedWarn } from '../constants/cache';
import { ban, muted } from "../constants/moderationDataManager";

/**
 * @class CacheManager - Manages the cache of the bot.
 * @property {Client} client - The client of the bot.
 */

export class CacheManager {
    client: Client;

    /**
     * @constructor - Creates a new CacheManager.
     * @param {Client} client - The client of the bot.
     */

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * @method get - Gets a value from the cache.
     * @param {string} key - The key of the value.
     * @returns {any} The value.
     * @author Cheree
     */

    get(): cacheStructure {
        managerError;
        try {
        return db.getData(`/`)
        } catch (e) {
            sentry.captureException(e);
        } finally {
            managerError.finish();
        }
    }

    g(key: cachetype): any {
        managerError;
        try {
        return db.getData(`/${key}`)
        } catch (e) {
            sentry.captureException(e);
        } finally {
            managerError.finish();
        }
    }


}

/**
 * @class CacheModerationManager - Manages the moderation cache of the bot.
 * @property {Client} client - The client of the bot.
 * @propery {string} memberID - The member
 * @property {GuildMember} moderator - The moderator
 * @property {string} reason - The reason of the punishment
 * @propery {string} case - The case of the punishment
 */

export class CacheModerationManager extends CacheManager {
    client: Client;
    member: string;
    moderator: GuildMember;
    reason: string;
    case: string;
    at: number;

    /**
     * @constructor - Creates a new CacheModerationManager.
     * @param {Client} client - The client of the bot.
     * @param {string} memberID - The member
     * @param {GuildMember} moderator - The moderator
     * @param {string} reason - The reason of the punishment
     * @param {string} case - The case of the punishment
     * @author Cheree
     */

    constructor(memberID: string, moderator: GuildMember, reason: string, caseNumber: string, at: number = Date.now()) {
        super(moderator.client);
        this.client = moderator.client;
        this.member = memberID;
        this.moderator = moderator;
        this.reason = reason;
        this.case = caseNumber;
        this.at = at;
    }

    /**
     * @method createCacheWarn - Creates a cache warn with expiration time.
     * @param {warn} warn - The data of the warn.
     */

    createCacheWarn(warn: warn) {
        if (!warn) throw Error(`No se ha dado ningun warn a registrar.`);
        const action = {
            id: warn.id,
            case: warn.case,
            expiration: warn.at + 604800000
        } as cachedWarn;

        const a = [] as cachedWarn[];

        const data = db.getData("/") as cacheStructure;

        for (const cachedWarn of data.warns) {
            a.push(cachedWarn);
        }

        a.unshift(action)

        managerError
        try {
        db.push(`/warns`, a);
        } catch (e) {
            sentry.captureException(e);
        } finally {
            managerError.finish();
        }

        return action
    }

/**
 * @method createCacheMute - Caches the muted users
 * @param member - The member to cache
 * @param time - The time of the mute
 * @param Roless - The user roles
 * @returns {Promise<void>} - The data of the mute.
 */

    async createCacheMute(member: GuildMember, time: number, roless: Role[]) {


        var a = [];
        var b = [];
        const roles = roless.map(x => x);
    
        var data = db.getData("/muted") as muted[]
    
    
    
        for (const mute of data) {
            b.push(mute)
        }
    
        for (const role of roles) {
            a.push(role.id);
        }
    
    
        const mute = {
            userID: this.member,
            moderatorID: this.moderator.id,
            highestRole: member.roles.highest.id,
            reason: this.reason,
            time: time,
            mutedAt: Date.now(),
            roles: a
        }
    
        b.unshift(mute);
    try {
    db.push(`/muted`, b);
    } catch (e) {
        sentry.captureException(e);
    } finally {
        managerError.finish();
    }

    return mute;
    }

    /**
     * @method createCacheBan - Caches the banned user
     * @param member - The member to cache
     * @param time - The time for the ban
     */

    createCacheBan(member: GuildMember, time: number) {
        const data = this.get().bans
        const ban = {
            id: member.id,
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case,
            time: time + Date.now(),
            at: this.at
        } as ban;

        const a = [] as ban[];

        for (const ban of data) {
            a.push(ban);
        }

        a.unshift(ban);

        managerError
        try {
        db.push(`/bans`, a);
        } catch (e) {
            sentry.captureException(e);
        } finally {
            managerError.finish();
        }
    }
}