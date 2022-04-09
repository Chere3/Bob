import { Collection, Message } from "discord.js";
import { revisionManager } from "../CommandsManager/NormalCommands/revisionManager";
import { socialCommandsManager } from "../MiniManagers/socialCommandsManager";
import { cache } from "./Cache";


/**
 * The main class of the temporal options of the cache.
 */

export class temporalCacheOptions extends cache {
    constructor() {
        super()
    }

    /**
     * @method socialCommandEjected? - Ccheck if the command is ejected from the social commands and turn off or turn on.
     */

    async socialCommandsCenter(message: Message, commandos: Collection<string, revisionManager> ) {
        const commands = global.commands as Collection<string, revisionManager>;
        if (commands.has(`hug`) && this.get().socialCommands == true) return {
            sucess: false, 
            message: "The commands is already pushed."
        }
        if (commands.has(`hug`) && this.get().socialCommands == false) {
            this.set("socialCommands", true)
            return {
                succes: false,
                message: "The command is already ejected."
            }
        }
        if (commands.has(`hug`) == false && this.get().socialCommands == true) {
            this.set("socialCommands", true)
            await new socialCommandsManager("hug", message, null);
            return {
                succes: false,
                message: "The command is already pushed."
            }
        }

    }

}