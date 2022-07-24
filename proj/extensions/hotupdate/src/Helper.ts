import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, normalize } from 'path';
import Helper from './impl/Helper';

const PACKAGE_NAME = "hotupdate";
class HelperImpl extends Helper {

    onUpdateCreateProgress(percent: number): void {
        if ( this.isDeploy ){
            Editor.Message.send(PACKAGE_NAME, "updateDeployProgress", percent);
        }else{
            Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", percent);
        }
    }

    onSetProcess(isProcessing: boolean): void {
        Editor.Message.send(PACKAGE_NAME, "onSetProcess", isProcessing);
    }

    onSetBuildDir(dir: string) {
        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", dir);
    }

    onSetVersion(version:string){
        super.onSetVersion(version);
        Editor.Message.send(PACKAGE_NAME,"onSetVersion",version);
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
            writeFileSync(configTSPath, content, "utf-8");

            let replaceAutoVersion = function () {
                self.logger.log(`${self.module}更新是否使用了自动版本:${self.data?.isAutoVersion}`);
                return arguments[1] + self.data?.isAutoVersion;
            };
            content = content.replace(/(export\s*const\s*USE_AUTO_VERSION\s*=\s*)(\w+)/g, replaceAutoVersion);
            writeFileSync(configTSPath, content, "utf-8");

            let dbPath = "db://assets/scripts/common/config/Config.ts";
            Editor.Message.send("asset-db", "refresh-asset", dbPath);
        } else {
            this.logger.error(`${this.module}${configTSPath}不存在，无法刷新配置到代码`);
        }
    }

    onBeforeBuild() {
        this.onUpdateCreateProgress(0);
        this.onSetProcess(true);
    }

    onAfterBuild(dest: string) {
        // this.insertHotupdate(dest);
        this.read(true);
        this.data!.buildDir = normalize(join(dest, "assets"));
        this.onSetBuildDir(this.data!.buildDir)
        this.save();
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