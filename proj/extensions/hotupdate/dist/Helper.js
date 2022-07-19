"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const Helper_1 = __importDefault(require("./impl/Helper"));
const PACKAGE_NAME = "hotupdate";
class HelperImpl extends Helper_1.default {
    onUpdateCreateProgress(percent) {
        if (this.isDeploy) {
            Editor.Message.send(PACKAGE_NAME, "updateDeployProgress", percent);
        }
        else {
            Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", percent);
        }
    }
    onSetProcess(isProcessing) {
        Editor.Message.send(PACKAGE_NAME, "onSetProcess", isProcessing);
    }
    onSetBuildDir(dir) {
        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", dir);
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
        const config = {
            title: '警告',
            detail: '',
            buttons: ['取消', '确定'],
        };
        const code = await Editor.Dialog.info('执行此操作将会删除不包含在包内的所有bundles,是否继续？', config);
        if (code.response == 1) {
            this.removeNotInApkBundle();
        }
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
            Editor.Message.send("asset-db", "refresh-asset", dbPath);
        }
        else {
            this.logger.error(`${this.module}${configTSPath}不存在，无法刷新配置到代码`);
        }
    }
    onBeforeBuild() {
        this.onUpdateCreateProgress(0);
        this.onSetProcess(true);
    }
    onAfterBuild(dest) {
        this.insertHotupdate(dest);
        this.read(true);
        this.data.buildDir = (0, path_1.normalize)((0, path_1.join)(dest, "assets"));
        this.onSetBuildDir(this.data.buildDir);
        this.save();
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
