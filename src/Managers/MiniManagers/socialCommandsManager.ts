// @ts-nocheck

import { User } from "@sentry/node";
import { Collection, GuildMember, Message, MessageEmbed, Client} from "discord.js";
import {argsUtil} from "../CommandsManager/NormalCommands/argsUtil";
import emojis from "../../assets/emojis";
import { descriptionsModel } from "../../DB/mongoDBSchemas/API/descriptions";
import { imagesModel } from "../../DB/mongoDBSchemas/API/images";
import { userModel } from "../../DB/mongoDBSchemas/Discord/user";
import { descriptions, images } from "../../Typings/DBInterfaces";
import { botCommand, revisionManager } from "../CommandsManager/NormalCommands/revisionManager";
import { run } from "../CommandsManager/NormalCommands/runManager";
import { DBMain } from "./DBMainManager";
import {inspect} from "util"

export type imagesAPI = | "hug" | "kiss" | "pat" | "happy" | "sad" | "angry" | "love" | "hate" | "confused" | "bored" | "scared" | "fucks" | "licks" | "sucks";
const imagesAPI = ["hug", "kiss", "pat", "happy", "sad", "angry", "love", "hate", "confused", "bored", "scared", "fucks", "licks", "sucks"];

/**
 * The images util for the social commands.
 */
export class imagesUtil {
    /**
     * The constructor is empty
     */
 constructor() {}
 
 /**
  * @method Check if the image is good or not with regex.
  * @property {string} image - The image url to check.
 */

 checkImage(image: string) {
     if (!image || typeof image !== "string") throw Error(`El parametro que has dado en el campo de la URL no es una string o esta vacio.`);
     if (!image.match(/(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp)/im)) throw Error(`La imagen dada por lo visto no es una URL, intentalo de nuevo con una URL, terminada en ".webp" o ".jpg" o "jpeg" o ".png".`);

     return true;
 }

 /**
  * @method Add the image to the db.
  * @property {string} image - The url of the image to add.
  * @property {imagesAPI} - The type of the image.
  */

 async addImage(image: string, type: imagesAPI) {
     if (!image || typeof image !== "string" || !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que has dado son incorrectos, intenta de nuevo con otros parametros.`);
     await this.checkImage(image);

     interface imageR {
         image: string
         category: string[]
         nameOfCategory: string
     }

     const imagenes = (await imagesModel.findOne({id: "first"})) as images;
     const category = imagenes![type];

     category.push(image);
     await imagesModel.findOneAndUpdate({id: "first"}, {[type]: category});

     return {
            image: image,
            category: category,
            nameOfCategory: type
     } as imageR;
}

/**
 * @method Add multiple images to the db.
 * @property {string[]} images - The array of the images to add.
 * @property {imagesAPI} - The type of the images.
 */

    async addImages(images: string[], type: imagesAPI) {
        if (!images || !Array.isArray(images) || !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que has dado son incorrectos, intenta de nuevo con otros parametros.`);
        for (const image of images) {
            await this.checkImage(image);
        }

        interface imageR {
            images: string[]
            category: string[]
            nameOfCategory: string
        }

        const imagenes = (await imagesModel.findOne({id: "first"})) as images;
        const category = imagenes![type];

        for (const image of images) {
            category.push(image);
        }
        await imagesModel.findOneAndUpdate({id: "first"}, {[type]: category});

        return {
            images: images,
            category: category,
            nameOfCategory: type
        } as imageR;
    }

    /**
     * @method gets de images from the db.
     * @property {imagesAPI} - The type of the images.
     */

    async getImages(type?: imagesAPI) {
        if (type && !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que has dado son incorrectos, intenta de nuevo con otros parametros.`);

        const imagenes = (await imagesModel.findOne({id: "first"})) as images;
        const category = type ? imagenes![type] : imagenes;

        return category;
    }

    /**
     * @method sorts the images from the db.
     * @property {string[]} images - The images.
     */

    sortImages(images: string[]) {
        var ranNums = [], i = images.length, j = 0;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranNums.push(images[j]);
            images.splice(j, 1);
        }

        return ranNums[Math.floor(Math.random() * ranNums.length)];
    }

    /**
     * @method gets a random image from the db.
     * @property {imagesAPI} - The type of the images.
     */

    async getRandomImage(type: imagesAPI) {
        if (!type || !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que has dado son incorrectos, intenta de nuevo con otros parametros.`);

        const imagenes = (await imagesModel.findOne({id: "first"})) as images;
        const category = imagenes![type];

        if (!category[0]) return null;

        return this.sortImages(category);
    }
}

/**
 * The description util for the social commands.
 */

export class descripcionUtil extends imagesUtil {
    constructor() {
        super()
    }

    /**
     * @method Check if the description is good or not with regex.
     * @property {string} description - The description to check.
     */

    checkDescription(description: string) {
        if (!description || typeof description !== "string") throw Error(`El parametro que has dado en el campo de la descripcion no es una string o esta vacio.`);
        if (description.length > 300 || description.length < 1) throw Error(`La descripcion dada por lo visto no es correcta, intenta de nuevo con una descripcion de 1 a 300 caracteres.`);
        if (description.match(/{author}/g) == null || description.match(/{user}/g) == null) throw Error(`La descripcion dada por lo visto no es correcta, intenta de nuevo con una descripcion con los tags "{author}" y "{user}".`);

        return true;
    }

    /**
     * @method Add the description to the db.
     * @property {string} description - The description to add.
     * @property {imagesAPI} - The type of the description.
     */

    async addDescription(description: string, type: imagesAPI) {
        if (!type || !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que dado son incorrectos, intenta de nuevo con otros parametros.`);
        await this.checkDescription(description);

        interface descriptionR {
            description: string
            category: string[]
            nameOfCategory: string
        }

        const descripciones = (await descriptionsModel.findOne({id: "first"})) as descriptions;
        const category = descripciones![type];

        category.push(description);
        await descriptionsModel.findOneAndUpdate({id: "first"}, {[type]: category});

        return {
            description: description,
            category: category,
            nameOfCategory: type
        } as descriptionR;
    }

    /**
     * @method gets de descriptions from the db.
     * @property {imagesAPI} - The type of the descriptions.
     */

    async getDescriptions(type?: imagesAPI) {
        if (type && !imagesAPI.find(x => x == type)) throw new Error(`Los parametros que dado son incorrectos, intenta de nuevo con otros parametros.`);

        const descripciones = (await descriptionsModel.findOne({id: "first"})) as descriptions;
        const category = type ? descripciones![type] : descripciones;

        return category;
    }

    /**
     * @method sorts the descriptions from the db.
     * @property {string[]} descriptions - The descriptions.
     */

    sortDescriptions(descriptions: string[]) {
        var ranNums = [], i = descriptions.length, j = 0;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranNums.push(descriptions[j]);
            descriptions.splice(j, 1);
        }

        return ranNums[Math.floor(Math.random() * ranNums.length)];
    }

    /**
     * @method gets a random description from the db.
     * @property {imagesAPI} - The type of the descriptions.
     */

    async getRandomDescription(type: imagesAPI) {
        if (!type || imagesAPI.find(x => x == type) == undefined) throw new Error(`Los parametros que dado son incorrectos, intenta de nuevo con otros parametros.`);

        const descripciones = (await descriptionsModel.findOne({id: "first"})) as descriptions;
        const category = descripciones[type];
        if (!category[0]) return null;

        return this.sortDescriptions(category);
    }
}

/**
 * The util for the numbers of the social commands.
 */

export class numbersUtil extends descripcionUtil {
    constructor() {
        super()
    }

    /**
     * @method Gets the number of the interactions +1 from the db.
     * @property {string} id - The id of the user.
     * @property {string} type - The type of the interactions.
     */

    async getNumber(id: string, type: string) {
        if (!id || !type) throw new Error(`Los parametros que dado son incorrectos, intenta de nuevo con otros parametros.`);

        const user = (await new DBMain().getUser(id));

        if (type == "hug") {
            const hugs = user.social.hugs + 1;
        
            const hugconfig = {
              hugs: hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate({ id: id }, { social: hugconfig });
            return (await a)!.social!.hugs;
          } else if (type == "kiss") {
            const kisses = user.social.kisses + 1;
        
            const kissconfig = {
              hugs: user.social.hugs,
              kisses: kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: kissconfig }
            ) as any;
            return (await a).social.kisses;
          } else if (type == "pat") {
            const pats = user.social.pats + 1;
        
            const patconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: patconfig }
            ) as any;
            return (await a).social.pats;
          } else if (type == "happy") {
            const happy = user.social.happy + 1;
        
            const happyconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: happyconfig }
            ) as any;
            return (await a).social.happy;
          } else if (type == "sad") {
            const sad = user.social.sad + 1;
        
            const sadconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: sadconfig }
            ) as any;
            return (await a).social.sad;
          } else if (type == "angry") {
            const angry = user.social.angry + 1;
        
            const angryconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: angryconfig }
            ) as any;
            return (await a).social.angry;
          } else if (type == "love") {
            const love = user.social.love + 1;
        
            const loveconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: loveconfig }
            ) as any;
            return (await a).social.love;
          } else if (type == "hate") {
            const hate = user.social.hate + 1;
        
            const hateconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: hateconfig }
            ) as any;
            return (await a).social.hate;
          } else if (type == "confused") {
            const confused = user.social.confused + 1;
        
            const confusedconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: confusedconfig }
            ) as any;
            return (await a).social.confused;
          } else if (type == "bored") {
            const bored = user.social.bored + 1;
        
            const boredconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: boredconfig }
            ) as any;
            return (await a).social.bored;
          } else if (type == "scared") {
            const scared = user.social.scared + 1;
        
            const scaredconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: scaredconfig }
            ) as any;
            return (await a).social.scared;
          } else if (type == "fucks") {
            const fucks = user.social.fucks + 1;
        
            const fucksconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: fucks,
              licks: user.social.licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: fucksconfig }
            ) as any;
            return (await a).social.fucks;
          } else if (type == "licks") {
            const licks = user.social.licks + 1;
        
            const licksconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: licks,
              sucks: user.social.sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: licksconfig }
            ) as any;
            return (await a).social.licks;
          } else if (type == "sucks") {
            const sucks = user.social.sucks + 1;
        
            const sucksconfig = {
              hugs: user.social.hugs,
              kisses: user.social.kisses,
              pats: user.social.pats,
              happy: user.social.happy,
              sad: user.social.sad,
              angry: user.social.angry,
              love: user.social.love,
              hate: user.social.hate,
              confused: user.social.confused,
              bored: user.social.bored,
              scared: user.social.scared,
              fucks: user.social.fucks,
              licks: user.social.licks,
              sucks: sucks,
            };
        
            const a = userModel.findOneAndUpdate(
              { id: id },
              { social: sucksconfig }
            ) as any;
            return (await a).social.sucks;
          }
    }
}

/**
 * The main class of the social commands.
 */

export class socialCommandsManager extends numbersUtil {
    command: imagesAPI
    message: Message
    member: GuildMember

    constructor(command: imagesAPI, message: Message, member: GuildMember) {
        super()
        this.command = command
        this.message = message
        this.member = member
    }

    /**
     * @method The method of replace the text of the command.
     */

    async getFinalDescription() {
        interface result {
            desc: string
            author: GuildMember
            user: GuildMember
        }

        const desc = await this.getRandomDescription(this.command) as string
        if (!desc) return {
            desc: null,
            user: this!.member,
            author: this.message.member
        }
        const format = desc.replace(/{user}/g, this.member.displayName).replace(/{author}/g, this.message!.member!.displayName);
        return {
            desc: format,
            user: this.member,
            author: this.message.member
        } as result
    }

    /**
     * @method The main method of the socialCommandsManager class.
     */

    async run(member: GuildMember) {
        try {
        const description = await this.getFinalDescription(), image = await this.getRandomImage(this.command), number = await this.getNumber(this.member.id, this.command), user = await new DBMain().getUser(this.message.author.id);
        const finalEmbed = new MessageEmbed()
        .setAuthor({name: description?.desc ?? "error | error puesto en la base de datos. Solucionando automaticamente...", iconURL: description!.desc == undefined ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZw1gAJL_GHdK3qioyOJsLiwQq4L5D1vy1smBHjzwnh-hp_6Ik1o2lbSxEUZ8AcK96FXA&usqp=CAU" : description!.author.displayAvatarURL() ?? description!.author.user.displayAvatarURL()})
        .setColor(`PURPLE`)
        .setImage(image ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZw1gAJL_GHdK3qioyOJsLiwQq4L5D1vy1smBHjzwnh-hp_6Ik1o2lbSxEUZ8AcK96FXA&usqp=CAU")
        .setFooter({text: number == undefined ? "Error." : `${number}`, iconURL: description!.user.displayAvatarURL() ?? description!.user.user.displayAvatarURL()});

        interface finalSocialCommand {
            desc: string
            image: string
            number: number
            user: GuildMember
            author: GuildMember
            messageEmbed: MessageEmbed
        }

        interface error {
            messageEmbed: MessageEmbed
            error: string
        }

        const embed = new MessageEmbed().setDescription(`${emojis.perro_tonto} *Este comando aun no esta terminado.*`).setColor("PURPLE")

        if (!description && !image) return {
            messageEmbed: embed,
            error: `No se detecto una imagen ni una descripcion en el comando "${this.command}"`
        } as error

        if (!description) return {
            messageEmbed: embed,
            error: `No se detecto una descripcion en el comando "${this.command}"`
        } as error

        if (!image) return {
            messageEmbed: embed,
            error: `No se detecto una imagen en el comando "${this.command}"`
        } as error

        if (this.member.id == this.message.author.id) return {
            messageEmbed: embed.setDescription(`${emojis.perro_tonto} *No puedes hacer este comando a ti mismo.*`),
            error: `No puedes hacer comandos sociales hacia ti mismo.`
        }

        return {
            desc: description.desc,
            image: image,
            number: number,
            user: description.user,
            author: description.author,
            messageEmbed: finalEmbed
        } as finalSocialCommand
        } catch (e) {

          interface error {
            messageEmbed: MessageEmbed
            error: string
        }
            return {
                messageEmbed: new MessageEmbed().setDescription(`${emojis.perro_tonto} *Ha ocurrido un error interno, este sera solucionado pronto.*`).setColor("PURPLE"),
                error: e
            } as error
        }
        
        
    }

    /**
     * @method Injects the social commands into the bot.
     * @param client The client of the bot.
     */
    async injector(client: Client) {
        const q = this; var comandoo; var comandos = global.commands as Collection<string, revisionManager>;
        if (!comandos.has(`hug`)) {}
        for (var comando of imagesAPI) {
            
            const command = new botCommand().setName(comando).setCommandOptions({"expectedArgs": 1, expectedArgsMin: 1, aliases: [comando.slice(0, -1)]}).setInfoOptions({"description": `Comando social (generado automaticamente)`, usage: `${comando} <usuario>`, examples: [`${comando} @user`]});
            class socialCommand extends revisionManager {
                constructor(client: Client) {
                    super(client, command)
                }

                async run(b: run) {
                  b.send(comandoo)
                  const member = await new argsUtil(b.args, b.message).getMember()
                  const a = await new socialCommandsManager(this.name, b.message, member).run(member).catch(a => a)
                  b.send(inspect(a))
                }
            }
            global.commands.set(command.name, new socialCommand(client));
        }
    }
}