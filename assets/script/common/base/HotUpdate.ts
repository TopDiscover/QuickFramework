
interface Manifest {
    /**@description 大厅版本 */
    version?: string,
    /**@description 子游戏版本 大厅的manifest不包含该字段 */
    subVersion?: string,
    /**@description 资源服务器地址 */
    packageUrl?: string,
    /**@description 远程project.manifest地址 */
    remoteManifestUrl?: string,
    /**@description 远程version.manifest地址 */
    remoteVersionUrl?: string,
    /**@description 包含资源 */
    assets?: any,
    searchPaths?: any
}

class AssetsManager {

    constructor(name: string) {
        this.name = name;
    }

    /**@description  当前资源管理器的状态*/
    code: any = -1;
    /**@description 当前资源管理器的名称 */
    name: string = "";
    /**@description 当前资源管理器的实体 jsb.AssetsManager */
    manager: any = null;
}

export enum AssetManagerCode {
    /**@description 找不到本地mainfest文件*/
    ERROR_NO_LOCAL_MANIFEST,
    /**@description 下载manifest文件错误 */
    ERROR_DOWNLOAD_MANIFEST,
    /**@description 解析manifest文件错误 */
    ERROR_PARSE_MANIFEST,
    /**@description 找到新版本 */
    NEW_VERSION_FOUND,
    /**@description 当前已经是最新版本 */
    ALREADY_UP_TO_DATE,
    /**@description 更新下载进度中 */
    UPDATE_PROGRESSION,
    /**@description 资源更新中 */
    ASSET_UPDATED,
    /**@description 更新错误 */
    ERROR_UPDATING,
    /**@description 更新完成 */
    UPDATE_FINISHED,
    /**@description 更新失败 */
    UPDATE_FAILED,
    /**@description 解压资源失败 */
    ERROR_DECOMPRESS,


    //以下是js中扩展的字段，上面是引擎中已经有的字段
    /**@description 正检测更新中 */
    CHECKING,
}

export enum AssetManagerState {
    /**@description 未初始化 */
    UNINITED,
    /**@description 找到manifest文件 */
    UNCHECKED,
    /**@description 准备下载版本文件 */
    PREDOWNLOAD_VERSION,
    /**@description 下载版本文件中 */
    DOWNLOADING_VERSION,
    /**@description 版本文件下载完成 */
    VERSION_LOADED,
    /**@description 准备加载project.manifest文件 */
    PREDOWNLOAD_MANIFEST,
    /**@description 下载project.manifest文件中 */
    DOWNLOADING_MANIFEST,
    /**@description 下载project.manifest文件完成 */
    MANIFEST_LOADED,
    /**@description 需要下载更新 */
    NEED_UPDATE,
    /**@description 准备更新 */
    READY_TO_UPDATE,
    /**@description 更新中 */
    UPDATING,
    /**@description 解压中 */
    UNZIPPING,
    /**@description 已经是最新版本 */
    UP_TO_DATE,
    /**@description 更新失败 */
    FAIL_TO_UPDATE,

    /**自定定义扩展 */
    /**@description 尝试重新下载失败文件 */
    TRY_DOWNLOAD_FAILED_ASSETS,
}

/**@description 子游戏热更新的方式 */
export enum SubGameUpdateType {
    /**@description 如果该子游戏的代码已经加载过，
     * 在玩家不重启游戏的情况下，忽略服务器端的所有更新
     * 优点：在玩家未关闭游戏前提，每个子游戏只会进行一次更新
     * 缺点: 每个子游戏只能更新一次，不能时时保证进入子游戏的代码及资源为最新版本
     *  */
    Normal,
    /**@description 不管子游戏戏代码是否已经加载
     * 都先会检测更新，去服务器拉取到最新的代码及资源
     * 优点 : 本地的代码始终保持最新
     * 缺点 : 当玩家已经进入了该游戏，下次在进入该游戏时，
     * 发现有新的版本，此时下载完成新版本的资源及代码后，会造成应用重启
     */
    CheckUpdate,
}

export class GameConfig {
    /**@description 游戏子包名 */
    subpackageName: string = "";
    /**@description 游戏名 */
    gameName: string = "";
    /**@description h5是否加载子游戏完成 */
    isLoaded = false;
    constructor( gameName : string , subpackageName : string ){
        this.gameName = gameName;
        this.subpackageName = subpackageName;
        this.isLoaded = false;
    }
 }

const HALL_ASSETS_MANAGER_NAME = "HALL";

const TEST_HOT_UPDATE_URL_ROOT = "http://192.168.3.104/hotupdate"

/**
 * @description 热更新组件
 */
const { ccclass, property } = cc._decorator;
@ccclass
class _HotUpdate {
    private manifestRoot: string = `manifest/`;
    /**@description 本地存储热更新文件的路径 */
    private storagePath = "";
    /**@description 是否在热更新中或检测更新状态 */
    private updating = false;

    /**@description 子游戏更新类型 */
    public subGameUpdateType = SubGameUpdateType.Normal;

    private _commonHotUpdateUrl = `${TEST_HOT_UPDATE_URL_ROOT}`;//"http://10.99.50.118/ddzserver";
    /**@description 通用的热更新地址，当在子游戏或大厅未指定热更新地址时，都统一使用服务器传回来的默认全局更新地址 */
    public get commonHotUpdateUrl(): string {
        if (this._commonHotUpdateUrl.length > 0) {
            return this._commonHotUpdateUrl;
        } else {
            return this.projectManifest.packageUrl;
        }
    }

    private _projectManifest: Manifest = null;
    private get projectManifest(): Manifest {
        if (CC_JSB && !this._projectManifest) {
            let content = jsb.fileUtils.getStringFromFile(this.hallProjectMainfest);
            try {
                this._projectManifest = JSON.parse(content);
            } catch (error) {
                this._projectManifest = null;
                cc.error(`读取${this.hallProjectMainfest}失败`);
            }
        }
        return this._projectManifest;
    }

    /**@description 热更新回调 */
    public onDownload: (
        downloadedBytes: number,
        totalBytes: number,
        downloadedFiles: number,
        totalFiles: number,
        percent: number,
        percentByFile: number,
        code: AssetManagerCode,
        state: AssetManagerState,
        needRestart: boolean) => void = null;
    /**@description 大厅本地的版本项目更新文件配置路径 */
    public get hallProjectMainfest() {
        return `${this.manifestRoot}project.manifest`;
    }
    /**@description 检测更新回调 */
    public checkCallback: (code: AssetManagerCode, state: AssetManagerState) => void = null;

    /**@description 子游戏版本信息 */
    public allGameConfig: { [key: string]: GameConfig } = {};

    /**@description 资源管理器 */
    private assetsManagers: { [key: string]: AssetsManager } = {};

    public _hotUpdateUrls: { [key: string]: string } = {};
    /**@description 热更新地址，为了方便后面当只更新一个游戏，或cdn服务器 */
    private getHotUpdateUrl(moduleName: string) {
        if (CC_DEBUG) {
            let config = {
                "gameOne": this._commonHotUpdateUrl,
                "gameTwo": this._commonHotUpdateUrl,
            }
            if (config[moduleName]) {
                return config[moduleName];
            } else {
                return this.commonHotUpdateUrl;
            }
        } else {
            if (this._hotUpdateUrls[moduleName]) {
                return this._hotUpdateUrls[moduleName];
            } else {
                return this.commonHotUpdateUrl;
            }
        }
    }

    /**@description 当前热更新的资源管理器 */
    private currentAssetsManager: AssetsManager = null;

    /**@description 获取子游戏名 */
    public getGameLocalName(gameName: string) {
        return this.allGameConfig[gameName].gameName;
    }

    /**@description 释放资源管理器，默认为hall 大厅资源管理器 */
    destroyAssetsManager(name: string = HALL_ASSETS_MANAGER_NAME) {
        if (this.assetsManagers[name]) {
            delete this.assetsManagers[name];
        }
    }

    /**@description 获取资源管理器，默认为hall 大厅的资源管理器 */
    public getAssetsManager(name: string = HALL_ASSETS_MANAGER_NAME) {
        if (this.assetsManagers[name]) {
            return this.assetsManagers[name];
        } else {
            //初始化资源管理器
            if (CC_JSB) {
                this.storagePath = jsb.fileUtils.getWritablePath();
                cc.log(`Storage path for remote asset : ${this.storagePath}`);
                this.assetsManagers[name] = new AssetsManager(name);
                this.assetsManagers[name].manager = new jsb.AssetsManager(name == HALL_ASSETS_MANAGER_NAME ? "type.hall" : `type.${name}_`, this.storagePath, this.versionCompareHanle.bind(this));
                //设置下载并发量
                this.assetsManagers[name].manager.setMaxConcurrentTask(8);
                this.assetsManagers[name].manager.setHotUpdateUrl(this.getHotUpdateUrl(name));
                this.assetsManagers[name].manager.setVerifyCallback(function (path, asset) {
                    let compressed = asset.compressed;
                    let expectedMD5 = asset.md5;
                    let relativePath = asset.path;
                    let size = asset.size;
                    if (compressed) {
                        cc.log(`Verification passed : ${relativePath}`);
                        return true;
                    }
                    else {
                        cc.log(`Verification passed : ${relativePath} ( ${expectedMD5} )`);
                        return true;
                    }
                });
                cc.log(`Hot update is ready , please check or directly update.`);
            }
            return this.assetsManagers[name];
        }
    }

    /**@description 判断是否需要重新尝试下载之前下载失败的文件 */
    private isTryDownloadFailedAssets() {
        if (this.currentAssetsManager &&
            this.currentAssetsManager.manager.getState() == AssetManagerState.FAIL_TO_UPDATE &&
            this.currentAssetsManager.code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST &&
            this.currentAssetsManager.code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST &&
            this.currentAssetsManager.code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
            return true;
        }
        return false;
    }

    /**@description 检测更新 */
    private checkUpdate(callback: (code: AssetManagerCode, state: AssetManagerState) => void) {
        if (CC_PREVIEW || cc.sys.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            this.updating = false;
            callback(AssetManagerCode.ALREADY_UP_TO_DATE, AssetManagerState.UP_TO_DATE);
        } else {
            cc.log(`--checkUpdate--`);
            if (this.updating) {
                cc.log(`Checking or updating...`);
                callback(AssetManagerCode.CHECKING, AssetManagerState.PREDOWNLOAD_VERSION);
                return;
            }
            if (!this.currentAssetsManager.manager.getLocalManifest() || !this.currentAssetsManager.manager.getLocalManifest().isLoaded()) {
                cc.log(`Failed to load local manifest ....`);
                callback(AssetManagerCode.ERROR_DOWNLOAD_MANIFEST, AssetManagerState.FAIL_TO_UPDATE);
                return;
            }
            if (this.isTryDownloadFailedAssets()) {
                //已经更新失败，尝试获取更新下载失败的
                cc.log(`之前下载资源未完全下载完成，请尝试重新下载`);
                callback(AssetManagerCode.UPDATE_FAILED, AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS);
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

    /**@description 检查大厅是否需要更新 */
    checkHallUpdate(callback: (code: AssetManagerCode, state: AssetManagerState) => void) {
        if (CC_PREVIEW || cc.sys.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            cc.log(`预览或浏览器`);
            callback(AssetManagerCode.ALREADY_UP_TO_DATE, AssetManagerState.UP_TO_DATE);
        } else {
            this.currentAssetsManager = this.getAssetsManager();
            this.currentAssetsManager.manager.loadLocalManifest(this.hallProjectMainfest);
            this.checkUpdate(callback);
        }
    }

    /**
     * @description 获取子游戏manifest url
     * @param gameName 子游戏名
     * @returns manifest url
     */
    public getGameManifest(gameName): string {
        return `${this.manifestRoot}${gameName}_project.manifest`;
    }

    /**
     * @description 检测子游戏更新
     * @param gameName 子游戏名
     * @param callback 检测完成回调
     */
    checkGameUpdate(gameName: string, callback: (code: AssetManagerCode, state: AssetManagerState) => void) {
        if (CC_PREVIEW || cc.sys.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            cc.log(`预览或浏览器`);
            callback(AssetManagerCode.ALREADY_UP_TO_DATE, AssetManagerState.UP_TO_DATE);
        } else {
            this.currentAssetsManager = this.getAssetsManager(gameName);
            let manifestUrl = this.getGameManifest(gameName);
            //先检测本地是否已经存在子游戏版本控制文件 
            if (jsb.fileUtils.isFileExist(manifestUrl)) {
                //存在版本控制文件 
                let content = jsb.fileUtils.getStringFromFile(manifestUrl);
                let jsbGameManifest = new jsb.Manifest(content, this.storagePath, this.getHotUpdateUrl(this.currentAssetsManager.name));
                cc.log(`--存在本地版本控制文件checkUpdate--`);
                cc.log(`mainifestUrl : ${manifestUrl}`);
                this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
                this.checkUpdate(callback);
            } else {
                //不存在版本控制文件 ，生成一个初始版本
                if (this.updating) {
                    cc.log(`Checking or updating...`);
                    callback(AssetManagerCode.CHECKING, AssetManagerState.PREDOWNLOAD_VERSION);
                    return;
                }

                let packageUrl = this.getHotUpdateUrl(gameName);
                let gameManifest = {
                    version: "0",
                    packageUrl: packageUrl,
                    remoteManifestUrl: `${packageUrl}/${manifestUrl}`,
                    remoteVersionUrl: `${packageUrl}/${this.manifestRoot}${gameName}_version.manifest`,
                    assets: {},
                    searchPaths: []
                };
                let gameManifestContent = JSON.stringify(gameManifest);
                let jsbGameManifest = new jsb.Manifest(gameManifestContent, this.storagePath, this.getHotUpdateUrl(this.currentAssetsManager.name));
                cc.log(`--checkUpdate--`);
                cc.log(`mainifest content : ${gameManifestContent}`);
                this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
                this.checkUpdate(callback);
            }
        }
    }

    /**@description 检测更新 */
    private checkCb(event) {

        //这里不能置空，下载manifest文件也会回调过来
        //this.checkCallback = null;
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.currentAssetsManager.code = event.getEventCode();
        if (CC_DEBUG) {
            cc.log(`checkCb event code : ${event.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
            switch (event.getEventCode()) {
                case AssetManagerCode.ERROR_NO_LOCAL_MANIFEST:
                    cc.log(`No local manifest file found, hot update skipped.`);
                    break;
                case AssetManagerCode.ERROR_DOWNLOAD_MANIFEST:
                case AssetManagerCode.ERROR_PARSE_MANIFEST:
                    cc.log(`Fail to download manifest file, hot update skipped.`);
                    break;
                case AssetManagerCode.ALREADY_UP_TO_DATE:
                    cc.log(`Already up to date with the latest remote version.`);
                    break;
                case AssetManagerCode.NEW_VERSION_FOUND:
                    cc.log(`New version found, please try to update.`);
                    break;
                default:
                    return;
            }
        }

        //this.currentAssetsManager.setEventCallback(null);
        this.updating = false;

        //如果正在下载更新文件，先下载更新文件比较完成后，再回调
        if (this.checkCallback && this.currentAssetsManager.manager.getState() != AssetManagerState.DOWNLOADING_VERSION) {
            this.checkCallback(event.getEventCode(), this.currentAssetsManager.manager.getState());
            this.checkCallback = null;
        }
    }

    /**
     * @description 热更新
     * @param manifestUrl manifest地址
     * @param gameName 
     */
    hotUpdate() {
        if (!this.currentAssetsManager) {
            cc.error(`热更新管理器未初始化`);
            return;
        }
        cc.log(`即将热更新模块为:${this.currentAssetsManager.name} , updating : ${this.updating}`);
        if (!this.updating) {
            cc.log(`执行更新 ${this.currentAssetsManager.name} `);
            this.currentAssetsManager.manager.setEventCallback(this.updateCb.bind(this));
            this.currentAssetsManager.manager.update();
        }
    }

    /**@description 热更新回调 */
    private updateCb(event) {
        var isUpdateFinished = false;
        var failed = false;
        cc.log(`--update cb code : ${event.getEventCode()} state : ${this.currentAssetsManager.manager.getState()}`);
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.currentAssetsManager.code = event.getEventCode();
        switch (event.getEventCode()) {
            case AssetManagerCode.ERROR_NO_LOCAL_MANIFEST:
                cc.log(`No local manifest file found, hot update skipped.`);
                failed = true;
                break;
            case AssetManagerCode.UPDATE_PROGRESSION:
                cc.log(`${event.getDownloadedBytes()} / ${event.getTotalBytes()}`);
                cc.log(`${event.getDownloadedFiles()} / ${event.getTotalFiles()}`);
                cc.log(`percent : ${event.getPercent()}`);
                cc.log(`percent by file : ${event.getPercentByFile()}`);
                var msg = event.getMessage();
                if (msg) {
                    cc.log(`Updated file: ${msg}`);
                }
                break;
            case AssetManagerCode.ERROR_DOWNLOAD_MANIFEST:
            case AssetManagerCode.ERROR_PARSE_MANIFEST:
                cc.log(`Fail to download manifest file, hot update skipped.`);
                failed = true;
                break;
            case AssetManagerCode.ALREADY_UP_TO_DATE:
                cc.log(`Already up to date with the latest remote version.`);
                failed = true;
                break;
            case AssetManagerCode.UPDATE_FINISHED:
                cc.log(`Update finished. ${event.getMessage()}`);
                isUpdateFinished = true;
                break;
            case AssetManagerCode.UPDATE_FAILED:
                cc.log(`Update failed. ${event.getMessage()}`);
                this.updating = false;
                break;
            case AssetManagerCode.ERROR_UPDATING:
                cc.log(`Asset update error: ${event.getAssetId()} , ${event.getMessage()}`);
                break;
            case AssetManagerCode.ERROR_DECOMPRESS:
                cc.log(`${event.getMessage()}`);
                break;
            default:
                break;
        }
        if (failed) {
            this.currentAssetsManager.manager.setEventCallback(null);
            this.updating = false;
        }

        if (isUpdateFinished) {
            //下载完成,需要重新设置搜索路径，添加下载路径
            // Prepend the manifest's search path
            var searchPaths: string[] = jsb.fileUtils.getSearchPaths();
            var newPaths: string[] = this.currentAssetsManager.manager.getLocalManifest().getSearchPaths();
            cc.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.

            //这里做一个搜索路径去重处理
            let obj = {};
            for (let i = 0; i < searchPaths.length; i++) {
                obj[searchPaths[i]] = true;
            }
            searchPaths = Object.keys(obj);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
        }

        if (this.currentAssetsManager.name == HALL_ASSETS_MANAGER_NAME) {
            if (isUpdateFinished) {
                this.currentAssetsManager.manager.setEventCallback(null);
                //下载数量大于0，才有必要进入重启，在如下这种情况下，并不会发生下载
                //当只提升了版本号，而并未对代码进行修改时，此时的只下载了一个project.manifest文件，
                //不需要对游戏进行重启的操作
                if (event.getDownloadedFiles() > 0) {
                    cc.game.restart();
                }
            }
        } else {
            //子游戏更新
            if (isUpdateFinished) {
                if (event.getDownloadedFiles() > 0) {
                    //已经加载过子游戏代码，如果需要使用到最新，需要重启app才能是最新的代码
                    if (this.allGameConfig[this.currentAssetsManager.name].isLoaded) {
                        cc.log(`已经加载过游戏代码，需要重启app生效`);
                        isUpdateFinished = true;
                        cc.game.restart();
                    } else {
                        //没有加载过子游戏代码
                        cc.log(`第一次加载子游戏代码，不需要重启`);
                        isUpdateFinished = false;
                    }
                } else {
                    isUpdateFinished = false;
                }
            }
        }

        if (this.onDownload) {
            this.onDownload(
                event.getDownloadedBytes(),
                event.getTotalBytes(),
                event.getDownloadedFiles(),
                event.getTotalFiles(),
                event.getPercent(),
                event.getPercentByFile(),
                event.getEventCode(),
                this.currentAssetsManager.manager.getState(),
                isUpdateFinished
            );
        }

        cc.log(`update cb  failed : ${failed}  , need restart : ${isUpdateFinished} , updating : ${this.updating}`);
    }

    private versionCompareHanle(versionA: string, versionB: string) {
        cc.log(`JS Custom Version Compare : version A is ${versionA} , version B is ${versionB}`);
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        cc.log(`version A ${vA} , version B ${vB}`);
        for (let i = 0; i < vA.length && i < vB.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i]);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        return 0;
    }
}

export let HotUpdate = new _HotUpdate();
