/**
 * @method getDBUser - Get a user from the database
 * @param {string} userID - The user's ID
 * @author Cheree
 * @returns {Promise<DBUser>} El usuario en la base de datos.
 */

import { DBUser, userModel } from "../../Database/schemas/User";

export async function getDBUser(userID: string) {
  var user: any = await userModel
    .findOne({ id: userID })
    .catch((err) => err as null);

  if (!user) {
    const usuario = new userModel({
      id: `${userID}`,
    });
    user = await usuario.save().catch((err) => console.log(err));
  }

  const usser = user as DBUser;

  return usser;
}
