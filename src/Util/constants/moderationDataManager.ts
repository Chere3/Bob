import { warn } from '../../Database/schemas/User';
export type modActions = "warn" | "delwarn" | "mute" | "timeout" | "untimeout" | "unmute" | "kick" | "ban" | "unban";

export interface muted {
    userID: string
    moderatorID: string
    highestRole: string
    reason: string
    time: number
    case: string
    mutedAt: number
    roles: string[]
}

export interface muteAction {
    id: string
    moderator: string
    reason: string
    case: string
    at: number
    time: string
}

export interface deleteWarnAction {
    id: string
    moderator: string
    reason: string
    caseOfDeletedWarn: string
    reasonOfDeletedWarn: string
    deletedWarnAt: number
    moderatorOfDeletedWarn: string
    at: number
    case: string
}

export interface ban {
    id: string
    moderator: string
    reason: string
    case: string
    time?: number
    at: number
}

export interface kickAction {
    id: string
    moderator: string
    reason: string
    case: string
    at: number
}

export interface unmuteAction {
    id: string
    moderator: string
    reason: string
    at: number
}

export interface deleteWarnsAction {
    moderatorID: string,
    caseNumber: string,
    deletedWarns: warn[];
}

export interface globalAction {
    id: string
    moderator: string
    type: modActions
    reason: string
    case: string
    at: number
}

export interface timeoutAction {
    id: string,
    moderator: string,
    reason: string,
    case: string,
    time: string,
    at: number
}

export type levels = "normal member" | "staff" | "medium staff" | "high staff" | "creator";