import { existsSync, readFile, readFileSync, writeFileSync } from 'fs-extra';
import path, { join, normalize } from 'path';
import { Tools } from './Tools';
import * as os from "os"
import { exec } from "child_process";

const PACKAGE_NAME = "hotupdate";
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

    private bundles: { [key: string]: BundleInfo } = {};

    private get userCachePath() {
        return path.join(Editor.Project.path, "local/userCache.json");
    }

    /**@description 检证数据 */
    private checkConfig() {
        //当前所有bundle
        let bundles = Tools.bundles;
        let isChange = false;
        //删除处理
        Object.keys(this.config.bundles).forEach((value) => {
            if (!bundles.includes(value)) {
                delete this.config.bundles[value];
                console.log(`删除不存在Bundle:${value}`);
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
                console.log(`添加Bundle:${bundles[i]}`);
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
        writeFileSync(this.userCachePath, cacheString);
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
        Object.keys(this.bundles).forEach((key) => {
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
        if (existsSync(this.userCachePath)) {
            let data = readFileSync(this.userCachePath, "utf-8")
            this.config = JSON.parse(data);
            if (this.checkConfig()) {
                this.saveConfig();
            }
            // this.addLog(`存在缓存 : ${this.userCachePath}`, this.userCache);
        } else {
            this.log(`不存在缓存 : ${this.userCachePath}`);
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
            console.log(message, obj);
        } else {
            console.log(message);
        }
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
            return path.join(buildDir,"manifest");
        } else {
            return "";
        }
    }
    //插入热更新代码
    private onInsertHotupdate(dest: string) {
        let codePath = path.join(Editor.Project.path, "extensions/hotupdate/code/hotupdate.js");
        let code = readFileSync(codePath, "utf8");
        // console.log(code);
        let sourcePath = path.join(dest, "assets/main.js");
        sourcePath = normalize(sourcePath);
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
    onCreateManifest(callbak?: Function) {
        Editor.Message.send(PACKAGE_NAME,"onSetProcess",true);
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

        //生成project.manifest
        let projectManifestPath = path.join(manifestDir, "main_project.json");
        let versionManifestPath = path.join(manifestDir, "main_version.json");
        let content = JSON.stringify(manifest);
        let md5 = require("crypto").createHash('md5').update(content).digest('hex');
        manifest.md5 = md5;
        manifest.version = version;
        writeFileSync(projectManifestPath, JSON.stringify(manifest));
        this.log(`生成${projectManifestPath}成功`);
        this.addCreateProgress();

        delete manifest.assets;

        writeFileSync(versionManifestPath, JSON.stringify(manifest));
        this.log(`生成${versionManifestPath}成功`);
        this.addCreateProgress();

        //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
        let versions: { [key: string]: { md5: string, version: string } } = {
            main: { md5: md5, version: version },
        }

        //生成各bundles版本文件
        for (let i = 0; i < subBundles.length; i++) {
            let key = subBundles[i];
            this.log(`正在生成:${key}`);
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
            writeFileSync(projectManifestPath, JSON.stringify(manifest));
            this.log(`生成${projectManifestPath}成功`);
            this.addCreateProgress();

            delete manifest.assets;
            versions[`${key}`] = {} as any;
            versions[`${key}`].md5 = md5;
            versions[`${key}`].version = manifest.version;
            writeFileSync(versionManifestPath, JSON.stringify(manifest));
            this.log(`生成${versionManifestPath}成功`);
            this.addCreateProgress();
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
                    setTimeout(() => {
                        this.log(`生成完成`);
                        Editor.Message.send(PACKAGE_NAME,"onSetProcess",false);
                        if (callbak) callbak();
                    }, 500);
                }
            }
        })
        this.remake()
    }

    private _createProgress = 0;
    private resetCreateProgress() {
        this._createProgress = 0;
        Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", 0);
    }
    private addCreateProgress() {
        this._createProgress++;
        let value = (this._createProgress / this.total) * 100;
        Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", value);
    }

    /**@description 返回需要添加到主包版本的文件目录 */
    private get mainBundleIncludes() {
        return Object.keys(this.config.includes);
    }
    private remake() {
        if (os.type() !== 'Darwin') {//判断mac os平台
            return
        }
        const projectPath = Editor.Project.path
        const nativeIosPath = projectPath + "/native/engine/ios"
        const iosProjPath = projectPath + "/build/ios/proj"
        const resPath = projectPath + "/build/ios"
        if (!existsSync(resPath) || !existsSync(nativeIosPath)) {
            return;
        }
        const prev = path.resolve(Editor.App.path, "..")
        const cmake = prev + "/tools/cmake/bin/cmake"//cocos目录下的cmake执行程序
        console.log(cmake)
        const cmd = cmake + " with -S " + nativeIosPath + " -GXcode -B" + iosProjPath +
            " -DCMAKE_SYSTEM_NAME=iOS -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang -DRES_DIR=" + resPath
        exec(cmd, { encoding: 'utf8' }, function (err, stdout, stderr) {//重新执行一下cmake
            if (err) {
                console.log(err);
            }
            if (stderr) {
                console.log(stderr);
            }
            console.log(stdout);
        });
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
            this.remake()
        }
    }
    /**@description 删除不包含在包内的所有bundles */
    private removeNotInApkBundle() {
        Editor.Message.send(PACKAGE_NAME,"onSetProcess",true);
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
        Editor.Message.send(PACKAGE_NAME,"onSetProcess",false);
    }
    /**
     * @description 部署
     */
    onDeployToRemote() {
        
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
        Editor.Message.send(PACKAGE_NAME,"onSetProcess",true);
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
            count += Tools.getDirFileCount(dir);
        }

        //压缩文件数量
        let zipPath = Editor.Project.path + "/PackageVersion";
        count += Tools.getDirFileCount(zipPath);

        this.log(`[部署]复制文件个数 : ${count}`);

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
        if ( value >= 100 ){
            Editor.Message.send(PACKAGE_NAME,"onSetProcess",false);
        }
        Editor.Message.send(PACKAGE_NAME, "updateDeployProgress", value);
    }
    private _progress = 0;
    private resetProgress() {
        this._progress = 0;
        Editor.Message.send(PACKAGE_NAME, "updateDeployProgress", 0);
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
            Editor.Message.send("asset-db", "refresh-asset", dbPath);
        } else {
            console.error(`${configTSPath}不存在，无法刷新配置到代码`);
        }
    }

    onBeforeBuild() {
        this.resetProgress();
        this.resetCreateProgress();
        Editor.Message.send(PACKAGE_NAME,"onSetProcess",true);
    }

    onAfterBuild(dest: string) {
        this.onInsertHotupdate(dest);
        this.readConfig();
        this.config.buildDir = normalize(join(dest,"assets"));
        Editor.Message.send(PACKAGE_NAME,"onSetBuildDir",this.config.buildDir);
        this.saveConfig();
    }

    onPngCompressComplete(){
        this.readConfig();
        if (this.config.autoCreate) {
            this.onCreateManifest(() => {
                if (this.config.autoDeploy && this.config.remoteDir.length > 0 ){
                    this.onDeployToRemote();
                }else{
                    Editor.Message.send(PACKAGE_NAME,"onSetProcess",false);
                }
            })
        }else{
            Editor.Message.send(PACKAGE_NAME,"onSetProcess",false);
        }
    }
}

export const helper = new Helper();