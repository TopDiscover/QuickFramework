"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const Helper_1 = __importDefault(require("./impl/Helper"));
const Electron = require("electron");
const PACKAGE_NAME = "hotupdate";
class HelperImpl extends Helper_1.default {
    constructor() {
        super(...arguments);
        this.isDoing = false;
    }
    isSupportUpdate(platform) {
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac" || platform == "win32") {
            return true;
        }
        return false;
    }
    onUpdateCreateProgress(percent) {
        if (this.isDeploy) {
            Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:updateDeployProgress", percent);
        }
        else {
            Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:updateCreateProgress", percent);
        }
    }
    onSetProcess(isProcessing) {
        this.isDoing = isProcessing;
        // Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:onSetProcess", isProcessing);
    }
    onSetBuildDir(dir) {
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:setBuildDir", dir);
    }
    /**
     * @description 添加历史地址
     * @param url
     * */
    addHotAddress(url) {
        if (this.data && this.data.historyIps.indexOf(url) == -1) {
            this.data.historyIps.push(url);
            this.logger.log(`${this.module}{添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    }
    /**@description 删除不包含在包内的bundles */
    async onDelBundles() {
        if (this.isDoing)
            return;
        //弹出提示确定是否需要删除当前的子游戏
        Editor.Panel.open('confirm_del_subgames');
    }
    updateToConfigTS() {
        let configTSPath = (0, path_1.join)(Editor.Project.path, "assets/scripts/common/config/Config.ts");
        if ((0, fs_1.existsSync)(configTSPath)) {
            //更新热更新地址
            let content = (0, fs_1.readFileSync)(configTSPath, "utf-8");
            let serverID = this.data.serverIP;
            let self = this;
            let replace = function () {
                self.logger.log(`${self.module}更新热更新地址为:${serverID}`);
                return arguments[1] + serverID + arguments[3];
            };
            content = content.replace(/(export\s*const\s*HOT_UPDATE_URL\s*=\s*")([\w:/.-]*)(")/g, replace);
            let bundles = [];
            for (let bundle in this.data.includes) {
                let info = this.data.includes[bundle];
                if (info.include) {
                    bundles.push(info.name);
                }
            }
            let bundlesString = JSON.stringify(bundles);
            let replaceIncludes = function () {
                self.logger.log(`${self.module}更新主包包含目录为:${bundlesString}`);
                return arguments[1] + bundlesString + arguments[3];
            };
            content = content.replace(/(export\s*const\s*MIAN_PACK_INCLUDE\s*:\s*string\s*\[\s*\]\s*=\s*)([\[\]"\w,-/]*)(;)/g, replaceIncludes);
            (0, fs_1.writeFileSync)(configTSPath, content, "utf-8");
            let dbPath = "db://assets/scripts/common/config/Config.ts";
            Editor.assetdb.refresh(dbPath, (err) => {
                self.logger.log(`${self.module}刷新成功:${dbPath}`);
            });
        }
        else {
            this.logger.error(`${this.module}${configTSPath}不存在，无法刷新配置到代码`);
        }
    }
    checkBuildDir(fullPath) {
        if ((0, fs_1.existsSync)(fullPath)) {
            //检测是否存在src / assets目录
            let srcPath = path_1.default.join(fullPath, "src");
            srcPath = (0, path_1.normalize)(srcPath);
            let assetsPath = path_1.default.join(fullPath, "assets");
            assetsPath = (0, path_1.normalize)(assetsPath);
            if ((0, fs_1.existsSync)(srcPath) && (0, fs_1.existsSync)(assetsPath)) {
                return true;
            }
        }
        this.logger.log(`${this.module}请先构建项目`);
        return false;
    }
    openDir(dir) {
        if ((0, fs_1.existsSync)(dir)) {
            dir = (0, path_1.normalize)(dir);
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.logger.log(`${this.module}目录不存在 : ${dir}`);
        }
    }
    onBuildFinished(options, callback) {
        if (this.isSupportUpdate(options.platform)) {
            this.insertHotupdate(options.dest);
        }
        callback();
    }
    onBuildStart(options, callback) {
        this.data.buildDir = options.dest;
        if (this.isSupportUpdate(options.platform)) {
            this.logger.warn(`${this.module}如果热更新勾选了【自动生成】或【自动部署】请不要关闭此界面`);
            Editor.Panel.open("hotupdate");
        }
        this.save();
        this.onUpdateCreateProgress(0);
        this.onSetBuildDir(options.dest);
        callback();
    }
    async onPngCompressComplete() {
        this.read(true);
        if (this.data && this.data.autoCreate) {
            await this.createManifest();
            if (this.data.autoDeploy && this.data.remoteDir.length > 0) {
                await this.deployToRemote();
            }
            else {
                this.onSetProcess(false);
            }
        }
        else {
            this.onSetProcess(false);
        }
    }
}
exports.helper = new HelperImpl();
