"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinalResult = exports.getIntNumber1 = exports.getD = exports.getRandomDescription = exports.getRandomCategorieImage = exports.sortImages = exports.getDBDescriptions = exports.getDBImages = exports.addImages = exports.addDescription = exports.addImage = exports.checkDescription = exports.checkImage = void 0;
const descriptions_1 = require("../../../Database/schemas/descriptions");
const Images_1 = require("../../../Database/schemas/Images");
const imagesDB_1 = require("../../constants/imagesDB");
const User_1 = require("../../../Database/schemas/User");
const userManager_1 = require("../userManager");
const config_1 = require("../../../config");
const apiUtil_1 = require("../../Functions/utils/apiUtil");
function checkImage(imageURL) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!imageURL)
            throw Error(`La imagen no es válida.`);
        if (imageURL.match(/(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp)/im) == undefined) {
            throw new Error("La imagen no es válida.");
        }
        else if (imageURL.match(/(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png|webp)/im) == null) {
            throw new Error("La imagen no es válida.");
        }
        else {
            return true;
        }
    });
}
exports.checkImage = checkImage;
function checkDescription(desc, force = false) {
    if (force == true)
        return true;
    if (desc.length > 300)
        throw new Error("La descripción es muy larga.");
    if (desc.length < 1)
        throw new Error("La descripción es muy corta.");
    if (desc.match(/{author}/g) == null)
        throw new Error("La descripción no es válida, hace falta el autor del mensaje.");
    if (desc.match(/{user}/g) == null)
        throw new Error("La descripción no es válida, hace falta el usuario recibidor del mensaje.");
    return true;
}
exports.checkDescription = checkDescription;
function addImage(imageURL, imageType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == imageType) == undefined)
            throw new Error("El tipo de imagen no es válido.");
        yield checkImage(imageURL);
        const imagenes = (yield Images_1.imagesModel.findOne({ id: "first" }));
        if (imageType == "hug") {
            const hugs = imagenes.hug;
            hugs.push(imageURL);
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { hug: hugs });
        }
        else if (imageType == "kiss") {
            const kisses = imagenes.kiss;
            kisses.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { kiss: kisses })
                .catch((a) => console.log(a));
        }
        else if (imageType == "pat") {
            const pats = imagenes.pats;
            pats.push(imageURL);
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { pat: pats });
        }
        else if (imageType == "happy") {
            const happy = imagenes.happy;
            happy.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { happy: happy })
                .catch((a) => console.log(a));
        }
        else if (imageType == "sad") {
            const sad = imagenes.sad;
            sad.push(imageURL);
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { sad: sad });
        }
        else if (imageType == "angry") {
            const angry = imagenes.angry;
            angry.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { angry: angry })
                .catch((a) => console.log(a));
        }
        else if (imageType == "love") {
            const love = imagenes.love;
            love.push(imageURL);
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { love: love });
        }
        else if (imageType == "hate") {
            const hate = imagenes.hate;
            hate.push(imageURL);
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { hate: hate });
        }
        else if (imageType == "confused") {
            const confused = imagenes.confused;
            confused.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { confused: confused })
                .catch((a) => console.log(a));
        }
        else if (imageType == "bored") {
            const bored = imagenes.bored;
            bored.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { bored: bored })
                .catch((a) => console.log(a));
        }
        else if (imageType == "scared") {
            const scared = imagenes.scared;
            scared.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { scared: scared })
                .catch((a) => console.log(a));
        }
        else if (imageType == "fucks") {
            const fucks = imagenes.fucks;
            fucks.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { fucks: fucks })
                .catch((a) => console.log(a));
        }
        else if (imageType == "licks") {
            const licks = imagenes.licks;
            licks.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { licks: licks })
                .catch((a) => console.log(a));
        }
        else if (imageType == "sucks") {
            const sucks = imagenes.sucks;
            sucks.push(imageURL);
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { sucks: sucks })
                .catch((a) => console.log(a));
        }
    });
}
exports.addImage = addImage;
function addDescription(desc, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == type) == undefined) {
            throw new Error("El tipo de descripcion no es válido.");
        }
        yield checkDescription(desc);
        const descriptions = (yield descriptions_1.descriptionsModel.findOne({
            id: "first",
        }));
        if (type == "hug") {
            const hugs = descriptions.hug;
            hugs.push(desc);
            return yield descriptions_1.descriptionsModel.findOneAndUpdate({ id: "first" }, { hug: hugs });
        }
        else if (type == "kiss") {
            const kisses = descriptions.kiss;
            kisses.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { kiss: kisses })
                .catch((a) => console.log(a));
        }
        else if (type == "pat") {
            const pat = descriptions.pats;
            pat.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { pats: pat })
                .catch((a) => console.log(a));
        }
        else if (type == "happy") {
            const happy = descriptions.happy;
            happy.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { happy: happy })
                .catch((a) => console.log(a));
        }
        else if (type == "sad") {
            const sad = descriptions.sad;
            sad.push(desc);
            return yield descriptions_1.descriptionsModel.findOneAndUpdate({ id: "first" }, { sad: sad });
        }
        else if (type == "angry") {
            const angry = descriptions.angry;
            angry.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { angry: angry })
                .catch((a) => console.log(a));
        }
        else if (type == "love") {
            const love = descriptions.love;
            love.push(desc);
            return yield descriptions_1.descriptionsModel.findOneAndUpdate({ id: "first" }, { love: love });
        }
        else if (type == "hate") {
            const hate = descriptions.hate;
            hate.push(desc);
            return yield descriptions_1.descriptionsModel.findOneAndUpdate({ id: "first" }, { hate: hate });
        }
        else if (type == "confused") {
            const confused = descriptions.confused;
            confused.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { confused: confused })
                .catch((a) => console.log(a));
        }
        else if (type == "bored") {
            const bored = descriptions.bored;
            bored.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { bored: bored })
                .catch((a) => console.log(a));
        }
        else if (type == "scared") {
            const scared = descriptions.scared;
            scared.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { scared: scared })
                .catch((a) => console.log(a));
        }
        else if (type == "fucks") {
            const fucks = descriptions.fucks;
            fucks.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { fucks: fucks })
                .catch((a) => console.log(a));
        }
        else if (type == "licks") {
            const licks = descriptions.licks;
            licks.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { licks: licks })
                .catch((a) => console.log(a));
        }
        else if (type == "sucks") {
            const sucks = descriptions.sucks;
            sucks.push(desc);
            return yield descriptions_1.descriptionsModel
                .findOneAndUpdate({ id: "first" }, { sucks: sucks })
                .catch((a) => console.log(a));
        }
    });
}
exports.addDescription = addDescription;
function addImages(imagesURL, imageType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == imageType) == undefined)
            throw new Error("El tipo de imagen no es válido.");
        yield imagesURL.map((x) => __awaiter(this, void 0, void 0, function* () {
            yield checkImage(x);
        }));
        const imagenes = (yield Images_1.imagesModel.findOne({ id: "first" }));
        if (imageType == "hug") {
            const hugs = imagenes.hug;
            yield imagesURL.map((x) => hugs.push(x));
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { hug: hugs });
        }
        else if (imageType == "kiss") {
            const kisses = imagenes.kiss;
            yield imagesURL.map((x) => kisses.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { kiss: kisses })
                .catch((a) => console.log(a));
        }
        else if (imageType == "pat") {
            const pat = imagenes.pats;
            yield imagesURL.map((x) => pat.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { pat: pat })
                .catch((a) => console.log(a));
        }
        else if (imageType == "happy") {
            const happy = imagenes.happy;
            yield imagesURL.map((x) => happy.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { happy: happy })
                .catch((a) => console.log(a));
        }
        else if (imageType == "sad") {
            const sad = imagenes.sad;
            yield imagesURL.map((x) => sad.push(x));
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { sad: sad });
        }
        else if (imageType == "angry") {
            const angry = imagenes.angry;
            yield imagesURL.map((x) => angry.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { angry: angry })
                .catch((a) => console.log(a));
        }
        else if (imageType == "love") {
            const love = imagenes.love;
            yield imagesURL.map((x) => love.push(x));
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { love: love });
        }
        else if (imageType == "hate") {
            const hate = imagenes.hate;
            yield imagesURL.map((x) => hate.push(x));
            return yield Images_1.imagesModel.findOneAndUpdate({ id: "first" }, { hate: hate });
        }
        else if (imageType == "confused") {
            const confused = imagenes.confused;
            yield imagesURL.map((x) => confused.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { confused: confused })
                .catch((a) => console.log(a));
        }
        else if (imageType == "bored") {
            const bored = imagenes.bored;
            yield imagesURL.map((x) => bored.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { bored: bored })
                .catch((a) => console.log(a));
        }
        else if (imageType == "scared") {
            const scared = imagenes.scared;
            yield imagesURL.map((x) => scared.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { scared: scared })
                .catch((a) => console.log(a));
        }
        else if (imageType == "fucks") {
            const fucks = imagenes.fucks;
            yield imagesURL.map((x) => fucks.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { fucks: fucks })
                .catch((a) => console.log(a));
        }
        else if (imageType == "licks") {
            const licks = imagenes.licks;
            yield imagesURL.map((x) => licks.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { licks: licks })
                .catch((a) => console.log(a));
        }
        else if (imageType == "sucks") {
            const sucks = imagenes.sucks;
            yield imagesURL.map((x) => sucks.push(x));
            return yield Images_1.imagesModel
                .findOneAndUpdate({ id: "first" }, { sucks: sucks })
                .catch((a) => console.log(a));
        }
    });
}
exports.addImages = addImages;
function getDBImages() {
    return __awaiter(this, void 0, void 0, function* () {
        var imagenes = yield Images_1.imagesModel
            .findOne({ id: "first" })
            .catch((err) => err);
        if (!imagenes) {
            const imageees = new Images_1.imagesModel();
            imagenes = yield imageees.save().catch((err) => console.log(err));
        }
        const a = imagenes;
        return a;
    });
}
exports.getDBImages = getDBImages;
function getDBDescriptions() {
    return __awaiter(this, void 0, void 0, function* () {
        var descriptions = yield descriptions_1.descriptionsModel
            .findOne({ id: "first" })
            .catch((err) => err);
        if (!descriptions) {
            const descriptionees = new descriptions_1.descriptionsModel();
            descriptions = yield descriptionees.save().catch((err) => console.log(err));
        }
        const a = descriptions;
        return a;
    });
}
exports.getDBDescriptions = getDBDescriptions;
function sortImages(imagesURL) {
    return __awaiter(this, void 0, void 0, function* () {
        var ranNums = [], i = imagesURL.length, j = 0;
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranNums.push(imagesURL[j]);
            imagesURL.splice(j, 1);
        }
        return ranNums[0];
    });
}
exports.sortImages = sortImages;
function getRandomCategorieImage(imageType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == imageType) == undefined)
            throw new TypeError("El tipo de imagen no es válido.");
        const imagenes = (yield getDBImages());
        if (imageType == "hug") {
            const hugs = imagenes.hug;
            return yield sortImages(hugs);
        }
        else if (imageType == "kiss") {
            const kisses = imagenes.kiss;
            return yield sortImages(kisses);
        }
        else if (imageType == "pat") {
            const pats = imagenes.pats;
            return yield sortImages(pats);
        }
        else if (imageType == "happy") {
            const happy = imagenes.happy;
            return yield sortImages(happy);
        }
        else if (imageType == "sad") {
            const sad = imagenes.sad;
            return yield sortImages(sad);
        }
        else if (imageType == "angry") {
            const angry = imagenes.angry;
            return yield sortImages(angry);
        }
        else if (imageType == "love") {
            const love = imagenes.love;
            return yield sortImages(love);
        }
        else if (imageType == "hate") {
            const hate = imagenes.hate;
            return yield sortImages(hate);
        }
        else if (imageType == "confused") {
            const confused = imagenes.confused;
            return yield sortImages(confused);
        }
        else if (imageType == "bored") {
            const bored = imagenes.bored;
            return yield sortImages(bored);
        }
        else if (imageType == "scared") {
            const scared = imagenes.scared;
            return yield sortImages(scared);
        }
        else if (imageType == "fucks") {
            const fucks = imagenes.fucks;
            return yield sortImages(fucks);
        }
        else if (imageType == "licks") {
            const licks = imagenes.licks;
            return yield sortImages(licks);
        }
        else if (imageType == "sucks") {
            const sucks = imagenes.sucks;
            return yield sortImages(sucks);
        }
    });
}
exports.getRandomCategorieImage = getRandomCategorieImage;
function getRandomDescription(typeDesc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == typeDesc) == undefined)
            throw new TypeError("El tipo de descripcion no es válido.");
        const imagenes = (yield getDBDescriptions());
        if (typeDesc == "hug") {
            const hugs = imagenes.hug;
            return yield sortImages(hugs);
        }
        else if (typeDesc == "kiss") {
            const kisses = imagenes.kiss;
            return yield sortImages(kisses);
        }
        else if (typeDesc == "pat") {
            const pats = imagenes.pats;
            return yield sortImages(pats);
        }
        else if (typeDesc == "happy") {
            const happy = imagenes.happy;
            return yield sortImages(happy);
        }
        else if (typeDesc == "sad") {
            const sad = imagenes.sad;
            return yield sortImages(sad);
        }
        else if (typeDesc == "angry") {
            const angry = imagenes.angry;
            return yield sortImages(angry);
        }
        else if (typeDesc == "love") {
            const love = imagenes.love;
            return yield sortImages(love);
        }
        else if (typeDesc == "hate") {
            const hate = imagenes.hate;
            return yield sortImages(hate);
        }
        else if (typeDesc == "confused") {
            const confused = imagenes.confused;
            return yield sortImages(confused);
        }
        else if (typeDesc == "bored") {
            const bored = imagenes.bored;
            return yield sortImages(bored);
        }
        else if (typeDesc == "scared") {
            const scared = imagenes.scared;
            return yield sortImages(scared);
        }
        else if (typeDesc == "fucks") {
            const fucks = imagenes.fucks;
            return yield sortImages(fucks);
        }
        else if (typeDesc == "licks") {
            const licks = imagenes.licks;
            return yield sortImages(licks);
        }
        else if (typeDesc == "sucks") {
            const sucks = imagenes.sucks;
            return yield sortImages(sucks);
        }
    });
}
exports.getRandomDescription = getRandomDescription;
function getD(message, typeDesc) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = message.content
            .slice(config_1.config.prefix.length)
            .trim()
            .split(/ +/g)
            .slice(1);
        const desc = yield getRandomDescription(typeDesc);
        if (!args) {
            if (!message.mentions.repliedUser) {
                throw TypeError("NAN_ARGS");
            }
            else {
                const formattedo = desc
                    .replace("{user}", message.mentions.repliedUser.username)
                    .replace("{author}", message.author.username);
                return {
                    desc: formattedo,
                    user: message.mentions.repliedUser,
                    author: message.author,
                };
            }
        }
        const user = yield (0, apiUtil_1.getPerson)(args.join(" "), message);
        if (user == undefined)
            throw TypeError("NAN_USER");
        if (user.id == message.author.id)
            throw TypeError("EQUAL_AUTHOR");
        const formatted = desc
            .replace("{user}", user.username)
            .replace("{author}", message.author.username);
        return {
            desc: formatted,
            user: user,
            author: message.author,
        };
    });
}
exports.getD = getD;
function getIntNumber1(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesDB_1.imagesDB.find((x) => x == type) == undefined)
            throw TypeError("La tipo de interacción no es válida.");
        const user = (yield (0, userManager_1.getDBUser)(id));
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: hugconfig });
            return (yield a).social.hugs;
        }
        else if (type == "kiss") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: kissconfig });
            return (yield a).social.kisses;
        }
        else if (type == "pat") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: patconfig });
            return (yield a).social.pats;
        }
        else if (type == "happy") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: happyconfig });
            return (yield a).social.happy;
        }
        else if (type == "sad") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: sadconfig });
            return (yield a).social.sad;
        }
        else if (type == "angry") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: angryconfig });
            return (yield a).social.angry;
        }
        else if (type == "love") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: loveconfig });
            return (yield a).social.love;
        }
        else if (type == "hate") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: hateconfig });
            return (yield a).social.hate;
        }
        else if (type == "confused") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: confusedconfig });
            return (yield a).social.confused;
        }
        else if (type == "bored") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: boredconfig });
            return (yield a).social.bored;
        }
        else if (type == "scared") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: scaredconfig });
            return (yield a).social.scared;
        }
        else if (type == "fucks") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: fucksconfig });
            return (yield a).social.fucks;
        }
        else if (type == "licks") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: licksconfig });
            return (yield a).social.licks;
        }
        else if (type == "sucks") {
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
            const a = User_1.userModel.findOneAndUpdate({ id: id }, { social: sucksconfig });
            return (yield a).social.sucks;
        }
    });
}
exports.getIntNumber1 = getIntNumber1;
function getFinalResult(message, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const description = yield getD(message, type);
        const image = yield getRandomCategorieImage(type);
        const number2 = yield getIntNumber1(description.user.id, type);
        const authorDB = yield (0, userManager_1.getDBUser)(message.author.id);
        const finalSocialCommand = {
            description: description.desc,
            image: image,
            userS: description.user,
            user: number2 + 1,
            author: authorDB,
        };
        return finalSocialCommand;
    });
}
exports.getFinalResult = getFinalResult;
