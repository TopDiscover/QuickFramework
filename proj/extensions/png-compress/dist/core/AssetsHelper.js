"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 资源辅助类
 */
const fs_1 = require("fs");
const path_1 = require("path");
const Environment_1 = require("./Environment");
const FileUtils_1 = __importDefault(require("./FileUtils"));
const Handler_1 = require("./Handler");
class AssetsHelper extends Handler_1.Handler {
    constructor() {
        super(...arguments);
        this.module = "【AssetsHelper】";
        this._internalInfo = null;
        /**@description 查询到的资源 */
        this.queryAssets = {};
    }
    get libraryPath() {
        return (0, path_1.join)(this.projPath, "proj/library");
    }
    get internalInfoPath() {
        if (Environment_1.Environment.isVersion3X) {
            return (0, path_1.join)(this.projPath, "proj/library/.internal-info.json");
        }
        else {
            return (0, path_1.join)(Environment_1.Environment.creatorPath, "static/default-assets/image");
        }
    }
    /**@description 引擎内部资源 */
    get internalInfo() {
        if (this._internalInfo) {
            return this._internalInfo;
        }
        if (Environment_1.Environment.isVersion3X) {
            let dataStr = (0, fs_1.readFileSync)(this.internalInfoPath, "utf-8");
            let data = JSON.parse(dataStr);
            let keys = Object.keys(data);
            this._internalInfo = new Map();
            keys.forEach(v => {
                let info = {
                    uuid: data[v].uuid,
                    type: "internal",
                    file: v,
                };
                this._internalInfo.set(info.uuid, info);
            });
        }
        else {
            //2.x 直接去安装目录找资源吧
            let info = {
                uuid: "",
                type: "internal",
                file: "",
            };
            this._internalInfo = new Map();
            FileUtils_1.default.instance.getFiles(this.internalInfoPath, (v) => {
                if ((0, path_1.extname)(v.name) == ".meta") {
                    let dataStr = (0, fs_1.readFileSync)(v.path, "utf-8");
                    let data = JSON.parse(dataStr);
                    info.uuid = data.uuid;
                    let temp = (0, path_1.parse)(v.path);
                    info.path = (0, path_1.join)(temp.dir, `${temp.name}`);
                    this._internalInfo.set(info.uuid, info);
                }
                return false;
            });
        }
        return this._internalInfo;
    }
    isPngAsset(type) {
        if (Environment_1.Environment.isVersion3X) {
            if (type == "cc.ImageAsset" || type == "cc.SpriteAtlas") {
                return true;
            }
        }
        else {
            if (type == "cc.Texture2D") {
                return true;
            }
        }
        return false;
    }
    get isMd5() {
        return Environment_1.Environment.build.md5Cache;
    }
    /**
     * @description 返回uuid
     * @param name
     * @returns
     */
    getUUID(name) {
        let ret = (0, path_1.parse)(name);
        if (this.isMd5) {
            ret = (0, path_1.parse)(ret.name);
        }
        return ret.name;
    }
    /**
     * @description library Json 处理
     * @param info
     */
    handleLibraryJson(info) {
        let ext = (0, path_1.extname)(info.name);
        if (ext == ".json") {
            let dataStr = (0, fs_1.readFileSync)(info.path, "utf-8");
            let data = JSON.parse(dataStr);
            let type = data.__type__;
            let result = this.isPngAsset(type);
            if (result) {
                let lib = {
                    ".json": info.path,
                    ".png": "",
                };
                if (!Environment_1.Environment.isVersion3X) {
                    let temp = (0, path_1.parse)(info.path);
                    let pngPath = (0, path_1.join)(temp.dir, `${temp.name}.png`);
                    if ((0, fs_1.existsSync)(pngPath)) {
                        lib[".png"] = pngPath;
                    }
                }
                let uuid = this.getUUID(info.name);
                let _info = {
                    uuid: uuid,
                    type: type,
                    library: lib,
                };
                this.queryAssets[_info.uuid] = _info;
            }
        }
    }
    /**
     * @description library Png 处理
     * @param info
     */
    handleLibraryPng(info) {
        let ext = (0, path_1.extname)(info.name);
        if (ext == ".png") {
            let uuid = this.getUUID(info.name);
            if (!this.internalInfo.has(uuid)) {
                let obj = this.queryAssets[uuid];
                if (obj && obj.library) {
                    obj.library[".png"] = info.path;
                }
            }
        }
    }
    /**
     * @description Assets 目录还原png的路径
     * @param info
     */
    handleAssetsMate(info) {
        let ext = (0, path_1.extname)(info.name);
        if (ext == ".meta") {
            let reslut = (0, path_1.parse)(info.name);
            reslut = (0, path_1.parse)(reslut.name);
            if (reslut.ext == ".png") {
                let dataStr = (0, fs_1.readFileSync)(info.path, "utf-8");
                let data = JSON.parse(dataStr);
                let uuid = data.uuid;
                if (!this.internalInfo.has(uuid)) {
                    let obj = this.queryAssets[uuid];
                    if (obj) {
                        reslut = (0, path_1.parse)(info.path);
                        obj.file = (0, path_1.join)(reslut.dir, reslut.name);
                        obj.path = obj.file;
                    }
                }
            }
            else if (reslut.ext == ".pac") {
                //自动图集
                let dataStr = (0, fs_1.readFileSync)(info.path, "utf-8");
                let data = JSON.parse(dataStr);
                let uuid = data.uuid;
                if (!this.internalInfo.has(uuid)) {
                    let obj = this.queryAssets[uuid];
                    if (obj) {
                        reslut = (0, path_1.parse)(info.path);
                        obj.file = (0, path_1.join)(reslut.dir, reslut.name);
                        obj.path = obj.file;
                    }
                }
            }
        }
    }
    async getAssets() {
        this.queryAssets = {};
        this.logger.log(`${this.module} ${this.libraryPath}`);
        FileUtils_1.default.instance.getFiles(this.libraryPath, (info) => {
            this.handleLibraryJson(info);
            if (Environment_1.Environment.isVersion3X) {
                this.handleLibraryPng(info);
            }
            return false;
        });
        FileUtils_1.default.instance.getFiles(this.assetsDBPath, (info) => {
            this.handleAssetsMate(info);
            return false;
        });
        // writeFileSync(join(__dirname,"../../test.json"),JSON.stringify(this.queryAssets))
        let values = Object.values(this.queryAssets);
        // writeFileSync(join(__dirname,"../../test.json"),JSON.stringify(values))
        return values;
    }
}
exports.default = AssetsHelper;
