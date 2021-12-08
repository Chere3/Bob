import { model, Schema } from "mongoose";

export interface DBUser {
  id: string;
  registeredAt: string;
  social: social;
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
