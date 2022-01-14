import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";
import { BundleInfo, HotUpdateConfig, Manifest, Tools, UserCache } from "./Tools";
const Electron = require("electron")

class Helper {

    init() {
        this.config;
        this.readCache();
    }

    private _config: HotUpdateConfig = null!;
    private get config() {
        if (this._config == null) {
            let configPath = path.join(Editor.Project.path, "config/bundles.json");
            this._config = JSON.parse(readFileSync(configPath, { encoding: "utf-8" }));
            for (let i = 0; i < this._config.bundles.length; i++) {
                this.bundles[this._config.bundles[i].dir] = this._config.bundles[i];
            }
        }
        return this._config;
    }

    private bundles: { [key: string]: BundleInfo } = {};

    private get userCachePath() {
        return path.join(Editor.Project.path, "local/userCache.json");
    }

    private userCache: UserCache = {
        /**@description 主包版本号 */
        version: "",
        /**@description 当前服务器地址 */
        serverIP: "",
        /**@description 服务器历史地址 */
        historyIps: [],
        /**@description 构建项目目录 */
        buildDir: "",
        /**@description 各bundle的版本配置 */
        bundles: {},
        /**@description 远程服务器地址 */
        remoteVersion: "",
        /**@description 远程各bundle的版本配置 */
        remoteBundles: {},
        /**@description 远程服务器所在目录 */
        remoteDir: "",
    }
    /**@description 检证数据 */
    private checkUserCache() {
        //把不存在的bundle信息删除

        let notExist: string[] = [];
        Object.keys(this.userCache.bundles).forEach((value) => {
            if (this.bundles[value] == undefined || this.bundles[value] == null) {
                notExist.push(value);
            }
        });
        let isRemoved = false;
        for (let i = 0; i < notExist.length; i++) {
            delete this.userCache.bundles[notExist[i]];
            isRemoved = true;
        }

        notExist = [];
        this.userCache.remoteBundles = {};
        Object.keys(this.bundles).forEach((value) => {
            this.userCache.remoteBundles[value] = JSON.parse(JSON.stringify(this.bundles[value]));
        });

        this.userCache.remoteVersion = this.remoteVersion;

        Object.keys(this.userCache.remoteBundles).forEach((value) => {
            this.userCache.remoteBundles[value].md5 = this.getBundleVersion(value);
        });

        //需要加的加上
        Object.keys(this.bundles).forEach((key) => {
            if (!this.userCache.bundles[key]){
                this.userCache.bundles[key]=this.bundles[key]
                this.userCache.remoteBundles[key] = Object.assign({},this.bundles[key])
                this.userCache.remoteBundles[key].md5='-'
                isRemoved=true
            }
        });

        return isRemoved;
    }

    /**@description 返回远程版本号+md5 */
    private getShowRemoteString(config: { md5: string, version: string }) {
        return `[${config.version}] : ${config.md5}`;
    }
    private get remoteVersion() {
        return this.getBundleVersion("main");
    }

    /**
     * @description 刷新测试环境子包信息
     * @param {*} key 
     */
     private getBundleVersion(key: string) {
        if (this.userCache.remoteDir.length > 0) {
            let versionManifestPath = path.join(this.userCache.remoteDir, `manifest/${key}_version.json`);
            if (existsSync(versionManifestPath)) {
                let data = readFileSync(versionManifestPath, { encoding: "utf-8" });
                let config = JSON.parse(data);
                return this.getShowRemoteString(config);
            }else{
                this.addLog(versionManifestPath+"不存在")
            }
        } 
        return "-";
    }

    onRefreshVersion(dir?:string){
        console.log(dir);
        if ( dir ){
            this.userCache.remoteBundles[dir].md5 = this.getBundleVersion(dir);
        }else{
            this.userCache.remoteVersion = this.remoteVersion;
        }
        this.saveUserCache();
    }

    /**@description 保存当前用户设置 */
    saveUserCache() {
        let cacheString = JSON.stringify(this.userCache);
        writeFileSync(this.userCachePath, cacheString);
        // this.addLog(`写入缓存 :`, this.userCache);
    }

    /**@description 生成默认缓存 */
    private generateDefaultUseCache() {
        this.userCache.version = this.config.version;
        this.userCache.historyIps = [];
        this.userCache.buildDir = "";
        this.userCache.bundles = this.bundles;
        this.userCache.remoteVersion = "-";
        this.userCache.remoteBundles = JSON.parse(JSON.stringify(this.bundles));
        Object.keys(this.bundles).forEach((key) => {
            this.userCache.remoteBundles[key].md5 = "-";
        });
        this.userCache.remoteDir = "";
    }

    /**@description 读取本地缓存 */
    private readCache() {
        if (existsSync(this.userCachePath)) {
            let data = readFileSync(this.userCachePath, "utf-8")
            this.userCache = JSON.parse(data);
            if (this.checkUserCache()) {
                this.saveUserCache();
            }
            // this.addLog(`存在缓存 : ${this.userCachePath}`, this.userCache);
        } else {
            this.addLog(`不存在缓存 : ${this.userCachePath}`);
            this.generateDefaultUseCache();
            this.addLog(`生存默认缓存 : `, this.userCache);
            this.saveUserCache();
        }
    }

    /**
     * @description 添加日志
     * @param {*} message 
     * @param {*} obj 
     * @returns 
     */
    addLog(message: any, obj: any = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log(message, obj);
        } else {
            Editor.log(message);
        }
        if (!this.logArea) {
            return;
        }
        let text = "";
        if (obj == null) {
            text = message;
        } else if (typeof obj == "object") {
            text = message + JSON.stringify(obj);
        } else {
            text = message + obj.toString();
        }
        let temp = this.logArea.value;
        if (temp.length > 0) {
            this.logArea.value = temp + "\n" + text;
        } else {
            this.logArea.value = text;
        }
        setTimeout(() => {
            this.logArea.scrollTop = this.logArea.scrollHeight;
        }, 10)
    }

    logArea: HTMLTextAreaElement = null!;

    get cache() {
        return this.userCache;
    }

    private _isDoCreate = false;
    get isDoCreate() {
        if (this._isDoCreate) {
            this.addLog(`正在执行生成操作，请勿操作`);
        }
        return this._isDoCreate;
    }
    set isDoCreate(v) {
        this._isDoCreate = v;
    }

    /**
     * @description 添加历史地址 
     * @param url
     * */
    addHotAddress(url: string) {
        if (this.userCache.historyIps.indexOf(url) == -1) {
            this.userCache.historyIps.push(url);
            this.addLog(`添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    }
    getManifestDir(buildDir: string) {
        if (buildDir && buildDir.length > 0) {
            return buildDir + "\\manifest";
        } else {
            return "";
        }
    }
    //插入热更新代码
    onInsertHotupdate() {
        let codePath = path.join(Editor.Project.path, "extensions/hotupdate/code/hotupdate.js");
        let code = readFileSync(codePath, "utf8");
        // console.log(code);
        let sourcePath = this.userCache.buildDir + "/main.js";
        let sourceCode = readFileSync(sourcePath, "utf8");
        let templateReplace = function templateReplace() {
            // console.log(arguments);
            return arguments[1] + code + arguments[3];
        }
        //添加子游戏测试环境版本号
        sourceCode = sourceCode.replace(/(\);)([\s\w\S]*)(const[ ]*importMapJson)/g, templateReplace);
        this.addLog(`向${sourcePath}中插入热更新代码`);
        writeFileSync(sourcePath, sourceCode, { "encoding": "utf8" });
    }

    /**@description 生成manifest版本文件 */
    onCreateManifest() {
        if (this.isDoCreate) return;
        this._isDoCreate = true;
        this.saveUserCache();
        this.addLog(`当前用户配置为 : `, this.userCache);
        this.addLog("开始生成Manifest配置文件...");
        let version = this.userCache.version;
        this.addLog("主包版本号:", version);
        let buildDir = this.userCache.buildDir;
        buildDir = buildDir.replace(/\\/g, "/");
        this.addLog("构建目录:", buildDir);
        let manifestDir = this.getManifestDir(buildDir);
        manifestDir = manifestDir.replace(/\\/g, "/");
        this.addLog("构建目录下的Manifest目录:", manifestDir);
        let serverUrl = this.userCache.serverIP;
        this.addLog("热更新地址:", serverUrl);
        let subBundles = Object.keys(this.userCache.bundles);
        this.addLog("所有子包:", subBundles);
        let manifest: Manifest = {
            assets: {},
            bundle: "main"
        };

        //删除旧的版本控件文件
        this.addLog("删除旧的Manifest目录", manifestDir);
        if (existsSync(manifestDir)) {
            this.addLog("存在旧的，删除掉");
            Tools.delDir(manifestDir);
        }
        Tools.mkdirSync(manifestDir);

        //读出主包资源，生成主包版本
        let mainIncludes = this.getMainBundleIncludes();
        for (let i = 0; i < mainIncludes.length; i++) {
            Tools.readDir(path.join(buildDir, mainIncludes[i]), manifest.assets, buildDir);
        }

        //生成project.manifest
        let projectManifestPath = path.join(manifestDir, "main_project.json");
        let versionManifestPath = path.join(manifestDir, "main_version.json");
        let content = JSON.stringify(manifest);
        let md5 = require("crypto").createHash('md5').update(content).digest('hex');
        manifest.md5 = md5;
        manifest.version = version;
        writeFileSync(projectManifestPath, JSON.stringify(manifest));
        this.addLog(`生成${projectManifestPath}成功`);

        delete manifest.assets;

        writeFileSync(versionManifestPath, JSON.stringify(manifest));
        this.addLog(`生成${versionManifestPath}成功`);

        //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
        let versions: { [key: string]: { md5: string, version: string } } = {
            main: { md5: md5, version: version },
        }

        //生成各bundles版本文件
        for (let i = 0; i < subBundles.length; i++) {
            let key = subBundles[i];
            this.addLog(`正在生成:${key}`);
            let manifest: Manifest = {
                assets: {},
                bundle: key
            };
            Tools.readDir(path.join(buildDir, `assets/${key}`), manifest.assets, buildDir);
            projectManifestPath = path.join(manifestDir, `${key}_project.json`);
            versionManifestPath = path.join(manifestDir, `${key}_version.json`);

            let content = JSON.stringify(manifest);
            let md5 = require("crypto").createHash('md5').update(content).digest('hex');
            manifest.md5 = md5;
            manifest.version = this.userCache.bundles[key].version
            writeFileSync(projectManifestPath, JSON.stringify(manifest));
            this.addLog(`生成${projectManifestPath}成功`);

            delete manifest.assets;
            versions[`${key}`] = {} as any;
            versions[`${key}`].md5 = md5;
            versions[`${key}`].version = manifest.version;
            writeFileSync(versionManifestPath, JSON.stringify(manifest));
            this.addLog(`生成${versionManifestPath}成功`);
        }

        //写入所有版本
        let versionsPath = path.join(manifestDir, `versions.json`);
        writeFileSync(versionsPath, JSON.stringify(versions));
        this.addLog(`生成versions.json成功`);
        Tools.zipVersions({
            /**@description 主包包含目录 */
            mainIncludes: mainIncludes,
            /**@description 所有版本信息 */
            versions: versions,
            /**@description 构建目录 */
            buildDir: this.userCache.buildDir,
            /**@description 日志回调 */
            log: (data: any) => {
                this.addLog(data);
            },
            /**@description 所有bundle的配置信息 */
            bundles: this.config.bundles
        })
        this._isDoCreate = false;
    }
    /**@description 返回需要添加到主包版本的文件目录 */
    private getMainBundleIncludes() {
        return [
            "src", //这个里面会包含工程的插件脚本，如该工程的protobuf.js CryptoJS.js,如果考虑后面会升级，加入到里面
            "jsb-adapter", //这个东西一般不会变，不用加载到版本控制中
            "assets/main",
            "assets/resources",
            "assets/internal"
        ];
    }
    /**@description 删除不包含在包内的bundles */
    async onDelBundles() {
        if (this.isDoCreate) return;
        //弹出提示确定是否需要删除当前的子游戏
        Editor.Panel.open('confirm_del_subgames');
    }
    /**@description 删除不包含在包内的所有bundles */
    removeNotInApkBundle() {
        let keys = Object.keys(this.userCache.bundles);
        let removeBundles: string[] = [];
        keys.forEach((key) => {
            if (!this.userCache.bundles[key].includeApk) {
                removeBundles.push(key);
            }
        });
        let manifests = [];
        let removeDirs = [];
        for (let i = 0; i < removeBundles.length; i++) {
            let key = removeBundles[i];
            removeDirs.push(path.join(this.userCache.buildDir, `assets/${key}`));
            manifests.push(path.join(this.userCache.buildDir, `manifest/${key}_project.json`));
            manifests.push(path.join(this.userCache.buildDir, `manifest/${key}_version.json`));
        }

        for (let i = 0; i < removeDirs.length; i++) {
            this.addLog(`删除目录 : ${removeDirs[i]}`);
            Tools.delDir(removeDirs[i], true);
        }

        for (let i = 0; i < manifests.length; i++) {
            this.addLog(`删除版本文件 : ${manifests[i]}`);
            Tools.delFile(manifests[i]);
        }
    }
    /**
     * @description 部署
     */
     onDeployToRemote() {
        if (this.isDoCreate) return;
        if (this.userCache.remoteDir.length <= 0) {
            this.addLog("[部署]请先选择本地服务器目录");
            return;
        }
        if (!existsSync(this.userCache.remoteDir)) {
            this.addLog(`[部署]本地测试服务器目录不存在 : ${this.userCache.remoteDir}`);
            return;
        }
        if (!existsSync(this.userCache.buildDir)) {
            this.addLog(`[部署]构建目录不存在 : ${this.userCache.buildDir} , 请先构建`);
            return;
        }

        let includes = this.getMainBundleIncludes();

        let temps = [];
        for (let i = 0; i < includes.length; i++) {
            //只保留根目录
            let dir = includes[i];
            let index = dir.search(/\\|\//);
            if (index == -1) {
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            } else {
                dir = dir.substr(0, index);
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            }
        }

        let copyDirs = ["manifest"].concat(temps);
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = path.join(this.userCache.buildDir, copyDirs[i]);
            dir = normalize(dir);
            if (!existsSync(dir)) {
                this.addLog(`${this.userCache.buildDir} [部署]不存在${copyDirs[i]}目录,无法拷贝文件`);
                return;
            }
        }

        this.addLog(`[部署]开始拷贝文件到 : ${this.userCache.remoteDir}`);
        this.resetProgress();
        this.addLog(`[部署]删除旧目录 : ${this.userCache.remoteDir}`);
        let count = Tools.getDirFileCount(this.userCache.remoteDir);
        this.addLog(`[部署]删除文件个数:${count}`);
        Tools.delDir(this.userCache.remoteDir);

        count = 0;
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = path.join(this.userCache.buildDir, copyDirs[i]);
            dir = normalize(dir);
            count += Tools.getDirFileCount(dir);
        }

        //压缩文件数量
        let zipPath = Editor.Project.path + "/PackageVersion";
        zipPath = normalize(zipPath);
        count += Tools.getDirFileCount(zipPath);

        this.addLog(`[部署]复制文件个数 : ${count}`);

        for (let i = 0; i < copyDirs.length; i++) {
            let source = path.join(this.userCache.buildDir, copyDirs[i]);
            let dest = path.join(this.userCache.remoteDir, copyDirs[i]);
            this.addLog(`[部署]复制${source} => ${dest}`);
            Tools.copySourceDirToDesDir(source, dest, () => {
                this.addProgress();
            });
        }

        let remoteZipPath = path.join(this.userCache.remoteDir, "zips");
        Tools.delDir(remoteZipPath);

        //部署压缩文件
        this.addLog(`[部署]复制${zipPath} => ${remoteZipPath}`);
        Tools.copySourceDirToDesDir(zipPath, remoteZipPath, () => {
            this.addProgress();
        });

    }

    progressFuc : (data:number)=>void = null!;
    getProgressFunc :()=>number = null!;
    private addProgress() {
        let value = Number(this.getProgressFunc());
        value = value + 1;
        if (value > 100) {
            value = 100;
        }
        this.progressFuc(value);
    }
    private resetProgress(){
        this.progressFuc(0);
    }

    checkBuildDir(fullPath:string) {
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
        this.addLog(`请先构建项目`);
        return false;
    }

    openDir(dir:string) {
        if (existsSync(dir)) {
            dir = normalize(dir);
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.addLog("目录不存在：" + dir);
        }
    }
}

export const helper = new Helper();