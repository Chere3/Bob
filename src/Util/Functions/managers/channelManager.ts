/**
 * @method getDBUser - Get a user from the database
 * @param {string} userID - The user's ID
 * @author Cheree
 * @returns {Promise<DBUser>} El usuario en la base de datos.
 */

import { channelModel, DBChannel } from "../../../Database/schemas/Channel";

export async function getDBChannel(channelID: string) {
  var channel: any = await channelModel
    .findOne({ id: channelID })
    .catch((err) => err as null);

  if (!channel) {
    const canal = new channelModel({
      id: `${channelID}`,
    });
    channel = await canal.save().catch((err) => console.log(err));
  }

  const channnel = channel as DBChannel;

  return channnel;
}
