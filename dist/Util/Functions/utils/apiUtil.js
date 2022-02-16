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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMember = exports.getColor = exports.SearchUser = exports.getChannel = exports.getPerson = exports.validate = exports.getApiUser = void 0;
const superagent_1 = __importDefault(require("superagent"));
const generalUtil_1 = require("./generalUtil");
function getApiUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!query || query.length == 0)
            throw TypeError(`El segundo argumento tiene que ser una string o número [STRING] or [NUMBER]`);
        if (!query.match(/\d{16,22}$/gi))
            throw TypeError(`${query} no es un snowflake.`);
        const a = yield superagent_1.default
            .get(`https://discord.com/api/v9/users/${query}`)
            .set(`Authorization`, `Bot ${process.env.TOKEN}`)
            .then((x) => x.body)
            .catch(() => {
            throw TypeError(`La id que has dado es invalida.`);
        });
        return a;
    });
}
exports.getApiUser = getApiUser;
function validate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            require.resolve("discord.js");
        }
        catch (error) {
            throw new Error("No se ha encontrado ninguna versión de discord.js en tu carpeta.");
        }
        let checkNodeJSVersion = require("semver").satisfies(process.version, ">=16");
        if (!checkNodeJSVersion) {
            throw new Error("Necesitas la versión de node 16 o más nueva para poder usar esta función.");
        }
        let checkDiscordJSVersion = require("semver").satisfies(require(require
            .resolve("discord.js")
            .replace("src/index.js", "package.json")).version, ">=13.0.0");
        if (!checkDiscordJSVersion) {
            throw new Error("Necesitas la versión 13 de discord o sus parecidos para poder funcionar");
        }
    });
}
exports.validate = validate;
function getPerson(person, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var persona;
        try {
            if (person.startsWith("<@!") ||
                (person.startsWith("<@") && person.endsWith(">"))) {
                const id = person.replace(/[<@!>]/g, "");
                const user = yield message.client.users.fetch(`${id}`, {
                    force: true,
                });
                persona = user;
            }
            else if (person.match(/\d{16,22}$/gi)) {
                const user = yield message.client.users.fetch(`${person}`, {
                    force: true,
                });
                persona = user;
            }
            else if (person.match(/^.{1,32}(#)+\d{4}$/gim)) {
                let finale = yield message.client.users.cache.find((x) => x.tag === person);
                persona = finale;
            }
            else if (person.match(/^.{1,32}$/gi)) {
                let mappingUsername = yield message.client.users.cache
                    .map((x) => x.username)
                    .filter(function (x) {
                    return x != null;
                });
                let similarFound = (0, generalUtil_1.findBestMatch)(person, mappingUsername).bestMatch
                    .target;
                let userRegex = new RegExp(similarFound, "i");
                let finale = yield message.client.users.cache.find((x) => userRegex.test(x.username)
                    ? x.username === similarFound
                    : x.username === similarFound);
                persona = finale;
            }
            else {
                persona = message.mentions.repliedUser;
            }
        }
        catch (error) {
            persona = message.mentions.repliedUser;
        }
        return persona;
    });
}
exports.getPerson = getPerson;
function getChannel(channel, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var canal;
        try {
            if (channel.startsWith("<#") && channel.endsWith(">")) {
                const id = channel.replace(/[<#>]/g, "");
                const canall = yield message.client.channels.fetch(id);
                canal = canall;
            }
            else if (channel.match(/\d{16,22}$/gi)) {
                const canall = yield message.client.channels.fetch(channel);
                canal = canall;
            }
            else if (channel.match(/^.{1,64}$/gi)) {
                let mappingChannel = yield message.client.channels.cache
                    .map((x) => x.name)
                    .filter(function (x) {
                    return x != null;
                });
                let similarFound = (0, generalUtil_1.findBestMatch)(channel, mappingChannel).bestMatch
                    .target;
                let channelRegex = new RegExp(similarFound, "i");
                let finale = yield message.client.channels.cache.find((x) => channelRegex.test(x.name)
                    ? x.name === similarFound
                    : x.name === similarFound);
                canal = finale;
            }
            else {
                canal = null;
            }
        }
        catch (error) {
            canal = null;
        }
        return canal;
    });
}
exports.getChannel = getChannel;
function SearchUser(client, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.constructor.name !== "Client")
            throw TypeError(`El primer argumento tiene que ser el cliente del bot. [CLIENT]`);
        if (!query || query.length == 0)
            throw TypeError(`El segundo argumento tiene que ser una string o número [STRING] or [NUMBER]`);
        yield validate();
        var cache = client.users;
        var final;
        if (query.match(/\d{16,22}$/gi)) {
            let result = yield cache.fetch(query, { force: true }).catch(() => { });
            if (result == undefined) {
                const user = yield getApiUser(`${query}`).catch(() => { });
                if (user !== undefined)
                    final = user;
                else
                    final = null;
            }
            else
                final = result;
        }
        else if (query.startsWith("<@!") ||
            (query.startsWith("<@") && query.endsWith("<"))) {
            const id = query.replace(/[<@!>]/g, "");
            const user = yield client.users.fetch(`${id}`, {
                force: true,
            });
            final = user || null;
        }
        else if (query.match(/^.{1,32}(#)+\d{4}$/gim)) {
            let finale = yield cache.cache.find((x) => x.tag === query);
            final = finale;
        }
        else if (query.match(/^.{1,32}$/gi)) {
            let mappingUsername = yield cache.cache
                .map((x) => x.username)
                .filter(function (x) {
                return x != null;
            });
            let similarFound = (0, generalUtil_1.findBestMatch)(query, mappingUsername).bestMatch.target;
            let userRegex = new RegExp(similarFound, "i");
            let finale = yield cache.cache.find((x) => userRegex.test(x.username)
                ? x.username === similarFound
                : x.username === similarFound);
            final = finale;
        }
        else if (!final) {
            final = null;
        }
        return final;
    });
}
exports.SearchUser = SearchUser;
function getColor(color) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!color)
            throw TypeError(`El primer argumento es obligatorio.`);
        if (typeof color !== "string")
            throw TypeError(`El primer argumento debe de ser el hex color de un color obligatoriamente. [STRING]`);
        if (color.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g)) {
            return `https://singlecolorimage.com/get/${color}/600x240`;
        }
        else {
            throw TypeError(`El color no es válido.`);
        }
    });
}
exports.getColor = getColor;
function getMember(person, message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!person)
            throw TypeError(`El primer argumento es obligatorio.`);
        if (!message)
            throw TypeError(`El segundo argumento es obligatorio.`);
        var persona;
        try {
            if (person.startsWith("<@!") ||
                (person.startsWith("<@") && person.endsWith(">"))) {
                const id = person.replace(/[<@!>]/g, "");
                const user = yield message.guild.members.fetch(`${id}`);
                persona = user;
            }
            else if (person.match(/\d{16,22}$/gi)) {
                const user = yield message.guild.members.fetch(`${person}`);
                persona = user;
            }
            else if (person.match(/^.{1,32}(#)+\d{4}$/gim)) {
                let finale = yield message.guild.members.cache.find((x) => x.user.tag === person);
                persona = finale;
            }
            else if (person.match(/^.{1,32}$/gi)) {
                const a = yield message.guild.members.cache.map(x => x.user.username).filter(x => x != null);
                const b = yield message.guild.members.cache.map(x => x.nickname).filter(x => x != null);
                const one = (0, generalUtil_1.findBestMatch)(person, a).bestMatch.target;
                const two = (0, generalUtil_1.findBestMatch)(person, b).bestMatch.target;
                const reg1 = new RegExp(one, "i");
                const reg2 = new RegExp(two, "i");
                var aa = [];
                aa.push(one, two);
                const best = (0, generalUtil_1.findBestMatch)(person, aa).bestMatch.target;
                var final = yield message.guild.members.cache.find(x => reg1.test(x.user.username) ? x.user.username === best : x.user.username === best);
                var final1 = yield message.guild.members.cache.find(x => reg2.test(x.nickname) ? x.nickname === best : x.nickname === best);
                const uno = ((_a = final === null || final === void 0 ? void 0 : final.user) === null || _a === void 0 ? void 0 : _a.username) || "dhsahjkdhsajkdhsajkdhsajdhjskahdkjsahdkjshadkjhsakdhsakjhdkjsahdjksahdjksagdjhftyeftydfetyfetyetyftysdydsadhjsahdjksahdjskadhsakdhsadsajhdksahdjksahdjksahds";
                const dos = (final1 === null || final1 === void 0 ? void 0 : final1.nickname) || "dsahdjksahdkjsahdjkhsajkdhsajkdhskajdhskjahdksjahdkjsahdkjsahdjshajkdhsjakhdjskahdasjkdhsadyuwydwtyuatydtsayudtuysatduysatduyastduysatyudtysuatdyusatdyusatdyuasd";
                var bb = [];
                bb.push(uno, dos);
                const best1 = (0, generalUtil_1.findBestMatch)(person, bb).bestMatch.target;
                if (best1 === uno)
                    persona = final;
                else
                    persona = final1;
            }
            else {
                persona = message.guild.members.cache.get(message.mentions.repliedUser.id) || null;
            }
        }
        catch (error) {
            persona = message.guild.members.cache.get(message.mentions.repliedUser.id) || null;
        }
        return persona;
    });
}
exports.getMember = getMember;
