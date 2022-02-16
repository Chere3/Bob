"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.handlers = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function handlers(TempoClient) {
    (function handleCommands(dir = "../../Commands") {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield fs.readdir(path.join(__dirname, dir));
            for (let file of files) {
                let stat = yield fs.lstat(path.join(__dirname, dir, file));
                if (stat.isDirectory()) {
                    handleCommands(path.join(dir, file));
                }
                else {
                    if (file.endsWith(".ts")) {
                        let { default: Class } = yield Promise.resolve().then(() => __importStar(require(path.join(__dirname, dir, file))));
                        try {
                            let CommandClass = new Class(TempoClient);
                            TempoClient.commands.set(CommandClass.name, CommandClass);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        });
    })();
    (function handleSlashCommands(dir = "../../slash-commands") {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield fs.readdir(path.join(__dirname, dir));
            for (let file of files) {
                let stat = yield fs.lstat(path.join(__dirname, dir, file));
                if (stat.isDirectory()) {
                    handleSlashCommands(path.join(dir, file));
                }
                else {
                    if (file.endsWith(".ts")) {
                        let { default: Class } = yield Promise.resolve().then(() => __importStar(require(path.join(__dirname, dir, file))));
                        try {
                            let slashCommandClass = new Class(TempoClient);
                            TempoClient.slashCommands.set(slashCommandClass.name, slashCommandClass);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        });
    })();
    (function handleEvents(dir = "../../Events") {
        return __awaiter(this, void 0, void 0, function* () {
            let files = yield fs.readdir(path.join(__dirname, dir));
            for (let file of files) {
                let stat = yield fs.lstat(path.join(__dirname, dir, file));
                if (stat.isDirectory()) {
                    handleEvents(path.join(dir, file));
                }
                else {
                    if (!file.endsWith(".ts"))
                        return;
                    let eventName = file.substring(0, file.indexOf(".ts"));
                    try {
                        let event = yield Promise.resolve().then(() => __importStar(require(path.join(__dirname, dir, file))));
                        TempoClient.on(eventName, event.run.bind(null, TempoClient));
                    }
                    catch (err) {
                        console.log(`Hey, ocurrio un error tranado de iniciar el evento: ${eventName}`);
                        console.log(err);
                    }
                }
            }
        });
    })();
}
exports.handlers = handlers;
