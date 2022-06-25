import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, normalize, parse } from "path";
import { Tools } from "./Tools";
const Electron = require("electron")

class Helper {

    private get configPath() {
        return path.join(Editor.Project.path, "config/hotupdate.json");
    }

    private _config: HotupdateConfig = null!
    get config() {
        if (!this._config) {
            this.readConfig();
        }
        return this._config;
    }
    set config(v) {
        this._config = v;
    }
    /**@description 检证数据 */
    private checkConfig() {
        //当前所有bundle
        let bundles = Tools.bundles;
        let isChange = false;
        //删除处理
        // Editor.log(bundles);
        Object.keys(this.config.bundles).forEach((value) => {
            if (!bundles.includes(value)) {
                delete this.config.bundles[value];
                this.log(`删除不存在Bundle:${value}`);
                isChange = true;
            }
        });

        //新增处理
        let curBundles = Object.keys(this.config.bundles);
        for (let i = 0; i < bundles.length; i++) {
            if (!curBundles.includes(bundles[i])) {
                let bundleInfo: BundleInfo = {
                    version: "1.0",
                    dir: bundles[i],
                    name: bundles[i],
                    includeApk: true,
                    md5: "-",
                }
                this.config.bundles[bundleInfo.dir] = bundleInfo;
                this.log(`添加Bundle:${bundles[i]}`);
                isChange = true;
            }
        }
        return isChange;
    }

    /**@description 返回远程版本号+md5 */
    private getShowRemoteString(config: { md5: string, version: string }) {
        return `[${config.version}] : ${config.md5}`;
    }
    get remoteVersion() {
        return this.getBundleVersion("main");
    }

    /**
     * @description 刷新测试环境子包信息
     * @param {*} key 
     */
    private getBundleVersion(key: string) {
        if (this.config.remoteDir.length > 0) {
            let versionManifestPath = path.join(this.config.remoteDir, `manifest/${key}_version.json`);
            if (existsSync(versionManifestPath)) {
                let data = readFileSync(versionManifestPath, { encoding: "utf-8" });
                let config = JSON.parse(data);
                return this.getShowRemoteString(config);
            } else {
                this.log(versionManifestPath + "不存在")
            }
        }
        return "-";
    }

    onRefreshVersion(dir?: string) {
        if (dir) {
            return this.getBundleVersion(dir);
        } else {
            return this.remoteVersion;
        }
    }

    /**@description 保存当前用户设置 */
    saveConfig() {
        let cacheString = JSON.stringify(this.config);
        writeFileSync(this.configPath, cacheString);
        // this.addLog(`写入缓存 :`, this.userCache);
    }

    private _remoteBundles: { [key: string]: BundleInfo } = null!;
    get remoteBundles() {
        if (this._remoteBundles) {
            return this._remoteBundles;
        }
        this.reloadRemoteBundles();
        return this._remoteBundles;
    }

    private reloadRemoteBundles() {
        this._remoteBundles = JSON.parse(JSON.stringify(this.config.bundles));
        Object.keys(this._remoteBundles).forEach((key) => {
            this._remoteBundles[key].md5 = this.getBundleVersion(key);
        });
    }

    /**@description 生成默认缓存 */
    private get defaultConfig() {
        let config: HotupdateConfig = {
            version: "1.0",
            serverIP: "",
            historyIps: [],
            buildDir: "",
            bundles: {},
            remoteDir: "",
            includes: {},
            autoCreate: true,
            autoDeploy: false
        }
        config.includes["src"] = { name: "src", include: true, isLock: false };
        config.includes["jsb-adapter"] = { name: "jsb-adapter", include: true, isLock: false };
        config.includes["assets/resources"] = { name: "assets/resources", include: true, isLock: true };
        config.includes["assets/main"] = { name: "assets/main", include: true, isLock: true };
        config.includes["assets/internal"] = { name: "assets/internal", include: true, isLock: true };
        config.autoCreate = true;
        config.autoDeploy = false;
        config.remoteDir = "";

        let bundles = Tools.bundles;
        for (let i = 0; i < bundles.length; i++) {
            let bundleInfo: BundleInfo = {
                version: "1.0",
                dir: bundles[i],
                name: bundles[i],
                includeApk: true,
                md5: "-",
            }
            config.bundles[bundleInfo.dir] = bundleInfo;
        }

        return config;
    }

    /**@description 读取本地缓存 */
    readConfig() {
        if (existsSync(this.configPath)) {
            let data = readFileSync(this.configPath, "utf-8")
            this.config = JSON.parse(data);
            if (this.checkConfig()) {
                this.saveConfig();
            }
            // this.addLog(`存在缓存 : ${this.configPath}`, this.config);
        } else {
            this.log(`不存在缓存 : ${this.configPath}`);
            this.config = this.defaultConfig;
            this.log(`生存默认缓存 : `, this.config);
            this.saveConfig();
        }
    }

    /**
     * @description 添加日志
     * @param {*} message 
     * @param {*} obj 
     * @returns 
     */
    log(message: any, obj: any = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log("[热更新]", message, obj);
        } else {
            Editor.log("[热更新]", message);
        }
    }

    private _isDoCreate = false;
    get isDoCreate() {
        if (this._isDoCreate) {
            this.log(`正在执行生成操作，请勿操作`);
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
        if (this.config.historyIps.indexOf(url) == -1) {
            this.config.historyIps.push(url);
            this.log(`添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    }
    getManifestDir(buildDir: string) {
        if (buildDir && buildDir.length > 0) {
            return path.join(buildDir, "manifest");
        } else {
            return "";
        }
    }
    //插入热更新代码
    onInsertHotupdate() {
        let codePath = path.join(Editor.Project.path, "extensions/hotupdate/code/hotupdate.js");
        let code = readFileSync(codePath, "utf8");
        // console.log(code);
        let sourcePath = this.config.buildDir + "/main.js";
        let sourceCode = readFileSync(sourcePath, "utf8");
        let templateReplace = function templateReplace() {
            // console.log(arguments);
            return arguments[1] + code + arguments[3];
        }
        //添加子游戏测试环境版本号
        sourceCode = sourceCode.replace(/(\);)([\s\w\S]*)(const[ ]*importMapJson)/g, templateReplace);
        this.log(`向${sourcePath}中插入热更新代码`);
        writeFileSync(sourcePath, sourceCode, { "encoding": "utf8" });
    }

    /**@description 生成manifest版本文件 */
    onCreateManifest(callback?: Function) {
        if (this.isDoCreate) {
            if (callback) callback();
            return;
        }
        this._isDoCreate = true;
        this.saveConfig();
        this.log(`当前用户配置为 : `, this.config);
        this.log("开始生成Manifest配置文件...");
        let version = this.config.version;
        this.log("主包版本号:", version);
        let buildDir = this.config.buildDir;
        buildDir = normalize(buildDir);
        this.log("构建目录:", buildDir);
        let manifestDir = this.getManifestDir(buildDir);
        manifestDir = normalize(manifestDir);
        this.log("构建目录下的Manifest目录:", manifestDir);
        let serverUrl = this.config.serverIP;
        this.log("热更新地址:", serverUrl);
        let subBundles = Object.keys(this.config.bundles);
        this.log("所有子包:", subBundles);
        let manifest: Manifest = {
            assets: {},
            bundle: "main"
        };

        this.resetCreateProgress();
        //文件数量
        this.total = (subBundles.length + 1) * 2;
        //压缩包数量
        this.total += (subBundles.length + 1);
        //所有版本文件
        this.total++;

        //删除旧的版本控件文件
        this.log("删除旧的Manifest目录", manifestDir);
        if (existsSync(manifestDir)) {
            this.log("存在旧的，删除掉");
            Tools.delDir(manifestDir);
        }
        Tools.mkdirSync(manifestDir);

        //读出主包资源，生成主包版本
        let mainIncludes = this.mainBundleIncludes;
        for (let i = 0; i < mainIncludes.length; i++) {
            Tools.readDir(path.join(buildDir, mainIncludes[i]), manifest.assets, buildDir);
        }

        let versionDatas: VersionDatas = {};

        //生成project.manifest
        let projectManifestPath = path.join(manifestDir, "main_project.json");
        let versionManifestPath = path.join(manifestDir, "main_version.json");
        let content = JSON.stringify(manifest);
        let md5 = require("crypto").createHash('md5').update(content).digest('hex');
        manifest.md5 = md5;
        manifest.version = version;

        let projectData = JSON.parse(JSON.stringify(manifest));
        delete manifest.assets;
        let versionData = JSON.parse(JSON.stringify(manifest))
        this.insertVersionData(
            versionDatas,
            manifest.bundle,
            projectData,
            versionData,
            projectManifestPath,
            versionManifestPath,
            md5
        );


        //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
        let versions: { [key: string]: { md5: string, version: string } } = {
            main: { md5: md5, version: version },
        }

        //生成各bundles版本文件
        for (let i = 0; i < subBundles.length; i++) {
            let key = subBundles[i];
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
            manifest.version = this.config.bundles[key].version

            projectData = JSON.parse(JSON.stringify(manifest));
            delete manifest.assets;
            versionData = JSON.parse(JSON.stringify(manifest));

            versions[`${key}`] = {} as any;
            versions[`${key}`].md5 = md5;
            versions[`${key}`].version = manifest.version;
            this.insertVersionData(
                versionDatas,
                manifest.bundle,
                projectData,
                versionData,
                projectManifestPath,
                versionManifestPath,
                md5
            );
        }

        //写入所有版本
        let versionsPath = path.join(manifestDir, `versions.json`);
        writeFileSync(versionsPath, JSON.stringify(versions));
        this.log(`生成versions.json成功`);
        this.addCreateProgress();
        Tools.zipVersions({
            /**@description 主包包含目录 */
            mainIncludes: mainIncludes,
            /**@description 所有版本信息 */
            versions: versions,
            /**@description 构建目录 */
            buildDir: this.config.buildDir,
            /**@description 日志回调 */
            log: (data: any) => {
                this.log(data);
            },
            /**@description 所有bundle的配置信息 */
            bundles: this.config.bundles,
            handler: (isComplete: boolean) => {
                this.addCreateProgress();
                if (isComplete) {
                    this.createVersionFile(versionDatas, callback);
                }
            }
        })
    }

    private insertVersionData(
        source: VersionDatas,
        bundle: string | undefined,
        project: Manifest,
        version: Manifest,
        projectPath: string,
        versionPath: string,
        md5: string) {
        if (bundle) {
            source[bundle] = {
                project: project,
                version: version,
                projectPath: projectPath,
                versionPath: versionPath,
                md5: md5
            }
        }
    }

    private createVersionFile(source: VersionDatas, callbak?: Function) {
        this.log(`准备生成版本控制文件`);
        //更新版本控制文件中zip大小
        Tools.updateZipSize(source);
        let keys = Object.keys(source);
        keys.forEach(bundle => {
            let data = source[bundle];
            writeFileSync(data.projectPath, JSON.stringify(data.project));
            let temp = parse(data.projectPath);
            this.log(`生成${temp.name}${temp.ext}成功`);
            this.addCreateProgress();
            writeFileSync(data.versionPath, JSON.stringify(data.version));
            temp = parse(data.versionPath);
            this.log(`生成${temp.name}${temp.ext}成功`);
            this.addCreateProgress();
        })

        this.log(`生成完成`);
        this._isDoCreate = false;
        if (callbak) callbak();
    }

    private _createProgress = 0;
    private resetCreateProgress() {
        this._createProgress = 0;
        Editor.Ipc.sendToPanel("hotupdate", "hotupdate:updateCreateProgress", 0);
    }
    private addCreateProgress() {
        this._createProgress++;
        let value = (this._createProgress / this.total) * 100;
        Editor.Ipc.sendToPanel("hotupdate", "hotupdate:updateCreateProgress", value);
    }

    /**@description 返回需要添加到主包版本的文件目录 */
    private get mainBundleIncludes() {
        return Object.keys(this.config.includes);
    }
    /**@description 删除不包含在包内的bundles */
    async onDelBundles() {
        if (this.isDoCreate) return;
        //弹出提示确定是否需要删除当前的子游戏
        Editor.Panel.open('confirm_del_subgames');
    }
    /**@description 删除不包含在包内的所有bundles */
    removeNotInApkBundle() {
        let keys = Object.keys(this.config.bundles);
        let removeBundles: string[] = [];
        keys.forEach((key) => {
            if (!this.config.bundles[key].includeApk) {
                removeBundles.push(key);
            }
        });
        let manifests = [];
        let removeDirs = [];
        for (let i = 0; i < removeBundles.length; i++) {
            let key = removeBundles[i];
            removeDirs.push(path.join(this.config.buildDir, `assets/${key}`));
            manifests.push(path.join(this.config.buildDir, `manifest/${key}_project.json`));
            manifests.push(path.join(this.config.buildDir, `manifest/${key}_version.json`));
        }

        for (let i = 0; i < removeDirs.length; i++) {
            this.log(`删除目录 : ${removeDirs[i]}`);
            Tools.delDir(removeDirs[i], true);
        }

        for (let i = 0; i < manifests.length; i++) {
            this.log(`删除版本文件 : ${manifests[i]}`);
            Tools.delFile(manifests[i]);
        }
    }
    /**
     * @description 部署
     */
    onDeployToRemote() {
        if (this.isDoCreate) return;
        if (this.config.remoteDir.length <= 0) {
            this.log("[部署]请先选择本地服务器目录");
            return;
        }
        if (!existsSync(this.config.remoteDir)) {
            this.log(`[部署]本地测试服务器目录不存在 : ${this.config.remoteDir}`);
            return;
        }
        if (!existsSync(this.config.buildDir)) {
            this.log(`[部署]构建目录不存在 : ${this.config.buildDir} , 请先构建`);
            return;
        }

        let includes = this.mainBundleIncludes;

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
            let dir = path.join(this.config.buildDir, copyDirs[i]);
            dir = normalize(dir);
            if (!existsSync(dir)) {
                this.log(`${this.config.buildDir} [部署]不存在${copyDirs[i]}目录,无法拷贝文件`);
                return;
            }
        }

        this.log(`[部署]开始拷贝文件到 : ${this.config.remoteDir}`);
        this.resetProgress();
        this.log(`[部署]删除旧目录 : ${this.config.remoteDir}`);
        let count = Tools.getDirFileCount(this.config.remoteDir);
        this.log(`[部署]删除文件个数:${count}`);
        Tools.delDir(this.config.remoteDir);

        count = 0;
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = path.join(this.config.buildDir, copyDirs[i]);
            dir = normalize(dir);
            count += Tools.getDirFileCount(dir);
        }

        //压缩文件数量
        let zipPath = Editor.Project.path + "/PackageVersion";
        zipPath = normalize(zipPath);
        count += Tools.getDirFileCount(zipPath);

        this.log(`[部署]复制文件个数 : ${count}`);
        this.total = count;

        for (let i = 0; i < copyDirs.length; i++) {
            let source = path.join(this.config.buildDir, copyDirs[i]);
            let dest = path.join(this.config.remoteDir, copyDirs[i]);
            this.log(`[部署]复制${source} => ${dest}`);
            Tools.copySourceDirToDesDir(source, dest, () => {
                this.addProgress();
            });
        }

        let remoteZipPath = path.join(this.config.remoteDir, "zips");
        Tools.delDir(remoteZipPath);

        //部署压缩文件
        this.log(`[部署]复制${zipPath} => ${remoteZipPath}`);
        Tools.copySourceDirToDesDir(zipPath, remoteZipPath, () => {
            this.addProgress();
        });

    }

    /**@description 进度总数 */
    private total = 1;

    private addProgress() {
        this._progress++;
        let value = (this._progress / this.total) * 100;
        Editor.Ipc.sendToPanel("hotupdate", "hotupdate:updateDeployProgress", value);
    }
    private _progress = 0;
    private resetProgress() {
        this._progress = 0;
        Editor.Ipc.sendToPanel("hotupdate", "hotupdate:updateDeployProgress", 0);
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
        this.log(`请先构建项目`);
        return false;
    }

    openDir(dir: string) {
        if (existsSync(dir)) {
            dir = normalize(dir);
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.log("目录不存在：" + dir);
        }
    }

    updateToConfigTS() {
        let configTSPath = join(Editor.Project.path, "assets/scripts/common/config/Config.ts");
        if (existsSync(configTSPath)) {
            //更新热更新地址
            let content = readFileSync(configTSPath, "utf-8");
            let serverID = this.config.serverIP;
            let self = this;
            let replace = function () {
                self.log(`更新热更新地址为:${serverID}`);
                return arguments[1] + serverID + arguments[3];
            };
            content = content.replace(/(export\s*const\s*HOT_UPDATE_URL\s*=\s*")([\w:/.-]*)(")/g, replace);

            let bundles: string[] = [];
            for (let bundle in this.config.includes) {
                let info = this.config.includes[bundle];
                if (info.include) {
                    bundles.push(info.name);
                }
            }

            let bundlesString = JSON.stringify(bundles);
            let replaceIncludes = function () {
                self.log(`更新主包包含目录为:${bundlesString}`);
                return arguments[1] + bundlesString + arguments[3];
            }
            content = content.replace(/(export\s*const\s*MIAN_PACK_INCLUDE\s*:\s*string\s*\[\s*\]\s*=\s*)([\[\]"\w,-/]*)(;)/g, replaceIncludes);
            // Editor.log(content);
            writeFileSync(configTSPath, content, "utf-8");
            let dbPath = "db://assets/scripts/common/config/Config.ts";
            Editor.assetdb.refresh(dbPath, (err: any) => {
                self.log(`刷新成功:${dbPath}`);
            });
        } else {
            Editor.error(`${configTSPath}不存在，无法刷新配置到代码`);
        }
    }

    private onInsertHotupdateCode(options: BuildOptions) {
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            let dest = path.normalize(options.dest);
            let mainJSPath = path.join(dest, "main.js");
            let content = readFileSync(mainJSPath, "utf-8");
            content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g,
                `if (window.jsb) {
    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
    if (hotUpdateSearchPaths) {
        jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
    }`);
            writeFileSync(mainJSPath, content, "utf-8");
            this.log(`热更新代码：${mainJSPath}`);
        }

    }

    onBuildFinished(options: BuildOptions, callback: Function) {
        this.onInsertHotupdateCode(options);
        callback();
    }
    onBuildStart(options: BuildOptions, callback: Function) {
        this.config.buildDir = options.dest;
        if ("win32" === options.platform || "android" === options.platform || "ios" === options.platform || "mac" === options.platform) {
            Editor.warn(`如果热更新勾选了【自动生成】或【自动部署】请不要关闭此界面`);
            Editor.Panel.open("hotupdate");
        }

        this.saveConfig();
        this.resetProgress();
        this.resetCreateProgress();
        Editor.Ipc.sendToPanel("hotupdate", "hotupdate:setBuildDir", options.dest);
        callback();
    }

    isSupportUpdate(platform: string) {
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac" || platform == "win32") {
            return true;
        }
        return false;
    }

    onPngCompressComplete() {
        this.readConfig();
        if (this.config.autoCreate) {
            this.onCreateManifest(() => {
                if (this.config.autoDeploy && this.config.remoteDir.length > 0) {
                    this.onDeployToRemote();
                }
            });
        }
    }
}

export const helper = new Helper();