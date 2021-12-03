import { HotUpdate } from "./Hotupdate";
import { game, sys } from "cc";
import { DEBUG, JSB, PREVIEW } from "cc/env";

class AssetsManager {

    constructor(name: string) {
        this.name = name;
    }

    /**@description  当前资源管理器的状态*/
    code: any = -1;
    /**@description 当前资源管理器的名称 */
    name: string = "";
    /**@description 当前资源管理器的实体 jsb.AssetsManager */
    manager: jsb.AssetsManager = null!;

    reset(){
        this.manager.reset();
    }
}

const MAIN_PACK = "main";

/**
 * @description 热更新组件
 */
export class HotupdateManager {
    private static _instance: HotupdateManager = null!;
    public static Instance() { return this._instance || (this._instance = new HotupdateManager()); }
    private manifestRoot: string = `manifest/`;
    /**@description 本地存储热更新文件的路径 */
    private storagePath = "";
    /**@description 是否在热更新中或检测更新状态 */
    private updating = false;

    private _hotUpdateUrl = "";
    /**@description 通用的热更新地址，当在子游戏或大厅未指定热更新地址时，都统一使用服务器传回来的默认全局更新地址 */
    public get hotUpdateUrl(): string {
        Log.d(`当前热更新地址为:${this._hotUpdateUrl}`);
        return this._hotUpdateUrl;
    }
    public set hotUpdateUrl(value) {
        this._hotUpdateUrl = value;
    }

    /**@description 是否路过热更新 */
    public isSkipCheckUpdate = true;

    /**@description 大厅本地的版本项目更新文件配置路径 */
    public get mainVersionMainfest() {
        return `${this.manifestRoot}main_version.json`;
    }
    /**@description 检测更新回调 */
    public checkCallback: ((code: HotUpdate.Code, state: HotUpdate.State) => void) | null = null;

    /**@description bundle版本信息 */
    public bundlesConfig: { [key: string]: HotUpdate.BundleConfig } = {};

    /**@description 资源管理器 */
    private assetsManagers: { [key: string]: AssetsManager } = {};

    /**@description 当前热更新的资源管理器 */
    private currentAssetsManager: AssetsManager = null!;

    /**@description 第一次检测完成主包后，预下载该热更新下对应的所有bundle的版本号配置，如果在进入bundle时，发现与当前主包版本不匹配，则提示玩家退回登录，更新主包 */
    private versions: any = null;

    /**@description 获取Bundle名 */
    public getBundleName(bundle: string) {
        return this.bundlesConfig[bundle];
    }

    /**@description 释放资源管理器，默认为hall 大厅资源管理器 */
    private restAssetsManager(name: string = MAIN_PACK) {
        if (this.assetsManagers[name]) {
            Log.d("restAssetsManager : " + name);
            this.currentAssetsManager.reset();
        }
    }

    /**@description 获取资源管理器，默认为hall 大厅的资源管理器 */
    private getAssetsManager(name: string = MAIN_PACK) {
        //初始化资源管理器
        if (JSB) {
            this.storagePath = jsb.fileUtils.getWritablePath();
            Log.d(`Storage path for remote asset : ${this.storagePath}`);
            this.assetsManagers[name] = new AssetsManager(name);
            this.assetsManagers[name].manager = new jsb.AssetsManager(name == MAIN_PACK ? `type.${MAIN_PACK}` : `type.${name}`, this.storagePath);
            //设置下载并发量
            this.assetsManagers[name].manager.setPackageUrl(this.hotUpdateUrl);
        }
        return this.assetsManagers[name];
    }

    /**@description 判断是否需要重新尝试下载之前下载失败的文件 */
    private isTryDownloadFailedAssets() {
        if (this.currentAssetsManager && (
            this.currentAssetsManager.manager.getState() == HotUpdate.State.FAIL_TO_UPDATE as any ||
            this.currentAssetsManager.code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
            this.currentAssetsManager.code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
            this.currentAssetsManager.code == HotUpdate.Code.ERROR_PARSE_MANIFEST)
        ) {
            return true;
        }
        return false;
    }

    /**@description 是否是预览或浏览器 */
    private get isBrowser() {
        return sys.platform == sys.Platform.WECHAT_GAME || PREVIEW || sys.isBrowser;
    }

    private isNeedUpdate(callback: (code: HotUpdate.Code, state: HotUpdate.State) => void) {
        if (this.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            this.updating = false;
            callback(HotUpdate.Code.ALREADY_UP_TO_DATE, HotUpdate.State.UP_TO_DATE);
            return false;
        } else {
            if (this.isSkipCheckUpdate) {
                Log.d("跳过热更新，直接使用本地资源代码");
                this.updating = false;
                callback(HotUpdate.Code.ALREADY_UP_TO_DATE, HotUpdate.State.UP_TO_DATE);
            }
            return !this.isSkipCheckUpdate;
        }
    }

    /**@description 检测更新 */
    private _checkUpdate(callback: (code: HotUpdate.Code, state: HotUpdate.State) => void) {
        if (this.isNeedUpdate(callback)) {
            Log.d(`--checkUpdate--`);
            if (this.updating) {
                Log.d(`Checking or updating...`);
                callback(HotUpdate.Code.CHECKING, HotUpdate.State.PREDOWNLOAD_VERSION);
                return;
            }
            if (!this.currentAssetsManager.manager.getLocalManifest() || !this.currentAssetsManager.manager.getLocalManifest().isLoaded()) {
                Log.d(`Failed to load local manifest ....`);
                callback(HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST, HotUpdate.State.FAIL_TO_UPDATE);
                return;
            }
            if (this.isTryDownloadFailedAssets()) {
                //已经更新失败，尝试获取更新下载失败的
                Log.d(`之前下载资源未完全下载完成，请尝试重新下载`);
                callback(HotUpdate.Code.UPDATE_FAILED, HotUpdate.State.TRY_DOWNLOAD_FAILED_ASSETS);
            } else {
                this.updating = true;
                this.checkCallback = callback;
                this.currentAssetsManager.manager.setEventCallback(this.checkCb.bind(this));
                this.currentAssetsManager.manager.checkUpdate();
            }
        }
    }

    downloadFailedAssets() {
        if (this.currentAssetsManager) {
            this.currentAssetsManager.manager.downloadFailedAssets();
        }
    }

    /**@description 检查主包是否需要更新 */
    private checkMainUpdate(callback: (code: HotUpdate.Code, state: HotUpdate.State) => void) {
        if (this.isNeedUpdate(callback)) {
            this.currentAssetsManager = this.getAssetsManager();
            this.currentAssetsManager.manager.loadLocalManifest(this.mainVersionMainfest);
            this._checkUpdate(callback);
        }
    }

    /**
     * @description 检测更新
     * @param callback 回调
     * @param bundle bundle,如果不传，则为对主包的检测
     */
    checkUpdate(callback: (code: HotUpdate.Code, state: HotUpdate.State) => void, bundle?: string) {
        if (typeof bundle == "string") {
            this.checkBundleUpdate(bundle, callback);
        } else {
            this.checkMainUpdate(callback);
        }
    }

    /**
     * @description 获取bundlemanifest url
     * @param bundle bundle
     * @returns manifest url
     */
    private getBundleManifest(bundle: string): string {
        return `${this.manifestRoot}${bundle}_project.json`;
    }

    /**
     * @description 检测Bundle更新
     * @param bundle 子游戏名
     * @param callback 检测完成回调
     */
    private checkBundleUpdate(bundle: string, callback: (code: HotUpdate.Code, state: HotUpdate.State) => void) {
        if (this.isNeedUpdate(callback)) {
            this.currentAssetsManager = this.getAssetsManager(bundle);
            let manifestUrl = this.getBundleManifest(bundle);

            //先检测本地是否已经存在子游戏版本控制文件 
            if (jsb.fileUtils.isFileExist(manifestUrl)) {
                //存在版本控制文件 
                let content = jsb.fileUtils.getStringFromFile(manifestUrl);
                let jsbGameManifest = new jsb.Manifest(content, this.storagePath, this.hotUpdateUrl);
                Log.d(`--存在本地版本控制文件checkUpdate--`);
                Log.d(`mainifestUrl : ${manifestUrl}`);
                this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
                this._checkUpdate(callback);
            } else {
                //不存在版本控制文件 ，生成一个初始版本
                if (this.updating) {
                    Log.d(`Checking or updating...`);
                    callback(HotUpdate.Code.CHECKING, HotUpdate.State.PREDOWNLOAD_VERSION);
                    return;
                }
                let gameManifest = {
                    version: "0",
                    bundle: bundle,
                    md5 : "unknown",
                };
                let gameManifestContent = JSON.stringify(gameManifest);
                let jsbGameManifest = new jsb.Manifest(gameManifestContent, this.storagePath, this.hotUpdateUrl);
                Log.d(`--checkUpdate--`);
                Log.d(`mainifest content : ${gameManifestContent}`);
                this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
                this._checkUpdate(callback);
            }
        }
    }

    /**@description 检测更新 */
    private checkCb(event: any) {

        //这里不能置空，下载manifest文件也会回调过来
        //this.checkCallback = null;
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.currentAssetsManager.code = event.getEventCode();
        Log.d(`checkCb event code : ${event.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
        let code = event.getEventCode();
        switch (event.getEventCode()) {
            case HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST:
                Log.d(`No local manifest file found, hot update skipped.`);
                break;
            case HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST:
            case HotUpdate.Code.ERROR_PARSE_MANIFEST:
                Log.d(`Fail to download manifest file, hot update skipped.`);
                break;
            case HotUpdate.Code.ALREADY_UP_TO_DATE:
                Log.d(`Already up to date with the latest remote version.`);
                this.dowloadVsersions(this.hotUpdateUrl, () => { });
                break;
            case HotUpdate.Code.NEW_VERSION_FOUND:
                Log.d(`New version found, please try to update.`);
                if (this.currentAssetsManager.name != MAIN_PACK) {
                    //非主包检测更新
                    //有新版本，看下是否与主包版本匹配
                    let md5 = this.currentAssetsManager.manager.getRemoteManifest().getMd5();
                    if (this.versions) {
                        // Log.dump(this.versions,this.currentAssetsManager.name);
                        let preMd5 = this.versions[this.currentAssetsManager.name];
                        //先检查主包是否需要更新
                        if (preMd5 == md5 ) {
                            //主包无需要更新
                            Log.d(`将要下载版本 md5 与远程版本 md5 相同，可以下载 md5:${preMd5}`);
                        } else {
                            //主包需要更新
                            Log.e(`将要下载版本 md5 :${md5} 与本地版本 md5 :${preMd5} 不一致，需要对主包进行更新后再进入!!!`);
                            code = HotUpdate.Code.MAIN_PACK_NEED_UPDATE;
                        }
                    } else {
                        Log.e(`预处理版本未存在!!!!`);
                        code = HotUpdate.Code.PRE_VERSIONS_NOT_FOUND;
                    }
                }
                break;
            default:
                return;
        }

        this.updating = false;

        //如果正在下载更新文件，先下载更新文件比较完成后，再回调
        if (this.checkCallback && this.currentAssetsManager.manager.getState() != HotUpdate.State.DOWNLOADING_VERSION as any) {
            this.checkCallback(code, this.currentAssetsManager.manager.getState() as any);
            this.checkCallback = null;
        }
    }

    /**@description 执行热更新*/
    hotUpdate() {
        if (!this.currentAssetsManager) {
            Log.e(`热更新管理器未初始化`);
            return;
        }
        Log.d(`即将热更新模块为:${this.currentAssetsManager.name} , updating : ${this.updating}`);
        if (!this.updating) {
            Log.d(`执行更新 ${this.currentAssetsManager.name} `);
            this.currentAssetsManager.manager.setEventCallback(this.updateCb.bind(this));
            this.currentAssetsManager.manager.update();
        }
    }

    /**@description 热更新回调 */
    private updateCb(event: any) {
        var isUpdateFinished = false;
        var failed = false;
        Log.d(`--update cb code : ${event.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.currentAssetsManager.code = event.getEventCode();
        switch (event.getEventCode()) {
            case HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST:
                Log.d(`No local manifest file found, hot update skipped.`);
                failed = true;
                break;
            case HotUpdate.Code.UPDATE_PROGRESSION:
                Log.d(`${event.getDownloadedBytes()} / ${event.getTotalBytes()}`);
                Log.d(`${event.getDownloadedFiles()} / ${event.getTotalFiles()}`);
                Log.d(`percent : ${event.getPercent()}`);
                Log.d(`percent by file : ${event.getPercentByFile()}`);
                var msg = event.getMessage();
                if (msg) {
                    Log.d(`Updated file: ${msg}`);
                }
                break;
            case HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST:
            case HotUpdate.Code.ERROR_PARSE_MANIFEST:
                Log.d(`Fail to download manifest file, hot update skipped.`);
                failed = true;
                break;
            case HotUpdate.Code.ALREADY_UP_TO_DATE:
                Log.d(`Already up to date with the latest remote version.`);
                failed = true;
                this.dowloadVsersions(this.hotUpdateUrl, () => { });
                break;
            case HotUpdate.Code.UPDATE_FINISHED:
                Log.d(`Update finished. ${event.getMessage()}`);
                isUpdateFinished = true;
                break;
            case HotUpdate.Code.UPDATE_FAILED:
                Log.d(`Update failed. ${event.getMessage()}`);
                this.updating = false;
                break;
            case HotUpdate.Code.ERROR_UPDATING:
                Log.d(`Asset update error: ${event.getAssetId()} , ${event.getMessage()}`);
                break;
            case HotUpdate.Code.ERROR_DECOMPRESS:
                Log.d(`${event.getMessage()}`);
                break;
            default:
                break;
        }
        if (failed) {
            this.currentAssetsManager.manager.setEventCallback(null as any);
            this.updating = false;
        }

        if (isUpdateFinished) {
            //下载完成,需要重新设置搜索路径，添加下载路径
            var searchPaths: string[] = jsb.fileUtils.getSearchPaths();
            var newPaths: string[] = this.currentAssetsManager.manager.getLocalManifest().getSearchPaths();
            Log.d(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);

            //这里做一个搜索路径去重处理
            let obj: any = {};
            for (let i = 0; i < searchPaths.length; i++) {
                obj[searchPaths[i]] = true;
            }
            searchPaths = Object.keys(obj);
            sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
        }

        let state = this.currentAssetsManager.manager.getState();
        if (this.currentAssetsManager.name == MAIN_PACK) {
            if (isUpdateFinished) {
                this.currentAssetsManager.manager.setEventCallback(null as any);
                //下载数量大于0，才有必要进入重启，在如下这种情况下，并不会发生下载
                //当只提升了版本号，而并未对代码进行修改时，此时的只下载了一个project.manifest文件，
                //不需要对游戏进行重启的操作
                this.dowloadVsersions(this.hotUpdateUrl, () => {
                    if (event.getDownloadedFiles() > 0) {
                        game.restart();
                    }
                });
                //下载完成 重置热更新管理器，在游戏期间如果有发热更新，可以再次检测
                this.restAssetsManager(this.currentAssetsManager.name);
            }
        } else {
            //子游戏更新
            if (isUpdateFinished) {
                Log.d(`${this.currentAssetsManager.name} 下载资源数 : ${event.getDownloadedFiles()}`)
                //下载完成 重置热更新管理器，在游戏期间如果有发热更新，可以再次检测
                this.restAssetsManager(this.currentAssetsManager.name);
            }
        }

        let info: HotUpdate.DownLoadInfo = {
            downloadedBytes: event.getDownloadedBytes(),
            totalBytes: event.getTotalBytes(),
            downloadedFiles: event.getDownloadedFiles(),
            totalFiles: event.getTotalFiles(),
            percent: event.getPercent(),
            percentByFile: event.getPercentByFile(),
            code: event.getEventCode(),
            state: state as any,
            needRestart: isUpdateFinished,
        };

        dispatch(HotUpdate.Event.HOTUPDATE_DOWNLOAD, info)

        Log.d(`update cb  failed : ${failed}  , need restart : ${isUpdateFinished} , updating : ${this.updating}`);
    }

    /**
     * @description 下载所有当前热更新的版本号，以防止当玩家再进入游戏，停止在如大厅时，此时发更新，玩家要下载的更新文件跟当前版本不匹配情况
     * @param hotUpdateUrl 主包热更新地方
     * @param complete 下载完成回调
     */
    private dowloadVsersions(hotUpdateUrl: string, complete: () => void) {
        let downloader = new jsb.Downloader();
        let versionsPath = `${hotUpdateUrl}/manifest/versions.json`;
        Log.d(`下载版本文件:${versionsPath}`)
        downloader.createDownloadFileTask(versionsPath, `${jsb.fileUtils.getWritablePath()}/versions.json`);
        downloader.setOnFileTaskSuccess((task) => {
            Log.d(`下载热更新版本文件成功`);
            let content = jsb.fileUtils.getStringFromFile(task.storagePath);
            Log.d(content);
            this.versions = JSON.parse(content);
            if (complete) complete();
        });

        downloader.setOnTaskError((task, errorCode, errorCodeInternal, errorString) => {
            Log.e(`下载当前热更新版本文件${versionsPath}失败,errorCode : ${errorCode} errorCodeInternal : ${errorCodeInternal} , errorString : ${errorString}`);
            if (complete) complete();
        });

        downloader.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected) => {
            Log.d(`下载${versionsPath}中 btyesReceived : ${bytesReceived} , totalBytesReceived : ${totalBytesReceived} , totalBytesExpected : ${totalBytesExpected}`);
        });
    }
}
