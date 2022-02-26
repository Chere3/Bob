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
exports.timeDifference = exports.parseType = exports.parseEval = exports.parseQuery = exports.separeTexto = void 0;
function separeTexto(texto, digitos) {
    let textoSeparado = [];
    let textoSeparadoTemp = "";
    let contador = 0;
    for (let i = 0; i < texto.length; i++) {
        textoSeparadoTemp += texto[i];
        contador++;
        if (contador === digitos) {
            textoSeparado.push(textoSeparadoTemp);
            textoSeparadoTemp = "";
            contador = 0;
        }
    }
    if (textoSeparadoTemp !== "") {
        textoSeparado.push(textoSeparadoTemp);
    }
    return textoSeparado;
}
exports.separeTexto = separeTexto;
function parseQuery(queries) {
    const query = [];
    const flags = [];
    for (const args of queries) {
        if (args.startsWith("#")) {
            flags.push(args.slice(2).toLowerCase());
        }
        else {
            query.push(args);
        }
    }
    return { query, flags };
}
exports.parseQuery = parseQuery;
function parseEval(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPromise = query instanceof Promise &&
            typeof query.then == "function" &&
            typeof query.catch == "function";
        if (isPromise) {
            query = yield query;
            return {
                evaled: query,
                type: `Promise<${parseType(query)}>`,
            };
        }
        return { evaled: query, type: parseType(query) };
    });
}
exports.parseEval = parseEval;
function parseType(query) {
    if (query instanceof Buffer) {
        let length = Math.round(query.length / 1024 / 1024);
        let ic = "MB";
        if (!length) {
            length = Math.round(query.length / 1024);
            ic = "KB";
        }
        if (!length) {
            length = Math.round(query.length);
            ic = "Bytes";
        }
        return `Buffer(${length} ${ic})`;
    }
    return query === null || query === undefined
        ? "void"
        : query.constructor.name;
}
exports.parseType = parseType;
function timeDifference(time1, time2) {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var year = day * 365;
    var decade = year * 10;
    var century = year * 100;
    var millenium = year * 1000;
    var delta = time1 - time2;
    if (delta < second)
        return "Justo ahora.";
    if (delta < minute)
        return `hace ${Math.round(delta / second)} segundos.`;
    if (delta < hour)
        return `hace ${Math.round(delta / minute)} minutos.`;
    if (delta < day)
        return `hace ${Math.round(delta / hour)} horas.`;
    if (delta < week)
        return `hace ${Math.round(delta / day)} días.`;
    if (delta < month)
        return `hace ${Math.round(delta / week)} semanas.`;
    if (delta < year)
        return `hace ${Math.round(delta / month)} meses.`;
    if (delta < decade)
        return `hace ${Math.round(delta / year)} años.`;
    if (delta < century)
        return `hace ${Math.round(delta / decade)} décadas.`;
    if (delta < millenium)
        return `hace ${Math.round(delta / century)} siglos.`;
}
exports.timeDifference = timeDifference;
