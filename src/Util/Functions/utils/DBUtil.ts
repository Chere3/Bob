import { userModel, DBUser } from "../../../Database/schemas/User";
/**
 * @method Obtiene los datos de la base de datos.
 * @param {string} cluster El nombre del cluster.
 * @param {string} database El nombre de la base de datos.
 * @param {string} table El nombre de la collecion
 *
 * @returns {Promise<any>} Una promesa con los datos de la base de datos.
 * @author Cheree
 * @version 1.0.0
 *
 * @example
 * getDB(table)
 */

export async function getUserDB(id: string) {
  const aaa = await userModel.findOne({ id: id }).catch((err) => {});

  if (aaa) {
    return aaa as DBUser;
  } else {
    throw new Error("No se encontro el usuario");
  }
}
