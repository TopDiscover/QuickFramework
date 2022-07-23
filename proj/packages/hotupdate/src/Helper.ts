import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";
import Helper from "./impl/Helper";
const Electron = require("electron")

const PACKAGE_NAME = "hotupdate";
class HelperImpl extends Helper{

    constructor(){
        super();
        this.logger = Editor;
    }
    
    isDoing = false;

    isSupportUpdate(platform: string) {
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac" || platform == "win32") {
            return true;
        }
        return false;
    }

    onUpdateCreateProgress(percent: number): void {
        if ( this.isDeploy ){
            Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:updateDeployProgress", percent);
        }else{
            Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:updateCreateProgress", percent);
        }
    }

    onSetProcess(isProcessing: boolean): void {
        this.isDoing = isProcessing;
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:onSetProcess", isProcessing);
    }

    onSetBuildDir(dir: string) {
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:setBuildDir", dir);
    }

    onSetVersion(version:string){
        super.onSetVersion(version);
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "hotupdate:onSetVersion", version);
    }

    /**
     * @description 添加历史地址 
     * @param url
     * */
    addHotAddress(url: string) {
        if (this.data && this.data.historyIps.indexOf(url) == -1) {
            this.data.historyIps.push(url);
            this.logger.log(`${this.module}{添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    }

    /**@description 删除不包含在包内的bundles */
    async onDelBundles() {
        if (this.isDoing) return;
        //弹出提示确定是否需要删除当前的子游戏
        Editor.Panel.open('confirm_del_subgames');
    }

    updateToConfigTS() {
        let configTSPath = join(Editor.Project.path, "assets/scripts/common/config/Config.ts");
        if (existsSync(configTSPath)) {
            //更新热更新地址
            let content = readFileSync(configTSPath, "utf-8");
            let serverID = this.data!.serverIP;
            let self = this;
            let replace = function () {
                self.logger.log(`${self.module}更新热更新地址为:${serverID}`);
                return arguments[1] + serverID + arguments[3];
            };
            content = content.replace(/(export\s*const\s*HOT_UPDATE_URL\s*=\s*")([\w:/.-]*)(")/g, replace);

            let replaceAutoVersion = function () {
                self.logger.log(`${self.module}更新是否使用了自动版本:${self.data?.isAutoVersion}`);
                return arguments[1] + self.data?.isAutoVersion;
            };
            content = content.replace(/(export\s*const\s*USE_AUTO_VERSION\s*=\s*)(\w+)/g, replaceAutoVersion);
            writeFileSync(configTSPath, content, "utf-8");
            
            let dbPath = "db://assets/scripts/common/config/Config.ts";
            Editor.assetdb.refresh(dbPath, (err: any) => {
                self.logger.log(`${self.module}刷新成功:${dbPath}`);
            });
        } else {
            this.logger.error(`${this.module}${configTSPath}不存在，无法刷新配置到代码`);
        }
    }

    checkBuildDir(fullPath: string) {
        if (existsSync(fullPath)) {
            //检测是否存在src / assets目录
            let srcPath = path.join(fullPath, "src");
            srcPath = normalize(srcPath);
            let assetsPath = path.join(fullPath, "assets");
            assetsPath = normalize(assetsPath);
            if (existsSync(srcPath) && existsSync(assetsPath)) {
                return true;
            }
        }
        this.logger.log(`${this.module}请先构建项目`);
        return false;
    }

    openDir(dir: string) {
        if (existsSync(dir)) {
            dir = normalize(dir);
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.logger.log(`${this.module}目录不存在 : ${dir}`);
        }
    }

    onBuildFinished(options: BuildOptions, callback: Function) {
        if ( this.isSupportUpdate(options.platform) ){
            this.insertHotupdate(options.dest);
        }
        callback();
    }
    onBuildStart(options: BuildOptions, callback: Function) {
        this.onSetProcess(true);
        this.data!.buildDir = options.dest;
        if ( this.isSupportUpdate(options.platform)) {
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
            } else {
                this.onSetProcess(false);
            }
        } else {
            this.onSetProcess(false);
        }
    }
}

export const helper = new HelperImpl();