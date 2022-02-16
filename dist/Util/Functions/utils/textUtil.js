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
exports.parseType = exports.parseEval = exports.parseQuery = exports.separeTexto = void 0;
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
        if (args.startsWith("&")) {
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
