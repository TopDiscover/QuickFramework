"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Config_1 = __importDefault(require("../core/Config"));
const Defines_1 = require("../core/Defines");
const FileUtils_1 = __importDefault(require("../core/FileUtils"));
class Helper extends Config_1.default {
    constructor() {
        super(...arguments);
        this.module = "【热更新】";
        this.defaultData = {
            version: "1.0",
            serverIP: "",
            historyIps: [],
            buildDir: "",
            bundles: {},
            remoteDir: "",
            includes: {},
            autoCreate: true,
            autoDeploy: false
        };
        this._cur = 0;
        /**@description 文件总数 */
        this.total = 0;
        /**
         * @description 是否是部署
         */
        this.isDeploy = false;
        this._curExtensionPath = null;
        this._remoteBundles = null;
        this._zipPath = null;
    }
    onUpdateCreateProgress(percent) {
        this.logger.log(`${this.module}当前进度 : (${this.cur}/${this.total}) ${percent}`);
        // Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", value);
    }
    onSetProcess(isProcessing) {
        // Editor.Message.send(PACKAGE_NAME, "onSetProcess", true);
    }
    get path() {
        let out = (0, path_1.join)(this.configPath, `${Defines_1.Extensions.Hotupdate}.json`);
        return out;
    }
    get data() {
        if (!this._data) {
            this.read(true);
        }
        return this._data;
    }
    /**@description 当前进度 */
    get cur() {
        return this._cur;
    }
    set cur(v) {
        this._cur = v;
        this.onUpdateCreateProgress(this.percent);
    }
    get percent() {
        if (this.total <= 0) {
            return 100;
        }
        let value = (this.cur / this.total) * 100;
        return value;
    }
    get curExtensionPath() {
        if (!this._curExtensionPath) {
            this._curExtensionPath = (0, path_1.join)(this.extensionsPath, Defines_1.Extensions.Hotupdate);
        }
        return this._curExtensionPath;
    }
    get remoteBundles() {
        if (this._remoteBundles) {
            return this._remoteBundles;
        }
        this.reloadRemoteBundles();
        return this._remoteBundles;
    }
    reloadRemoteBundles() {
        this._remoteBundles = JSON.parse(JSON.stringify(this.data.bundles));
        Object.keys(this._remoteBundles).forEach((key) => {
            this._remoteBundles[key].md5 = this.getBundleVersion(key);
        });
    }
    /**
     * @description 刷新测试环境子包信息
     * @param {*} key
     */
    getBundleVersion(key) {
        if (this.data && this.data.remoteDir.length > 0) {
            let versionManifestPath = (0, path_1.join)(this.data.remoteDir, `manifest/${key}_version.json`);
            if ((0, fs_1.existsSync)(versionManifestPath)) {
                let data = (0, fs_1.readFileSync)(versionManifestPath, { encoding: "utf-8" });
                let config = JSON.parse(data);
                return this.getShowRemoteString(config);
            }
            else {
                this.logger.log(`${this.module}${versionManifestPath}不存在`);
            }
        }
        return "-";
    }
    /**@description 返回远程版本号+md5 */
    getShowRemoteString(config) {
        return `[${config.version}] : ${config.md5}`;
    }
    /**@description 远程版本号 */
    get remoteVersion() {
        return this.getBundleVersion("main");
    }
    /**@description 获取bundle版本 */
    getVersion(dir) {
        if (dir) {
            return this.getBundleVersion(dir);
        }
        else {
            return this.remoteVersion;
        }
    }
    checkData() {
        //当前所有bundle
        let bundles = this.projBundles;
        let isChange = false;
        //删除处理
        Object.keys(this._data.bundles).forEach((value) => {
            if (!bundles.includes(value)) {
                delete this._data.bundles[value];
                this.logger.log(`${this.module}删除不存在Bundle:${value}`);
                isChange = true;
            }
        });
        //新增处理
        let curBundles = Object.keys(this._data.bundles);
        for (let i = 0; i < bundles.length; i++) {
            if (!curBundles.includes(bundles[i])) {
                let bundleInfo = {
                    version: "1.0",
                    dir: bundles[i],
                    name: bundles[i],
                    includeApk: true,
                    md5: "-",
                };
                this._data.bundles[bundleInfo.dir] = bundleInfo;
                this.logger.log(`${this.module}添加Bundle:${bundles[i]}`);
                isChange = true;
            }
        }
        return isChange;
    }
    read(isReload = false) {
        if (this.path) {
            if (!isReload && this._data) {
                return;
            }
            if ((0, fs_1.existsSync)(this.path)) {
                let data = (0, fs_1.readFileSync)(this.path, "utf-8");
                let source = JSON.parse(data);
                this._data = source;
                this.checkData() && this.save();
            }
            else {
                if (this.defaultData) {
                    this._data = this.defaultData;
                    this._data.includes["src"] = { name: "src", include: true, isLock: false };
                    this._data.includes["jsb-adapter"] = { name: "jsb-adapter", include: true, isLock: false };
                    this._data.includes["assets/resources"] = { name: "assets/resources", include: true, isLock: true };
                    this._data.includes["assets/main"] = { name: "assets/main", include: true, isLock: true };
                    this._data.autoCreate = true;
                    this._data.autoDeploy = false;
                    this._data.remoteDir = "";
                    let bundles = this.projBundles;
                    for (let i = 0; i < bundles.length; i++) {
                        let bundleInfo = {
                            version: "1.0",
                            dir: bundles[i],
                            name: bundles[i],
                            includeApk: true,
                            md5: "-",
                        };
                        this._data.bundles[bundleInfo.dir] = bundleInfo;
                    }
                    this.save();
                }
            }
        }
    }
    /**
     * @description 生成的zip保存路径
     */
    get zipPath() {
        if (!this._zipPath) {
            this._zipPath = (0, path_1.join)(this.projPath, "proj/zips");
        }
        return this._zipPath;
    }
    /**
     * @description 获取当前项目所有的bundle
     */
    get projBundles() {
        let result = FileUtils_1.default.instance.getDirs(this.assetsBundlesPath);
        let bundles = [];
        result.forEach(v => {
            bundles.push(v.name);
        });
        return bundles;
    }
    /**@description 返回需要添加到主包版本的文件目录 */
    get mainBundleIncludes() {
        return Object.keys(this.data.includes);
    }
    /**
     * @description 获取保存的zip路径
     * @param bundle
     * @param md5
     * @returns
     */
    getZip(bundle, md5) {
        return (0, path_1.join)(this.zipPath, `${bundle}_${md5}.zip`);
    }
    async run() {
        // await this.createManifest();
        // await this.removeNotInApkBundle();
        await this.deployToRemote();
        // await this.insertHotupdate(Environment.build.dest);
        // await this.insertHotupdate(join(this.data!.buildDir, "../"));
    }
    getManifestDir(buildDir) {
        if (buildDir && buildDir.length > 0) {
            return (0, path_1.join)(buildDir, "manifest");
        }
        else {
            return "";
        }
    }
    insertVersionData(source, bundle, project, version, projectPath, versionPath, md5) {
        if (bundle) {
            source[bundle] = {
                project: project,
                version: version,
                projectPath: projectPath,
                versionPath: versionPath,
                md5: md5
            };
        }
    }
    async zipVersions(versions) {
        let data = this.data;
        let mainIncludes = this.mainBundleIncludes;
        let paths = [];
        for (let i = 0; i < mainIncludes.length; i++) {
            const element = mainIncludes[i];
            let fullPath = (0, path_1.join)(data.buildDir, element);
            fullPath = (0, path_1.normalize)(fullPath);
            paths.push(fullPath);
        }
        //删除之前的版本包
        await FileUtils_1.default.instance.delDir(this.zipPath);
        FileUtils_1.default.instance.createDir(this.zipPath);
        this.logger.log(`${this.module}打包路径 : ${this.zipPath}`);
        let zipPath = this.getZip("main", versions["main"].md5);
        this.logger.log(`${this.module}正在打包 : ${(0, path_1.parse)(zipPath).name}`);
        await FileUtils_1.default.instance.archive(paths, zipPath, data.buildDir);
        this.cur = this.cur + 1;
        this.logger.log(`${this.module}打包完成 : ${(0, path_1.parse)(zipPath).name}`);
        let bundles = Object.keys(data.bundles);
        //打包子版本
        for (let i = 0; i < bundles.length; i++) {
            let bundle = bundles[i];
            zipPath = this.getZip(bundle, versions[bundle].md5);
            this.logger.log(`${this.module}正在打包 : ${(0, path_1.parse)(zipPath).name}`);
            let fullPath = (0, path_1.join)(data.buildDir, `assets/${bundle}`);
            await FileUtils_1.default.instance.archive(fullPath, zipPath, data.buildDir);
            this.cur = this.cur + 1;
            this.logger.log(`${this.module}打包完成 : ${(0, path_1.parse)(zipPath).name}`);
        }
    }
    /**@description 生成版本文件 */
    createVersionFile(source) {
        this.logger.log(`${this.module}准备生成版本控制文件`);
        //更新版本控制文件中zip大小
        let keys = Object.keys(source);
        keys.forEach(bundle => {
            let data = source[bundle];
            let zipPath = this.getZip(bundle, data.md5);
            data.project.size = (0, fs_1.statSync)(zipPath).size;
            (0, fs_1.writeFileSync)(data.projectPath, JSON.stringify(data.project));
            let temp = (0, path_1.parse)(data.projectPath);
            this.logger.log(`${this.module}生成${temp.name}${temp.ext}成功`);
            this.cur = this.cur + 1;
            (0, fs_1.writeFileSync)(data.versionPath, JSON.stringify(data.version));
            temp = (0, path_1.parse)(data.versionPath);
            this.logger.log(`${this.module}生成${temp.name}${temp.ext}成功`);
            this.cur = this.cur + 1;
        });
        this.onSetProcess(false);
        this.logger.log(`${this.module}生成完成`);
    }
    /**
     * @description 创建Manifest版本文件
     */
    createManifest() {
        return new Promise(async (resolve) => {
            this.isDeploy = false;
            this.onSetProcess(true);
            this.save();
            this.logger.log(`${this.module}当前用户配置 : `, this.data);
            this.logger.log(`${this.module}开始生成版本控制文件`);
            let data = this.data;
            let version = data.version;
            this.logger.log(`${this.module}主包版本号:${version}`);
            let buildDir = data.buildDir;
            buildDir = (0, path_1.normalize)(buildDir);
            this.logger.log("构建目录:", buildDir);
            let manifestDir = this.getManifestDir(buildDir);
            manifestDir = (0, path_1.normalize)(manifestDir);
            this.logger.log("构建目录下的Manifest目录:", manifestDir);
            let serverUrl = data.serverIP;
            this.logger.log("热更新地址:", serverUrl);
            let subBundles = Object.keys(data.bundles);
            this.logger.log("所有子包:", subBundles);
            let manifest = {
                assets: {},
                bundle: "main"
            };
            this._cur = 0;
            //文件数量
            this.total = (subBundles.length + 1) * 2;
            //压缩包数量
            this.total += (subBundles.length + 1);
            //所有版本文件
            this.total++;
            //删除旧的版本控件文件
            this.logger.log("删除旧的Manifest目录", manifestDir);
            if ((0, fs_1.existsSync)(manifestDir)) {
                this.logger.log("存在旧的，删除掉");
                await FileUtils_1.default.instance.delDir(manifestDir);
            }
            FileUtils_1.default.instance.createDir(manifestDir);
            //读出主包资源，生成主包版本
            let mainIncludes = this.mainBundleIncludes;
            for (let i = 0; i < mainIncludes.length; i++) {
                FileUtils_1.default.instance.md5Dir((0, path_1.join)(buildDir, mainIncludes[i]), manifest.assets, buildDir);
            }
            let versionDatas = {};
            //生成project.manifest
            let projectManifestPath = (0, path_1.join)(manifestDir, "main_project.json");
            let versionManifestPath = (0, path_1.join)(manifestDir, "main_version.json");
            let content = JSON.stringify(manifest);
            let md5 = FileUtils_1.default.instance.md5(content);
            manifest.md5 = md5;
            manifest.version = version;
            let projectData = JSON.parse(JSON.stringify(manifest));
            delete manifest.assets;
            let versionData = JSON.parse(JSON.stringify(manifest));
            this.insertVersionData(versionDatas, manifest.bundle, projectData, versionData, projectManifestPath, versionManifestPath, md5);
            //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
            let versions = {
                main: { md5: md5, version: version },
            };
            //生成各bundles版本文件
            for (let i = 0; i < subBundles.length; i++) {
                let key = subBundles[i];
                let manifest = {
                    assets: {},
                    bundle: key
                };
                FileUtils_1.default.instance.md5Dir((0, path_1.join)(buildDir, `assets/${key}`), manifest.assets, buildDir);
                projectManifestPath = (0, path_1.join)(manifestDir, `${key}_project.json`);
                versionManifestPath = (0, path_1.join)(manifestDir, `${key}_version.json`);
                let content = JSON.stringify(manifest);
                let md5 = FileUtils_1.default.instance.md5(content);
                manifest.md5 = md5;
                manifest.version = data.bundles[key].version;
                projectData = JSON.parse(JSON.stringify(manifest));
                delete manifest.assets;
                versionData = JSON.parse(JSON.stringify(manifest));
                versions[`${key}`] = {};
                versions[`${key}`].md5 = md5;
                versions[`${key}`].version = manifest.version;
                this.insertVersionData(versionDatas, manifest.bundle, projectData, versionData, projectManifestPath, versionManifestPath, md5);
            }
            //写入所有版本
            let versionsPath = (0, path_1.join)(manifestDir, `versions.json`);
            (0, fs_1.writeFileSync)(versionsPath, JSON.stringify(versions));
            this.logger.log(`${this.module}生成versions.json成功`);
            this.cur = this.cur + 1;
            await this.zipVersions(versions);
            this.createVersionFile(versionDatas);
            resolve(true);
        });
    }
    /**@description 删除不包含在包内的所有bundles */
    async removeNotInApkBundle() {
        this.onSetProcess(true);
        let data = this.data;
        let keys = Object.keys(data.bundles);
        let removeBundles = [];
        keys.forEach((key) => {
            if (!data.bundles[key].includeApk) {
                removeBundles.push(key);
            }
        });
        let manifests = [];
        let removeDirs = [];
        for (let i = 0; i < removeBundles.length; i++) {
            let key = removeBundles[i];
            removeDirs.push((0, path_1.join)(data.buildDir, `assets/${key}`));
            manifests.push((0, path_1.join)(data.buildDir, `manifest/${key}_project.json`));
            manifests.push((0, path_1.join)(data.buildDir, `manifest/${key}_version.json`));
        }
        for (let i = 0; i < removeDirs.length; i++) {
            this.logger.log(`${this.module}删除目录 : ${removeDirs[i]}`);
            await FileUtils_1.default.instance.delDir(removeDirs[i]);
        }
        for (let i = 0; i < manifests.length; i++) {
            this.logger.log(`${this.module}删除版本文件 : ${manifests[i]}`);
            FileUtils_1.default.instance.delFile(manifests[i]);
        }
        this.onSetProcess(false);
    }
    /**
     * @description 部署到本地测试服务器，后面可以考虑支持上传到远程
     */
    async deployToRemote() {
        this.isDeploy = true;
        let data = this.data;
        if (data.remoteDir.length <= 0) {
            this.logger.log(`${this.module}请先选择本地服务器目录`);
            return;
        }
        // if (!existsSync(data.remoteDir)) {
        //     this.logger.log(`${this.module}本地测试服务器目录不存在 : ${data.remoteDir}`);
        //     return;
        // }
        if (!(0, fs_1.existsSync)(data.buildDir)) {
            this.logger.log(`${this.module}构建目录不存在 : ${data.buildDir} , 请先构建`);
            return;
        }
        this.onSetProcess(true);
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
            }
            else {
                dir = dir.substring(0, index);
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            }
        }
        let copyDirs = ["manifest"].concat(temps);
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = (0, path_1.join)(data.buildDir, copyDirs[i]);
            dir = (0, path_1.normalize)(dir);
            if (!(0, fs_1.existsSync)(dir)) {
                this.logger.log(`${this.module}${data.buildDir}不存在${copyDirs[i]}目录,无法拷贝文件`);
                return;
            }
        }
        this.logger.log(`${this.module}开始拷贝文件到 : ${data.remoteDir}`);
        this._cur = 0;
        this.total = 1 + copyDirs.length;
        this.logger.log(`${this.module}删除旧目录 : ${data.remoteDir}`);
        await FileUtils_1.default.instance.delDir(data.remoteDir);
        FileUtils_1.default.instance.createDir(data.remoteDir);
        this.cur = 0;
        for (let i = 0; i < copyDirs.length; i++) {
            let source = (0, path_1.join)(data.buildDir, copyDirs[i]);
            let dest = (0, path_1.join)(data.remoteDir, copyDirs[i]);
            // this.logger.log(`${this.module}准备复制${source} => ${dest}`);
            await FileUtils_1.default.instance.copyDir(source, dest);
            // this.logger.log(`${this.module}复制完成${source} => ${dest}`);
            this.cur = this.cur + 1;
        }
        let source = this.zipPath;
        let dest = (0, path_1.join)(data.remoteDir, "zips");
        // this.logger.log(`${this.module}准备复制${source} => ${dest}`);
        await FileUtils_1.default.instance.copyDir(source, dest);
        // this.logger.log(`${this.module}复制完成${source} => ${dest}`);
        this.cur = this.cur + 1;
        this.logger.log(`${this.module}全部完成`);
        this.onSetProcess(false);
    }
    /**@description 插入热更新代码*/
    async insertHotupdate(dest) {
        let codePath = (0, path_1.join)(this.curExtensionPath, "code/hotupdate.js");
        let code = (0, fs_1.readFileSync)(codePath, "utf8");
        // console.log(code);
        let sourcePath = (0, path_1.join)(dest, "assets/main.js");
        sourcePath = (0, path_1.normalize)(sourcePath);
        let sourceCode = (0, fs_1.readFileSync)(sourcePath, "utf8");
        let templateReplace = function templateReplace() {
            return arguments[1] + code + arguments[3];
        };
        //添加子游戏测试环境版本号
        sourceCode = sourceCode.replace(/(\);)([\s\w\S]*)(const[ ]*importMapJson)/g, templateReplace);
        this.logger.log(`${this.module}向${sourcePath}中插入热更新代码`);
        (0, fs_1.writeFileSync)(sourcePath, sourceCode, { "encoding": "utf8" });
    }
}
exports.default = Helper;
