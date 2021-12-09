import { Message, User } from "discord.js";
import {
  descriptions,
  descriptionsModel,
} from "../../../../Database/schemas/descriptions";
import { images, imagesModel } from "../../../../Database/schemas/Images";
import { imagesDB } from "../../../constants/imagesDB";
import { social, DBUser, userModel } from "../../../../Database/schemas/User";
import { getDBUser } from "../userManager";
import { config } from "../../../../config";
import { getPerson } from "../../utils/apiUtil";

/**
 * @function checkImage - Checa si la imagen dada es válida.
 * @param {string} imageURL - Checa si la imagen pertenece a un link de imagen válido.
 * @returns {boolean} - Devuelve true si la imagen es válida, error si no la es.
 * @author Cheree
 * @version 1.0.0
 * @example
 * checkImage('https://i.imgur.com/w3duR07.jpg');
 */

export async function checkImage(imageURL: string) {
  if (!imageURL) throw Error(`La imagen no es válida.`);
  if (
    imageURL.match(
      /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp)/im
    ) == undefined
  ) {
    throw new Error("La imagen no es válida.");
  } else if (
    imageURL.match(
      /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp)/im
    ) == null
  ) {
    throw new Error("La imagen no es válida.");
  } else {
    return true;
  }
}

/**
 * @function checkDescription - Checa si la descripción dada es válida.
 * @param {string} description - Checa si la descripción es válida.
 * @returns {boolean} - Devuelve true si la descripción es válida, error si no la es.
 * @author Cheree
 * @version 1.0.0
 * @example
 * checkDescription('{author} Le ha dado un cálido abrazo a {user}');
 */

export function checkDescription(desc: string, force: boolean = false) {
  if (force == true) return true;

  if (desc.length > 300) throw new Error("La descripción es muy larga.");
  if (desc.length < 1) throw new Error("La descripción es muy corta.");
  if (desc.match(/{author}/g) == null)
    throw new Error(
      "La descripción no es válida, hace falta el autor del mensaje."
    );
  if (desc.match(/{user}/g) == null)
    throw new Error(
      "La descripción no es válida, hace falta el usuario recibidor del mensaje."
    );

  return true;
}

/**
 * @function addImage - Agrega una imagen a la base de datos.
 * @param {string} imageURL - URL de la imagen a agregar.
 * @param {imagesDB} imageType - Tipo de imagen a agregar.
 * @returns {images} - Devuelve la base de datos con todas las imagenes.
 * @author Cheree
 * @version 1.0.0
 * @example
 * addImage('https://i.imgur.com/w3duR07.jpg', 'hug');
 */

export async function addImage(imageURL: string, imageType: imagesDB) {
  if (imagesDB.find((x) => x == imageType) == undefined)
    throw new Error("El tipo de imagen no es válido.");
  await checkImage(imageURL);

  const imagenes = (await imagesModel.findOne({ id: "first" })) as images;

  if (imageType == "hug") {
    const hugs = imagenes.hug;
    hugs.push(imageURL);

    return await imagesModel.findOneAndUpdate({ id: "first" }, { hug: hugs });
  } else if (imageType == "kiss") {
    const kisses = imagenes.kiss;
    kisses.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { kiss: kisses })
      .catch((a) => console.log(a));
  } else if (imageType == "pat") {
    const pats = imagenes.pats;
    pats.push(imageURL);

    return await imagesModel.findOneAndUpdate({ id: "first" }, { pat: pats });
  } else if (imageType == "happy") {
    const happy = imagenes.happy;
    happy.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { happy: happy })
      .catch((a) => console.log(a));
  } else if (imageType == "sad") {
    const sad = imagenes.sad;
    sad.push(imageURL);

    return await imagesModel.findOneAndUpdate({ id: "first" }, { sad: sad });
  } else if (imageType == "angry") {
    const angry = imagenes.angry;
    angry.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { angry: angry })
      .catch((a) => console.log(a));
  } else if (imageType == "love") {
    const love = imagenes.love;
    love.push(imageURL);

    return await imagesModel.findOneAndUpdate({ id: "first" }, { love: love });
  } else if (imageType == "hate") {
    const hate = imagenes.hate;
    hate.push(imageURL);

    return await imagesModel.findOneAndUpdate({ id: "first" }, { hate: hate });
  } else if (imageType == "confused") {
    const confused = imagenes.confused;
    confused.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { confused: confused })
      .catch((a) => console.log(a));
  } else if (imageType == "bored") {
    const bored = imagenes.bored;
    bored.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { bored: bored })
      .catch((a) => console.log(a));
  } else if (imageType == "scared") {
    const scared = imagenes.scared;
    scared.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { scared: scared })
      .catch((a) => console.log(a));
  } else if (imageType == "fucks") {
    const fucks = imagenes.fucks;
    fucks.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { fucks: fucks })
      .catch((a) => console.log(a));
  } else if (imageType == "licks") {
    const licks = imagenes.licks;
    licks.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { licks: licks })
      .catch((a) => console.log(a));
  } else if (imageType == "sucks") {
    const sucks = imagenes.sucks;
    sucks.push(imageURL);

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { sucks: sucks })
      .catch((a) => console.log(a));
  }
}

/**
 * @method addDescription - Agrega una descripcion a la base de datos.
 * @param {string} description - Descripcion a agregar.
 * @param {imagesDB} imageType - Tipo de descripcion a agregar.
 * @returns {descriptions} - Base de datos de las descripciones.
 * @author Cheree
 * @version 1.0.0
 * @example
 * addDescription("{author} fue a los calidos brazos de {user} para recibir un abrazo!")
 */

export async function addDescription(desc: string, type: imagesDB) {
  if (imagesDB.find((x) => x == type) == undefined) {
    throw new Error("El tipo de descripcion no es válido.");
  }
  await checkDescription(desc);

  const descriptions = (await descriptionsModel.findOne({
    id: "first",
  })) as descriptions;

  if (type == "hug") {
    const hugs = descriptions.hug;
    hugs.push(desc);

    return await descriptionsModel.findOneAndUpdate(
      { id: "first" },
      { hug: hugs }
    );
  } else if (type == "kiss") {
    const kisses = descriptions.kiss;
    kisses.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { kiss: kisses })
      .catch((a) => console.log(a));
  } else if (type == "pat") {
    const pat = descriptions.pats;
    pat.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { pats: pat })
      .catch((a) => console.log(a));
  } else if (type == "happy") {
    const happy = descriptions.happy;
    happy.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { happy: happy })
      .catch((a) => console.log(a));
  } else if (type == "sad") {
    const sad = descriptions.sad;
    sad.push(desc);

    return await descriptionsModel.findOneAndUpdate(
      { id: "first" },
      { sad: sad }
    );
  } else if (type == "angry") {
    const angry = descriptions.angry;
    angry.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { angry: angry })
      .catch((a) => console.log(a));
  } else if (type == "love") {
    const love = descriptions.love;
    love.push(desc);

    return await descriptionsModel.findOneAndUpdate(
      { id: "first" },
      { love: love }
    );
  } else if (type == "hate") {
    const hate = descriptions.hate;
    hate.push(desc);

    return await descriptionsModel.findOneAndUpdate(
      { id: "first" },
      { hate: hate }
    );
  } else if (type == "confused") {
    const confused = descriptions.confused;
    confused.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { confused: confused })
      .catch((a) => console.log(a));
  } else if (type == "bored") {
    const bored = descriptions.bored;
    bored.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { bored: bored })
      .catch((a) => console.log(a));
  } else if (type == "scared") {
    const scared = descriptions.scared;
    scared.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { scared: scared })
      .catch((a) => console.log(a));
  } else if (type == "fucks") {
    const fucks = descriptions.fucks;
    fucks.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { fucks: fucks })
      .catch((a) => console.log(a));
  } else if (type == "licks") {
    const licks = descriptions.licks;
    licks.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { licks: licks })
      .catch((a) => console.log(a));
  } else if (type == "sucks") {
    const sucks = descriptions.sucks;
    sucks.push(desc);

    return await descriptionsModel
      .findOneAndUpdate({ id: "first" }, { sucks: sucks })
      .catch((a) => console.log(a));
  }
}

/**
 * @method addImages - Agrega varias imagenes a la base de datos.
 * @param {string[]} imagesURL - Array de URLs de las imagenes a agregar.
 * @param {imagesDB} imageType - Tipo de imagen a agregar.
 * @returns {images} - Devuelve la base de datos con todas las imagenes.
 * @author Cheree
 * @version 1.0.0
 * @example
 * addImages(['https://i.imgur.com/w3duR07.jpg', 'https://i.imgur.com/w3duR07.jpg'], 'hug');
 */

export async function addImages(imagesURL: string[], imageType: imagesDB) {
  if (imagesDB.find((x) => x == imageType) == undefined)
    throw new Error("El tipo de imagen no es válido.");

  await imagesURL.map(async (x) => {
    await checkImage(x);
  });

  const imagenes = (await imagesModel.findOne({ id: "first" })) as images;

  if (imageType == "hug") {
    const hugs = imagenes.hug;
    await imagesURL.map((x) => hugs.push(x));

    return await imagesModel.findOneAndUpdate({ id: "first" }, { hug: hugs });
  } else if (imageType == "kiss") {
    const kisses = imagenes.kiss;
    await imagesURL.map((x) => kisses.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { kiss: kisses })
      .catch((a) => console.log(a));
  } else if (imageType == "pat") {
    const pat = imagenes.pats;
    await imagesURL.map((x) => pat.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { pat: pat })
      .catch((a) => console.log(a));
  } else if (imageType == "happy") {
    const happy = imagenes.happy;
    await imagesURL.map((x) => happy.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { happy: happy })
      .catch((a) => console.log(a));
  } else if (imageType == "sad") {
    const sad = imagenes.sad;
    await imagesURL.map((x) => sad.push(x));

    return await imagesModel.findOneAndUpdate({ id: "first" }, { sad: sad });
  } else if (imageType == "angry") {
    const angry = imagenes.angry;
    await imagesURL.map((x) => angry.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { angry: angry })
      .catch((a) => console.log(a));
  } else if (imageType == "love") {
    const love = imagenes.love;
    await imagesURL.map((x) => love.push(x));

    return await imagesModel.findOneAndUpdate({ id: "first" }, { love: love });
  } else if (imageType == "hate") {
    const hate = imagenes.hate;
    await imagesURL.map((x) => hate.push(x));

    return await imagesModel.findOneAndUpdate({ id: "first" }, { hate: hate });
  } else if (imageType == "confused") {
    const confused = imagenes.confused;
    await imagesURL.map((x) => confused.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { confused: confused })
      .catch((a) => console.log(a));
  } else if (imageType == "bored") {
    const bored = imagenes.bored;
    await imagesURL.map((x) => bored.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { bored: bored })
      .catch((a) => console.log(a));
  } else if (imageType == "scared") {
    const scared = imagenes.scared;
    await imagesURL.map((x) => scared.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { scared: scared })
      .catch((a) => console.log(a));
  } else if (imageType == "fucks") {
    const fucks = imagenes.fucks;
    await imagesURL.map((x) => fucks.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { fucks: fucks })
      .catch((a) => console.log(a));
  } else if (imageType == "licks") {
    const licks = imagenes.licks;
    await imagesURL.map((x) => licks.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { licks: licks })
      .catch((a) => console.log(a));
  } else if (imageType == "sucks") {
    const sucks = imagenes.sucks;
    await imagesURL.map((x) => sucks.push(x));

    return await imagesModel
      .findOneAndUpdate({ id: "first" }, { sucks: sucks })
      .catch((a) => console.log(a));
  }
}

/**
 * @method getImages - Get imagenes
 * @author Cheree
 * @returns {Promise<DBUser>}Las imagenes en la base de datos
 */

export async function getDBImages() {
  var imagenes: any = await imagesModel
    .findOne({ id: "first" })
    .catch((err) => err as null);

  if (!imagenes) {
    const imageees = new imagesModel();
    imagenes = await imageees.save().catch((err) => console.log(err));
  }

  const a = imagenes as images;

  return a;
}

/**
 * @method getDescriptions - Get descripciones
 * @author Cheree
 * @returns {Promise<images>} Las descripciones en la base de datos
 */

export async function getDBDescriptions() {
  var descriptions: any = await descriptionsModel
    .findOne({ id: "first" })
    .catch((err) => err as null);

  if (!descriptions) {
    const descriptionees = new descriptionsModel();
    descriptions = await descriptionees.save().catch((err) => console.log(err));
  }

  const a = descriptions as descriptions;

  return a;
}

/**
 * @method sortImages - Usa un algoritmo avanzado de algoritmos genéticos para ordenar las imagenes.
 * @param {string[]} - Array de URLs de las imagenes a ordenar.
 * @returns Una imagen aleatoria de ese grupo de imagenes.
 */

export async function sortImages(imagesURL: string[]) {
  var ranNums = [],
    i = imagesURL.length,
    j = 0;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    ranNums.push(imagesURL[j]);
    imagesURL.splice(j, 1);
  }

  return ranNums[0];
}

/**
 * @method getRandomCategorieImage - Devuelve una imagen aleatoria de una categoria.
 * @param {imagesDB} - La categoria de la imagen.
 * @returns {string} La URL de la imagen.
 * @example
 * getRandomCategorieImage("hug");
 */

export async function getRandomCategorieImage(imageType: imagesDB) {
  if (imagesDB.find((x) => x == imageType) == undefined)
    throw new TypeError("El tipo de imagen no es válido.");

  const imagenes = (await getDBImages()) as images;

  if (imageType == "hug") {
    const hugs = imagenes.hug;
    return await sortImages(hugs);
  } else if (imageType == "kiss") {
    const kisses = imagenes.kiss;
    return await sortImages(kisses);
  } else if (imageType == "pat") {
    const pats = imagenes.pats;
    return await sortImages(pats);
  } else if (imageType == "happy") {
    const happy = imagenes.happy;
    return await sortImages(happy);
  } else if (imageType == "sad") {
    const sad = imagenes.sad;
    return await sortImages(sad);
  } else if (imageType == "angry") {
    const angry = imagenes.angry;
    return await sortImages(angry);
  } else if (imageType == "love") {
    const love = imagenes.love;
    return await sortImages(love);
  } else if (imageType == "hate") {
    const hate = imagenes.hate;
    return await sortImages(hate);
  } else if (imageType == "confused") {
    const confused = imagenes.confused;
    return await sortImages(confused);
  } else if (imageType == "bored") {
    const bored = imagenes.bored;
    return await sortImages(bored);
  } else if (imageType == "scared") {
    const scared = imagenes.scared;
    return await sortImages(scared);
  } else if (imageType == "fucks") {
    const fucks = imagenes.fucks;
    return await sortImages(fucks);
  } else if (imageType == "licks") {
    const licks = imagenes.licks;
    return await sortImages(licks);
  } else if (imageType == "sucks") {
    const sucks = imagenes.sucks;
    return await sortImages(sucks);
  }
}

/**
 * @method getRandomDescription - Devuelve una descripcion aleatoria.
 * @returns {string} El tipo de descripcion.
 * @example
 * getRandomDescription("hug");
 * @author Cheree
 */

export async function getRandomDescription(typeDesc: imagesDB) {
  if (imagesDB.find((x) => x == typeDesc) == undefined)
    throw new TypeError("El tipo de descripcion no es válido.");

  const imagenes = (await getDBDescriptions()) as descriptions;

  if (typeDesc == "hug") {
    const hugs = imagenes.hug;
    return await sortImages(hugs);
  } else if (typeDesc == "kiss") {
    const kisses = imagenes.kiss;
    return await sortImages(kisses);
  } else if (typeDesc == "pat") {
    const pats = imagenes.pats;
    return await sortImages(pats);
  } else if (typeDesc == "happy") {
    const happy = imagenes.happy;
    return await sortImages(happy);
  } else if (typeDesc == "sad") {
    const sad = imagenes.sad;
    return await sortImages(sad);
  } else if (typeDesc == "angry") {
    const angry = imagenes.angry;
    return await sortImages(angry);
  } else if (typeDesc == "love") {
    const love = imagenes.love;
    return await sortImages(love);
  } else if (typeDesc == "hate") {
    const hate = imagenes.hate;
    return await sortImages(hate);
  } else if (typeDesc == "confused") {
    const confused = imagenes.confused;
    return await sortImages(confused);
  } else if (typeDesc == "bored") {
    const bored = imagenes.bored;
    return await sortImages(bored);
  } else if (typeDesc == "scared") {
    const scared = imagenes.scared;
    return await sortImages(scared);
  } else if (typeDesc == "fucks") {
    const fucks = imagenes.fucks;
    return await sortImages(fucks);
  } else if (typeDesc == "licks") {
    const licks = imagenes.licks;
    return await sortImages(licks);
  } else if (typeDesc == "sucks") {
    const sucks = imagenes.sucks;
    return await sortImages(sucks);
  }
}

/**
 * @method getD - Devuelve una descripcion aleatoria con los usuarios y todo formateado.
 * @param {Message} - El mensaje del que se esta sacando la información para el comando.
 * @param {imagesDB} - El tipo de descripcion.
 * @returns {string} La descripcion.
 * @example
 * getD(message, "hug");
 * @author Cheree
 * @version 1.0.0
 */

export async function getD(message: Message, typeDesc: imagesDB) {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g)
    .slice(1);

  interface result {
    desc: string;
    user?: User | null | undefined;
    author?: User | null | undefined;
  }

  const desc = await getRandomDescription(typeDesc);

  if (!args) {
    if (!message.mentions.repliedUser) {
      throw TypeError("NAN_ARGS");
    } else {
      const formattedo = desc
        .replace("{user}", message.mentions.repliedUser.username)
        .replace("{author}", message.author.username);
      return {
        desc: formattedo,
        user: message.mentions.repliedUser,
        author: message.author,
      } as result;
    }
  }
  const user = await getPerson(args.join(" "), message);

  if (user == undefined) throw TypeError("NAN_USER");
  if (user.id == message.author.id) throw TypeError("EQUAL_AUTHOR");

  const formatted = desc
    .replace("{user}", user.username)
    .replace("{author}", message.author.username);

  return {
    desc: formatted,
    user: user,
    author: message.author,
  } as result;
}

/**
 * @method getIntNumber1 - Devuelve el numero de la interaccion más la suma de una.
 * @param {id} - El id del usuario.
 * @returns {number} El numero de la interaccion mas uno.
 * @example
 * getIntNumber1(id);
 * @author Cheree
 * @version 1.0.0
 */
export async function getIntNumber1(id: string, type: imagesDB) {
  if (imagesDB.find((x) => x == type) == undefined)
    throw TypeError("La tipo de interacción no es válida.");

  const user = (await getDBUser(id)) as DBUser;

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
    return (await a).social.hugs;
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

/**
 * @method getFinalResult - Devuelve una imagen aleatoria con los usuarios y todo formateado.
 * @param {Message} - El mensaje del que se esta sacando la información para el comando.
 * @param {imagesDB} - El tipo de imagen.
 * @returns {string} Todos los datos.
 * @example
 * getFinalResult(message, "hug");
 * @author Cheree
 * @version 1.0.0
 */

export async function getFinalResult(message: Message, type: imagesDB) {
  const description = await getD(message, type);
  const image = await getRandomCategorieImage(type);
  const number2 = await getIntNumber1(description.user.id, type);
  const authorDB = await getDBUser(message.author.id);

  interface finalSocialCommand {
    description: string;
    image: string;
    userS: User;
    user: number;
    author: DBUser;
  }

  const finalSocialCommand = {
    description: description.desc,
    image: image,
    userS: description.user,
    user: number2 + 1,
    author: authorDB,
  };

  return finalSocialCommand as finalSocialCommand;
}
