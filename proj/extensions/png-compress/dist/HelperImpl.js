"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const Helper_1 = __importDefault(require("./impl/Helper"));
const BuilderHelper_1 = __importDefault(require("./core/BuilderHelper"));
const PACKAGE_NAME = 'png-compress';
class HelperImpl extends Helper_1.default {
    set dest(v) {
        this._dest = v;
        BuilderHelper_1.default.instance.read();
        BuilderHelper_1.default.instance.data.dest = v;
        BuilderHelper_1.default.instance.save();
    }
    get dest() {
        BuilderHelper_1.default.instance.read();
        return BuilderHelper_1.default.instance.data.dest;
    }
    set platform(v) {
        this._platform = v;
        BuilderHelper_1.default.instance.read();
        BuilderHelper_1.default.instance.data.platform = v;
        BuilderHelper_1.default.instance.save();
    }
    get platform() {
        BuilderHelper_1.default.instance.read();
        return BuilderHelper_1.default.instance.data.platform;
    }
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
        BuilderHelper_1.default.instance.read(true);
        BuilderHelper_1.default.instance.data.dest = dest;
        BuilderHelper_1.default.instance.data.platform = platfrom;
        BuilderHelper_1.default.instance.save();
        Editor.Message.send("hotupdate", "onPngCompressComplete", dest, platfrom);
    }
    async getAllAssets() {
        return await Editor.Message.request("asset-db", "query-assets");
    }
}
exports.default = HelperImpl;
exports.helper = new HelperImpl();
