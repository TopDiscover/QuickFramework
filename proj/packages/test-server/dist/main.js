"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.unload = exports.load = void 0;
const Helper_1 = __importDefault(require("./impl/Helper"));
function load() {
}
exports.load = load;
function unload() {
}
exports.unload = unload;
exports.messages = {
    startServer: () => {
        const helper = new Helper_1.default();
        helper.logger = Editor;
        helper.start();
    }
};
