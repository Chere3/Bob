import { model, Model, Schema } from "mongoose";
import { warn } from './User';
import { ban, deleteWarnAction, globalAction, muteAction, unmuteAction, kickAction } from '../../Util/constants/moderationDataManager';

export interface historial {
    id: string
    all: globalAction[];
    warns: warn[];
    warnsDelete: deleteWarnAction[];
    kicks: kickAction[];
    bans: ban[];
    mutes: muteAction[];
    unmutes: unmuteAction[];
}

export const historialSchema = new Schema<historial>({
    id: {type: String, required: true},
    all: {type: Array, required: true, default: []},
    warns: {type: Array, required: true, default: []},
    warnsDelete: {type: Array, required: true, default: []},
    kicks: {type: Array, required: true, default: []},
    bans: {type: Array, required: true, default: []},
    mutes: {type: Array, required: true, default: []},
    unmutes: {type: Array, required: true, default: []}
});

export const historialModel = model<historial>("historial", historialSchema);