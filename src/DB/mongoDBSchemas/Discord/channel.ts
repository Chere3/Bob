import { DBChannel } from "../../../Typings/DBInterfaces";
import {model, Schema} from "mongoose"



export const channelSchema = new Schema<DBChannel>({
    id: { type: String, required: true },
    registeredAt: {type: Number, required: true, default: Date.now()},
    // @ts-expect-error
    snipes: {type: Array, required: true, default: []},
    // @ts-expect-error
    editsnipes: {type: Array, required: true, default: []}
  });
  
  export const channelModel = model<DBChannel>("Canales", channelSchema);