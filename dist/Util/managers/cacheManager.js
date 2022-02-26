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
exports.CacheModerationManager = exports.CacheManager = void 0;
const index_1 = require("../../index");
class CacheManager {
    constructor(client) {
        this.client = client;
    }
    get() {
        index_1.managerError;
        try {
            return index_1.db.getData(`/`);
        }
        catch (e) {
            index_1.sentry.captureException(e);
        }
        finally {
            index_1.managerError.finish();
        }
    }
    g(key) {
        index_1.managerError;
        try {
            return index_1.db.getData(`/${key}`);
        }
        catch (e) {
            index_1.sentry.captureException(e);
        }
        finally {
            index_1.managerError.finish();
        }
    }
}
exports.CacheManager = CacheManager;
class CacheModerationManager extends CacheManager {
    constructor(memberID, moderator, reason, caseNumber, at = Date.now()) {
        super(moderator.client);
        this.client = moderator.client;
        this.member = memberID;
        this.moderator = moderator;
        this.reason = reason;
        this.case = caseNumber;
        this.at = at;
    }
    createCacheWarn(warn) {
        if (!warn)
            throw Error(`No se ha dado ningun warn a registrar.`);
        const action = {
            id: warn.id,
            case: warn.case,
            expiration: warn.at + 604800000
        };
        const a = [];
        const data = index_1.db.getData("/");
        for (const cachedWarn of data.warns) {
            a.push(cachedWarn);
        }
        a.unshift(action);
        index_1.managerError;
        try {
            index_1.db.push(`/warns`, a);
        }
        catch (e) {
            index_1.sentry.captureException(e);
        }
        finally {
            index_1.managerError.finish();
        }
        return action;
    }
    createCacheMute(member, time, roless) {
        return __awaiter(this, void 0, void 0, function* () {
            var a = [];
            var b = [];
            const roles = roless.map(x => x);
            var data = index_1.db.getData("/muted");
            for (const mute of data) {
                b.push(mute);
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
            };
            b.unshift(mute);
            try {
                index_1.db.push(`/muted`, b);
            }
            catch (e) {
                index_1.sentry.captureException(e);
            }
            finally {
                index_1.managerError.finish();
            }
            return mute;
        });
    }
    createCacheBan(member, time) {
        const data = this.get().bans;
        const ban = {
            id: member.id,
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case,
            time: time + Date.now(),
            at: this.at
        };
        const a = [];
        for (const ban of data) {
            a.push(ban);
        }
        a.unshift(ban);
        index_1.managerError;
        try {
            index_1.db.push(`/bans`, a);
        }
        catch (e) {
            index_1.sentry.captureException(e);
        }
        finally {
            index_1.managerError.finish();
        }
    }
}
exports.CacheModerationManager = CacheModerationManager;
