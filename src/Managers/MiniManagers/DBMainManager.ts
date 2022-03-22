import { userModel } from "../../DB/mongoDBSchemas/Discord/user";
import { DBUser } from "../../Typings/DBInterfaces";

export class DBMain {
    /**
     * @method gets a user from the db.
     * @property {string} id - The id of the user.
     */

    async getUser(id: string) {
        var user: any = await userModel.findOne({id: id}).catch(err => err as null);
        if (!user) {
            const usuario = new userModel({id: id});
            user = await usuario.save().catch(err => global.consola.error(err));
        }

        const us = user as DBUser; return us
    }
}