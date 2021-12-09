import { model, Schema } from "mongoose";
import { MessageEmbed } from 'discord.js';
export interface DBChannel {
  id: string;
  registeredAt: string;
  snipes: snipes[];
}

export interface snipes {
  messageID: string;
  messageAuthor: string;
  messageAuthorAvatar: string;
  messageContent: string;
  messageAttachments: string[];
  messageEmbeds: MessageEmbed[];
  messageTimestamp: number;
  messageStickers: string[];
}

export const channelSchema = new Schema<DBChannel>({
  id: { type: String, required: true },
  registeredAt: { type: String, required: true, default: Date.now() },
  snipes: { type: Array, required: true, default: [] },
});

export const channelModel = model<DBChannel>("Canales", channelSchema);
