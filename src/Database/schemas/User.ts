import { model, Schema } from "mongoose";

export interface DBUser {
  id: string;
  registeredAt: string;
  warns: number
  mutes: number
  kicks: number
  bans: number
  warnsHistory: warn[]
  mutesHistory: mute[]
  modLogs: modLog[]
  social: social;
}

export interface warn {
  id: string
  case: string
  reason: string
  moderator: string
  at: number
}

export interface mute {
  id: string
  case: string
  reason: string
  moderator: string
  mutedAt: number
}

export interface modLog {
  userID: string
  moderator: string
  type: "warn" | "mute" | "unmute" | "kick" | "ban"
  reason: string
  at: number
  status: "activo" | "borrada"
}

export interface social {
  hugs: number;
  kisses: number;
  pats: number;
  happy: number;
  sad: number;
  angry: number;
  love: number;
  hate: number;
  confused: number;
  bored: number;
  scared: number;
  fucks: number;
  licks: number;
  sucks: number;
}

export const userSchema = new Schema<DBUser>({
  id: { type: String, required: true },
  registeredAt: { type: String, required: true, default: Date.now() },
  warns: {type: Number, required: true, default: 0},
  mutes: {type: Number, required: true, default: 0},
  kicks: {type: Number, required: true, default: 0},
  bans: {type: Number, required: true, default: 0},
  warnsHistory: {type: Array, required: true, default: []},
  mutesHistory: {type: Array, required: true, default: []},
  modLogs: {type: Array, required: true, default: []},
  social: {
    hugs: { type: Number, required: true, default: 0 },
    kisses: { type: Number, required: true, default: 0 },
    pats: { type: Number, required: true, default: 0 },
    happy: { type: Number, required: true, default: 0 },
    sad: { type: Number, required: true, default: 0 },
    angry: { type: Number, required: true, default: 0 },
    love: { type: Number, required: true, default: 0 },
    hate: { type: Number, required: true, default: 0 },
    confused: { type: Number, required: true, default: 0 },
    bored: { type: Number, required: true, default: 0 },
    scared: { type: Number, required: true, default: 0 },
    fucks: { type: Number, required: true, default: 0 },
    licks: { type: Number, required: true, default: 0 },
    sucks: { type: Number, required: true, default: 0 },
  },
});

export const userModel = model<DBUser>("Usuarios", userSchema);
