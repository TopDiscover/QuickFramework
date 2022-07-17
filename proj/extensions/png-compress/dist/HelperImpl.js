"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const Helper_1 = __importDefault(require("./impl/Helper"));
const PACKAGE_NAME = 'png-compress';
class HelperImpl extends Helper_1.default {
    onStartCompress() {
        Editor.Message.send(PACKAGE_NAME, "onStartCompress");
    }
    onSetBuildDir(path) {
        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", path);
    }
    onUpdateProgess(percent) {
        Editor.Message.send(PACKAGE_NAME, "updateProgess", percent);
    }
    onPngCompressComplete(dest, platfrom) {
        Editor.Message.send("hotupdate", "onPngCompressComplete", dest, platfrom);
    }
    async getAllAssets() {
        return await Editor.Message.request("asset-db", "query-assets");
    }
}
exports.default = HelperImpl;
exports.helper = new HelperImpl();
