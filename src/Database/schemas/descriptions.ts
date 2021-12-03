import { model, Schema } from "mongoose";

export interface descriptions {
  id: string;
  hug: string[];
  kiss: string[];
  happy: string[];
  sad: string[];
  angry: string[];
  love: string[];
  hate: string[];
  confused: string[];
  bored: string[];
  scared: string[];
  fucks: string[];
  licks: string[];
  sucks: string[];
}

export const descriptionsSchema = new Schema<descriptions>({
  id: { type: String, required: true, default: "first" },
  hug: { type: Array, required: true, default: [] },
  kiss: { type: Array, required: true, default: [] },
  happy: { type: Array, required: true, default: [] },
  sad: { type: Array, required: true, default: [] },
  angry: { type: Array, required: true, default: [] },
  love: { type: Array, required: true, default: [] },
  hate: { type: Array, required: true, default: [] },
  confused: { type: Array, required: true, default: [] },
  bored: { type: Array, required: true, default: [] },
  scared: { type: Array, required: true, default: [] },
  fucks: { type: Array, required: true, default: [] },
  licks: { type: Array, required: true, default: [] },
  sucks: { type: Array, required: true, default: [] },
});

export const descriptionsModel = model<descriptions>(
  "descriptions",
  descriptionsSchema
);
