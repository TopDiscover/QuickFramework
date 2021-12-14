"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const Electron = require("electron");
const Tools_1 = require("../../common/Tools");
class _Helper {
    constructor() {
        this.elements = {
            /**@description 主包版本号 */
            version: "#version",
            /**@description 主包服务器地址 */
            serverIP: "#serverIP",
            /**@description 使用本机按钮 */
            userLocalIP: "#userLocalIP",
            /**@description 服务器选择历史地址 */
            historyServerIPSelect: "#historyServerIPSelect",
            /**@description 构建目录 */
            buildDir: "#buildDir",
            /**@description 选择构建目录 */
            selectBulidDir: "#selectBulidDir",
            /**@description 打开构建目录 */
            openSelectBulidDir: "#openSelectBulidDir",
            /**@description Manifest输出目录 */
            manifestDir: "#manifestDir",
            /**@description 打开Manifest输出目录 */
            openManifestDir: "#openManifestDir",
            /**@description 删除bundle */
            delBunles: "#delBunles",
            /**@description 生成Manifest */
            createManifest: "#createManifest",
            /**@description 远程主包地址 */
            remoteUrl: "#remoteUrl",
            /**@description 刷新远程主包地址 */
            refreshMainVersion: "#refreshMainVersion",
            /**@description 远程物理路径 */
            remoteDir: "#remoteDir",
            /**@description 选择远程物理路径 */
            selectRemoteDir: "#selectRemoteDir",
            /**@description 打开远程物理路径 */
            openSelectRemoteDir: "#openSelectRemoteDir",
            /**@description 部署 */
            deployToRemote: "#deployToRemote",
            /**@description 部署进度 */
            deployProgress: "#deployProgress",
            /**@description 日志 */
            logView: "#logView",
        };
        /**@description 保存读取成功的Html */
        this.view = null;
        this.userCache = {
            /**@description 主包版本号 */
            version: "",
            /**@description 当前服务器地址 */
            serverIP: "",
            /**@description 服务器历史地址 */
            historyIps: [],
            historySelectedUrl: "",
            /**@description 构建项目目录 */
            buildDir: "",
            /**@description 各bundle的版本配置 */
            bundles: {},
            /**@description 远程服务器地址 */
            remoteUrl: "",
            /**@description 远程各bundle的版本配置 */
            remoteBundleUrls: {},
            /**@description 远程服务器所在目录 */
            remoteDir: "",
        };
        this.bundles = {};
        this._isDoCreate = false;
        this._config = null;
        this._template = null;
    }
    get userCachePath() {
        return path.join(Editor.Project.path + "/packages/config/userCache.json");
    }
    getManifestDir(buildDir) {
        if (buildDir && buildDir.length > 0) {
            return buildDir + "/manifest";
        }
        else {
            return "";
        }
    }
    /**@description 保存当前用户设置 */
    saveUserCache() {
        let cacheString = JSON.stringify(this.userCache);
        fs.writeFileSync(this.userCachePath, cacheString);
        // this.addLog(`写入缓存 :`, userCache);
    }
    /**@description 检证数据 */
    checkUserCache() {
        //把不存在的bundle信息删除
        let notExist = [];
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
        Object.keys(this.userCache.remoteBundleUrls).forEach((value) => {
            if (this.bundles[value] == undefined || this.bundles[value] == null) {
                notExist.push(value);
            }
        });
        for (let i = 0; i < notExist.length; i++) {
            delete this.userCache.remoteBundleUrls[notExist[i]];
            isRemoved = true;
        }
        return isRemoved;
    }
    /**@description 生成默认缓存 */
    generateDefaultUseCache() {
        this.userCache.version = this.config.version;
        this.userCache.serverIP = this.config.packageUrl;
        this.userCache.historyIps = [this.userCache.serverIP];
        this.userCache.buildDir = "";
        this.userCache.bundles = this.bundles;
        this.userCache.remoteUrl = "-";
        this.userCache.remoteBundleUrls = {},
            Object.keys(this.bundles).forEach((key) => {
                this.userCache.remoteBundleUrls[key] = "-";
            });
        this.userCache.remoteDir = "";
    }
    /**@description 读取本地缓存 */
    readCache() {
        if (fs.existsSync(this.userCachePath)) {
            let data = fs.readFileSync(this.userCachePath, "utf-8");
            this.userCache = JSON.parse(data);
            if (this.checkUserCache()) {
                this.saveUserCache();
            }
            //this.addLog(`存在缓存 : ${userCachePath}`, userCache);
        }
        else {
            //this.addLog(`不存在缓存 : ${userCachePath}`);
            this.generateDefaultUseCache();
            this.addLog(`生存默认缓存 : `, this.userCache);
            this.saveUserCache();
        }
    }
    /**@description 初始化UI数据 */
    initUIDatas() {
        this.view.version.value = this.userCache.version;
        this.view.serverIP.value = this.userCache.serverIP;
        setTimeout(() => {
            this.updateHistoryUrl();
            if (this.userCache.historySelectedUrl = "") {
                this.userCache.historySelectedUrl = this.userCache.historyIps[0];
            }
            let isFind = false;
            let options = this.view.historyServerIPSelect.$select.options;
            for (let i = 0; i < options.length; i++) {
                if (options.text == this.userCache.historySelectedUrl) {
                    this.view.historyServerIPSelect.$select.value = i;
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                this.userCache.historySelectedUrl = this.userCache.historyIps[0];
                this.view.historyServerIPSelect.$select.value = 0;
            }
        }, 10);
        this.view.buildDir.value = this.userCache.buildDir;
        this.view.manifestDir.value = this.getManifestDir(this.userCache.buildDir);
        this.view.remoteDir.value = this.userCache.remoteDir;
        //bundles 配置
        //`is${gameInfo.dir}includeApp`
        Object.keys(this.userCache.bundles).forEach((key) => {
            //是否在包内
            this.view[`is${key}includeApp`].value = this.userCache.bundles[key].includeApk;
            //版本号
            this.view[`${key}Version`].value = this.userCache.bundles[key].version;
        });
        //测试环境
        this.onRefreshMainVersion();
        Object.keys(this.userCache.bundles).forEach((key) => {
            this.onRefreshBundleLocalServerVersion(key);
        });
    }
    /**@description 返回远程显示地址+版本号 */
    getShowRemoteString(config) {
        return `[${config.version}] : ${config.md5}`;
    }
    /**@description 初始化数据 */
    initDatas() {
        this._isDoCreate = false;
        this.readCache();
        this.initUIDatas();
    }
    /**@description 绑定界面事件 */
    bindingEvents() {
        let view = this.view;
        this.view.userLocalIP.addEventListener("confirm", this.onUseLocalIP.bind(this));
        this.view.serverIP.addEventListener("blur", this.onInputServerUrlOver.bind(this, this.view.serverIP));
        this.view.historyServerIPSelect.addEventListener("change", this.onHistoryServerIPChange.bind(this, this.view.historyServerIPSelect));
        this.view.version.addEventListener("blur", this.onVersionChange.bind(this, this.view.version));
        //bundles 版本设置
        let keys = Object.keys(this.userCache.bundles);
        keys.forEach((key) => {
            //是否在包内
            //this.$[`is${key}includeApp`].value = userCache.bundles[key].includeApk;
            //版本号
            view[`${key}Version`].addEventListener('blur', this.onBundleVersionChange.bind(this, view[`${key}Version`], key));
        });
        //选择构建目录
        this.view.selectBulidDir.addEventListener("confirm", this.onBuildDirConfirm.bind(this, this.view.selectBulidDir));
        //打开构建目录
        this.view.openSelectBulidDir.addEventListener("confirm", this.onOpenSelectBulidDir.bind(this));
        //打开Manifest目录
        this.view.openManifestDir.addEventListener("confirm", this.onOpenManifestDir.bind(this));
        //本地测试目录
        //打开本地测试服务器路径
        this.view.selectRemoteDir.addEventListener("confirm", this.onRemoteDirConfirm.bind(this));
        this.view.openSelectRemoteDir.addEventListener("confirm", this.onOpenRemoteDir.bind(this));
        //生成
        this.view.createManifest.addEventListener("confirm", this.onCreateManifest.bind(this, this.view.createManifest));
        //部署
        this.view.deployToRemote.addEventListener("confirm", this.onDeployToRemote.bind(this));
        //主包地址刷新 
        this.view.refreshMainVersion.addEventListener("confirm", this.onRefreshMainVersion.bind(this));
        //refresh${gameInfo.dir}Version 子包地址刷新
        keys.forEach((key) => {
            view[`is${key}includeApp`].addEventListener("confirm", this.onIncludeAppChange.bind(this, view[`is${key}includeApp`], key));
            view[`refresh${key}Version`].addEventListener("confirm", this.onRefreshBundleLocalServerVersion.bind(this, key));
        });
        //删除不包含在包内的bundles
        this.view.delBunles.addEventListener("confirm", this.onDelBundles.bind(this));
    }
    //初始化
    init(view) {
        this.view = view;
        this.initDatas();
        this.bindingEvents();
    }
    onIncludeAppChange(element, key) {
        // console.log("element",element);
        // console.log("key",key);
        // console.log("value",element.value);
        this.userCache.bundles[key].includeApk = element.value;
        this.saveUserCache();
    }
    /**@description 删除不包含在包内的bundles */
    onDelBundles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isDoCreate())
                return;
            //弹出提示确定是否需要删除当前的子游戏
            Editor.Panel.open('confirm_del_subgames');
        });
    }
    onConfirmDelBundle() {
        this.removeNotInApkBundle();
    }
    /**@description 删除不包含在包内的所有bundles */
    removeNotInApkBundle() {
        let keys = Object.keys(this.userCache.bundles);
        let removeBundles = [];
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
            Tools_1.Tools.delDir(removeDirs[i], true);
        }
        for (let i = 0; i < manifests.length; i++) {
            this.addLog(`删除版本文件 : ${manifests[i]}`);
            Tools_1.Tools.delFile(manifests[i]);
        }
    }
    /**
     * @description 刷新测试环境主包信息
     */
    onRefreshMainVersion() {
        if (this.isDoCreate())
            return;
        if (this.userCache.remoteDir.length > 0) {
            let versionManifestPath = path.join(this.userCache.remoteDir, "manifest/main_version.json");
            fs.readFile(versionManifestPath, "utf-8", (err, data) => {
                if (err) {
                    this.addLog(`找不到 : ${versionManifestPath}`);
                }
                else {
                    let config = JSON.parse(data);
                    this.view.remoteUrl.value = this.getShowRemoteString(config);
                    this.saveUserCache();
                }
            });
        }
        else {
            this.addLog(`只能刷新部署在本地的版本`);
        }
    }
    /**
     * @description 刷新测试环境子包信息
     * @param {*} key
     */
    onRefreshBundleLocalServerVersion(key) {
        if (this.isDoCreate())
            return;
        if (this.userCache.remoteDir.length > 0) {
            let versionManifestPath = path.join(this.userCache.remoteDir, `manifest/${key}_version.json`);
            fs.readFile(versionManifestPath, "utf-8", (err, data) => {
                if (err) {
                    this.addLog(`找不到 : ${versionManifestPath}`);
                }
                else {
                    let config = JSON.parse(data);
                    this.view[`${key}remoteUrl`].value = this.getShowRemoteString(config);
                    this.saveUserCache();
                }
            });
        }
        else {
            this.addLog(`只能刷新部署在本地的版本`);
        }
    }
    /**
     * @description 部署
     */
    onDeployToRemote() {
        if (this.isDoCreate())
            return;
        if (this.userCache.remoteDir.length <= 0) {
            this.addLog("[部署]请先选择本地服务器目录");
            return;
        }
        if (!fs.existsSync(this.userCache.remoteDir)) {
            this.addLog(`[部署]本地测试服务器目录不存在 : ${this.userCache.remoteDir}`);
            return;
        }
        if (!fs.existsSync(this.userCache.buildDir)) {
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
            }
            else {
                dir = dir.substr(0, index);
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            }
        }
        let copyDirs = ["manifest"].concat(temps);
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = path.join(this.userCache.buildDir, copyDirs[i]);
            if (!fs.existsSync(dir)) {
                this.addLog(`${this.userCache.buildDir} [部署]不存在${copyDirs[i]}目录,无法拷贝文件`);
                return;
            }
        }
        this.addLog(`[部署]开始拷贝文件到 : ${this.userCache.remoteDir}`);
        this.view.deployProgress.value = 0;
        this.addLog(`[部署]删除旧目录 : ${this.userCache.remoteDir}`);
        let count = Tools_1.Tools.getDirFileCount(this.userCache.remoteDir);
        this.addLog(`[部署]删除文件个数:${count}`);
        Tools_1.Tools.delDir(this.userCache.remoteDir);
        count = 0;
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = path.join(this.userCache.buildDir, copyDirs[i]);
            count += Tools_1.Tools.getDirFileCount(dir);
        }
        //压缩文件数量
        let zipPath = Editor.Project.path + "/PackageVersion";
        count += Tools_1.Tools.getDirFileCount(zipPath);
        this.addLog(`[部署]复制文件个数 : ${count}`);
        for (let i = 0; i < copyDirs.length; i++) {
            let source = path.join(this.userCache.buildDir, copyDirs[i]);
            let dest = path.join(this.userCache.remoteDir, copyDirs[i]);
            Tools_1.Tools.copySourceDirToDesDir(source, dest, () => {
                this.addProgress();
            });
        }
        let remoteZipPath = path.join(this.userCache.remoteDir, "zips");
        Tools_1.Tools.delDir(remoteZipPath);
        //部署压缩文件
        Tools_1.Tools.copySourceDirToDesDir(zipPath, remoteZipPath, () => {
            this.addProgress();
        });
    }
    addProgress() {
        let value = this.view.deployProgress.value;
        value = value + 1;
        if (value > 100) {
            value = 100;
        }
        this.view.deployProgress.value = value;
    }
    /**@description 返回需要添加到主包版本的文件目录 */
    getMainBundleIncludes() {
        return [
            "src",
            "assets/internal",
            "assets/main",
            "assets/resources",
        ];
    }
    /**@description 生成manifest版本文件 */
    onCreateManifest() {
        if (this.isDoCreate())
            return;
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
        let manifest = {
            assets: {},
            bundle: "main"
        };
        //删除旧的版本控件文件
        this.addLog("删除旧的Manifest目录", manifestDir);
        if (fs.existsSync(manifestDir)) {
            this.addLog("存在旧的，删除掉");
            Tools_1.Tools.delDir(manifestDir);
        }
        Tools_1.Tools.mkdirSync(manifestDir);
        //读出主包资源，生成主包版本
        let mainIncludes = this.getMainBundleIncludes();
        for (let i = 0; i < mainIncludes.length; i++) {
            Tools_1.Tools.readDir(path.join(buildDir, mainIncludes[i]), manifest.assets, buildDir);
        }
        //生成project.manifest
        let projectManifestPath = path.join(manifestDir, "main_project.json");
        let versionManifestPath = path.join(manifestDir, "main_version.json");
        let content = JSON.stringify(manifest);
        let md5 = require("crypto").createHash('md5').update(content).digest('hex');
        manifest.md5 = md5;
        manifest.version = version;
        fs.writeFileSync(projectManifestPath, JSON.stringify(manifest));
        this.addLog(`生成${projectManifestPath}成功`);
        delete manifest.assets;
        fs.writeFileSync(versionManifestPath, JSON.stringify(manifest));
        this.addLog(`生成${versionManifestPath}成功`);
        //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
        let versions = {
            main: { md5: md5, version: version },
        };
        //生成各bundles版本文件
        for (let i = 0; i < subBundles.length; i++) {
            let key = subBundles[i];
            this.addLog(`正在生成:${key}`);
            let manifest = {
                assets: {},
                bundle: key
            };
            Tools_1.Tools.readDir(path.join(buildDir, `assets/${key}`), manifest.assets, buildDir);
            projectManifestPath = path.join(manifestDir, `${key}_project.json`);
            versionManifestPath = path.join(manifestDir, `${key}_version.json`);
            let content = JSON.stringify(manifest);
            let md5 = require("crypto").createHash('md5').update(content).digest('hex');
            manifest.md5 = md5;
            manifest.version = this.userCache.bundles[key].version;
            fs.writeFileSync(projectManifestPath, JSON.stringify(manifest));
            this.addLog(`生成${projectManifestPath}成功`);
            delete manifest.assets;
            versions[`${key}`] = {};
            versions[`${key}`].md5 = md5;
            versions[`${key}`].version = manifest.version;
            fs.writeFileSync(versionManifestPath, JSON.stringify(manifest));
            this.addLog(`生成${versionManifestPath}成功`);
        }
        //写入所有版本
        let versionsPath = path.join(manifestDir, `versions.json`);
        fs.writeFileSync(versionsPath, JSON.stringify(versions));
        this.addLog(`生成versions.json成功`);
        Tools_1.Tools.zipVersions({
            mainIncludes: mainIncludes,
            versions: versions,
            buildDir: this.userCache.buildDir,
            log: (data) => {
                this.addLog(data);
            },
            bundles: this.config.bundles
        });
        this._isDoCreate = false;
    }
    /**
     * @description 本地测试服务器选择确定
     * @param {*} element
     */
    onRemoteDirConfirm(element) {
        if (this.isDoCreate())
            return;
        let result = Editor.Dialog.openFile({
            title: "选择本地测试服务器路径",
            defaultPath: Editor.Project.path,
            properties: ["openDirectory"]
        });
        if (-1 !== result) {
            let fullPath = result[0];
            this.userCache.remoteDir = fullPath;
            this.view.remoteDir.value = fullPath;
            this.saveUserCache();
        }
    }
    onOpenRemoteDir() {
        this.openDir(this.userCache.remoteDir);
    }
    onOpenSelectBulidDir() {
        this.openDir(this.userCache.buildDir);
    }
    onOpenManifestDir() {
        this.openDir(this.getManifestDir(this.userCache.buildDir));
    }
    openDir(dir) {
        if (fs.existsSync(dir)) {
            Electron.shell.showItemInFolder(dir);
            Electron.shell.beep();
        }
        else {
            this.addLog("目录不存在：" + dir);
        }
    }
    /**
     * @description 构建目录选择
     * @param {*} element
     */
    onBuildDirConfirm(element) {
        if (this.isDoCreate())
            return;
        let result = Editor.Dialog.openFile({
            title: "选择构建后的根目录",
            defaultPath: Editor.Project.path,
            properties: ["openDirectory"]
        });
        if (-1 !== result) {
            let fullPath = result[0];
            if (this.checkBuildDir(fullPath)) {
                this.userCache.buildDir = fullPath;
                this.view.buildDir.value = fullPath;
                this.view.manifestDir.value = this.getManifestDir(this.userCache.buildDir);
                this.saveUserCache();
            }
        }
    }
    checkBuildDir(fullPath) {
        if (fs.existsSync(fullPath)) {
            //检测是否存在src / assets目录
            let srcPath = path.join(fullPath, "src");
            let assetsPath = path.join(fullPath, "assets");
            if (fs.existsSync(srcPath) && fs.existsSync(assetsPath)) {
                return true;
            }
        }
        this.addLog(`请先构建项目`);
        return false;
    }
    /** @description 主版本号输入*/
    onVersionChange(element) {
        if (this.isDoCreate())
            return;
        let version = element.value;
        //有效版本
        this.userCache.version = version;
        this.saveUserCache();
    }
    /**
     * @description bundle输入版本号变化
     * @param {*} element
     * @param {*} key
     * @returns
     */
    onBundleVersionChange(element, key) {
        if (this.isDoCreate())
            return;
        let version = element.value;
        this.userCache.bundles[key].version = version;
        this.saveUserCache();
    }
    /**
     * @description 切换历史地址
     * @param element 控件自身
     */
    onHistoryServerIPChange(element) {
        if (this.isDoCreate())
            return;
        //先拿到选中项
        let options = this.view.historyServerIPSelect.$select.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == element.value) {
                this.userCache.serverIP = options[i].text;
                break;
            }
        }
        this.onInputServerUrlOver();
    }
    /** @description 点击了使用本机*/
    onUseLocalIP() {
        if (this.isDoCreate())
            return;
        let network = os.networkInterfaces();
        let url = "";
        Object.keys(network).forEach((key) => {
            network[key].forEach((info) => {
                if (info.family == "IPv4" && !info.internal) {
                    url = info.address;
                }
            });
        });
        if (url.length > 0) {
            this.userCache.serverIP = "http://" + url;
        }
        this.onInputServerUrlOver();
    }
    /**
     * @description 输入服务器地址结束
     * @param {*} element
     * @returns
     */
    onInputServerUrlOver(element) {
        if (this.isDoCreate())
            return;
        let url = this.userCache.serverIP;
        if (element) {
            //从输入框过来的
            url = element.value;
            if (url.length <= 0) {
                return;
            }
        }
        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
            this.addLog(url + `不是以http://https://开头，或者不是网址`);
            return;
        }
        this.view.serverIP.value = url;
        this.userCache.serverIP = url;
        if (this.addHotAddress(url)) {
            this.updateHistoryUrl();
        }
        this.saveUserCache();
    }
    /**@description 更新历史地址 */
    updateHistoryUrl() {
        this.view.historyServerIPSelect.$select.options.length = 0;
        for (let i = 0; i < this.userCache.historyIps.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = this.userCache.historyIps[i];
            this.view.historyServerIPSelect.$select.options.add(option);
        }
    }
    /**
     * @description 添加历史地址
     * @param url
     * */
    addHotAddress(url) {
        if (this.userCache.historyIps.indexOf(url) == -1) {
            this.userCache.historyIps.push(url);
            this.addLog(`添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    }
    /**
     * @description 是否正在创建
     * @returns
     */
    isDoCreate() {
        if (this._isDoCreate) {
            this.addLog(`正在执行生成操作，请勿操作`);
        }
        return this._isDoCreate;
    }
    /**
     * @description 添加日志
     * @param {*} message
     * @param {*} obj
     * @returns
     */
    addLog(message, obj) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log(message, obj);
        }
        else {
            Editor.log(message);
        }
        let text = "";
        if (obj == null) {
            text = message;
        }
        else if (typeof obj == "object") {
            text = message + JSON.stringify(obj);
        }
        else {
            text = message + obj.toString();
        }
        let temp = this.view.logView.value;
        if (temp.length > 0) {
            this.view.logView.value = temp + "\n" + text;
        }
        else {
            this.view.logView.value = text;
        }
        setTimeout(() => {
            this.view.logView.scrollTop = this.view.logView.scrollHeight;
        }, 10);
    }
    /**@description 获取index.html的内容 */
    get indexHtmlContent() {
        let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/hotupdate/panel/index.html"), "utf-8");
        return content;
    }
    get config() {
        if (this._config) {
            return this._config;
        }
        let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/config/bundles.json"), "utf-8");
        this._config = JSON.parse(content);
        return this._config;
    }
    get style() {
        let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/hotupdate/panel/index.css"), "utf-8");
        return content;
    }
    generateTemplate() {
        let _template = this.indexHtmlContent;
        //生成子游戏版本控制界面
        //生成子游戏测环境版本号
        let _subGameServerVersionView = ``;
        let _subGameVersionView = ``;
        for (let i = 0; i < this.config.bundles.length; i++) {
            let gameInfo = this.config.bundles[i];
            if (gameInfo.dir && gameInfo.dir.length > 0) {
                _subGameVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <ui-checkbox id = "is${gameInfo.dir}includeApp"> 是否包含在原始包内 </ui-checkbox>
                <ui-input class="flex-1" id = "${gameInfo.dir}Version"></ui-input>
            </div>
        </ui-prop>
        `;
                this.elements[`is${gameInfo.dir}includeApp`] = `#is${gameInfo.dir}includeApp`;
                this.elements[`${gameInfo.dir}Version`] = `#${gameInfo.dir}Version`;
                _subGameServerVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <ui-input disabled="disabled" id = "${gameInfo.dir}remoteUrl" class="flex-2"></ui-input>
                <ui-button class="end-justified" id = "refresh${gameInfo.dir}Version"><i
                    class="icon-arrows-cw"></i></ui-button>
            </div>
        </ui-prop>
        `;
                this.elements[`${gameInfo.dir}remoteUrl`] = `#${gameInfo.dir}remoteUrl`;
                this.elements[`refresh${gameInfo.dir}Version`] = `#refresh${gameInfo.dir}Version`;
                this.bundles[gameInfo.dir] = JSON.parse(JSON.stringify(gameInfo));
            }
        }
        let templateReplaceManifest = function templateReplace() {
            return arguments[1] + _subGameVersionView + arguments[3];
        };
        //添加子游戏版本配置
        _template = _template.replace(/(<!--subgame start-->)([\s\w\S]*)(<!--subgame end-->)/g, templateReplaceManifest);
        let templateReplaceTestManifest = function templateReplace() {
            return arguments[1] + _subGameServerVersionView + arguments[3];
        };
        //添加子游戏测试环境版本号
        _template = _template.replace(/(<!--subgame test start-->)([\s\w\S]*)(<!--subgame test end-->)/g, templateReplaceTestManifest);
        return _template;
    }
    get template() {
        if (this._template) {
            return this._template;
        }
        this._template = this.generateTemplate();
        return this._template;
    }
}
const Helper = new _Helper();
Editor.Panel.extend({
    style: Helper.style,
    template: Helper.template,
    $: Helper.elements,
    ready() {
        //先存储下所有读取到的html控件
        let view = {};
        Object.keys(Helper.elements).forEach((key) => {
            view[key] = this[`$${key}`];
        });
        Helper.init(view);
    },
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            Helper.onConfirmDelBundle();
        }
    }
});
