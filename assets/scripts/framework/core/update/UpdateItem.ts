import { game, sys } from "cc";
import { Macro } from "../../defines/Macros";
import { Update } from "./Update";

/**@description 更新项处理者代理 */
export interface UpdateHandlerDelegate {
    /**@description 发现新版本*/
    onNewVersionFund(item: UpdateItem): void;
    /**@description 更新失败 */
    onUpdateFailed(item: UpdateItem): void;
    /**@description 正在更新或检测更新中 */
    onUpdating(item: UpdateItem): void;
    /**@description 需要更新主包 */
    onNeedUpdateMain(item: UpdateItem): void;
    /**@description 其它状态 */
    onOther(item: UpdateItem): void;
    /**@description 下载进度 */
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void;
    /**@description 已经是最新版本或跳过热更新 */
    onAreadyUpToData(item: UpdateItem): void;
    /**@description 尝试下载失败的更新 */
    onTryDownloadFailedAssets(item: UpdateItem): void;
    /**@description 开始测试更新 */
    onStarCheckUpdate(item: UpdateItem): void;

    /**@description 开始加载bundle */
    onStartLoadBundle(item: UpdateItem): void;
    /**@description 加载bundle错误 */
    onLoadBundleError(item: UpdateItem, err: Error | null): void;
    /**@description 加载bundle完成 */
    onLoadBundleComplete(item: UpdateItem): void;
}

/**@description 更新项处理者 */
export class UpdateHandler implements UpdateHandlerDelegate {

    delegate: UpdateHandlerDelegate | null = null;
    onNewVersionFund(item: UpdateItem): void {
        if (this.delegate) this.delegate.onNewVersionFund(item);
    }
    onUpdateFailed(item: UpdateItem): void {
        if (this.delegate) this.delegate.onUpdateFailed(item);
    }
    onUpdating(item: UpdateItem): void {
        if (item.state == Update.State.DOWNLOADING_VERSION) {
            Manager.tips.show(Manager.getLanguage("loadVersions"));
        } else if (item.code == Update.Code.ERROR_DOWNLOAD_MANIFEST) {
            Manager.tips.show(Manager.getLanguage("warnNetBad"));
        } else {
            Manager.tips.show(Manager.getLanguage("checkingUpdate"));
        }
        if (this.delegate) this.delegate.onUpdating(item);
    }
    onNeedUpdateMain(item: UpdateItem): void {
        if (this.delegate) this.delegate.onNeedUpdateMain(item);
    }
    onOther(item: UpdateItem): void {
        if (this.delegate) this.delegate.onOther(item);
    }
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void {
        if (this.delegate) this.delegate.onDownloading(item, info);
    }
    onAreadyUpToData(item: UpdateItem): void {
        if (this.delegate) this.delegate.onAreadyUpToData(item);
    }
    onTryDownloadFailedAssets(item: UpdateItem): void {
        if (this.delegate) this.delegate.onTryDownloadFailedAssets(item);
    }
    onStarCheckUpdate(item: UpdateItem): void {
        if (this.delegate) this.delegate.onStarCheckUpdate(item);
    }
    /**@description 开始加载bundle */
    onStartLoadBundle(item: UpdateItem): void {
        if (this.delegate) this.delegate.onStarCheckUpdate(item);
    }
    /**@description 加载bundle错误 */
    onLoadBundleError(item: UpdateItem, err: Error | null): void {
        if (this.delegate) this.delegate.onLoadBundleError(item, err);
    }
    /**@description 加载bundle完成 */
    onLoadBundleComplete(item: UpdateItem): void {
        if (this.delegate) this.delegate.onLoadBundleComplete(item);
    }
}

export class UpdateItem {
    /**@description 更新项名字,如果大厅 */
    name: string = "";
    /**@description 更新项bundle名 */
    bundle: string = "";
    /**@description 处理者,统一指定，具体实现由内部的代理来处理 */
    handler: UpdateHandler = new UpdateHandler();
    /**@description 更新用户自定义数据,多次点击，以最新数据为主 */
    userData: any = null;

    /**@description 下载管理器，请不要从外面进行设置,管理器专用 */
    private assetsManager: Update.AssetsManager = null!;

    code: Update.Code = Update.Code.UNINITED;
    state: Update.State = Update.State.UNINITED;

    constructor(config: Update.Config) {
        this.name = config.name;
        this.bundle = config.bundle;
    }

    /**@description 是否正在下载或正在检测更新 */
    isUpdating = true;

    /**@description 热更新bundle名 */
    get updateName() {
        return this.assetsManager.name;
    }

    /**
     * @description 转换成热更新bundle
     * @param bundle 
     * @returns 
     */
    convertBundle(bundle: string) {
        return Manager.updateManager.convertBundle(bundle);
    }

    private getManifest() {
        let bundle = this.convertBundle(this.bundle);
        if (bundle == Update.MAIN_PACK) {
            return `${Update.MANIFEST_ROOT}main_version.json`;
        } else {
            return `${Update.MANIFEST_ROOT}${bundle}_project.json`;
        }
    }

    /**@description 检测更新 */
    checkUpdate() {
        this.handler.onStarCheckUpdate(this);
        let bundle = this.convertBundle(this.bundle);
        if (bundle == Update.MAIN_PACK) {
            this.checkMainUpdate();
        } else {
            this.checkBundleUpdate();
        }
    }

    /**@description 只有assetsManager有值时有效 */
    private get isMain() {
        return this.assetsManager.name == Update.MAIN_PACK;
    }

    get remoteMd5() {
        return this.assetsManager.manager.getRemoteManifest().getMd5();
    }

    private get storagePath() {
        return Manager.updateManager.storagePath;
    }

    private get hotUpdateUrl() {
        return Manager.updateManager.hotUpdateUrl;
    }

    /**@description bundle更新 */
    private checkBundleUpdate() {
        this.assetsManager = Manager.updateManager.getAssetsManager(this);
        let manifestUrl = this.getManifest();
        //先检测本地是否已经存在子游戏版本控制文件 
        if (jsb.fileUtils.isFileExist(manifestUrl)) {
            //存在版本控制文件 
            let content = jsb.fileUtils.getStringFromFile(manifestUrl);
            let jsbGameManifest = new jsb.Manifest(content, this.storagePath, this.hotUpdateUrl);
            Log.d(`${this.bundle} --存在本地版本控制文件checkUpdate--`);
            Log.d(`${this.bundle} mainifestUrl : ${manifestUrl}`);
            this.assetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this._checkUpdate();
        } else {
            //不存在版本控制文件 ，生成一个初始版本
            if (this.isUpdating) {
                Log.d(`${this.bundle} Checking or updating...`);
                this.handler.onUpdating(this);
                return;
            }
            let gameManifest = {
                version: "0",
                bundle: this.bundle,
                md5: Macro.UNKNOWN,
            };
            let gameManifestContent = JSON.stringify(gameManifest);
            let jsbGameManifest = new jsb.Manifest(gameManifestContent, this.storagePath, this.hotUpdateUrl);
            Log.d(`${this.bundle} --checkUpdate--`);
            Log.d(`${this.bundle} mainifest content : ${gameManifestContent}`);
            this.assetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this._checkUpdate();
        }
    }

    /**@description 主包更新 */
    private checkMainUpdate() {
        this.assetsManager = Manager.updateManager.getAssetsManager(this);
        this.assetsManager.manager.loadLocalManifest(this.getManifest());
        this._checkUpdate();
    }

    private _checkUpdate() {
        Log.d(`${this.bundle} --checkUpdate--`);
        if (this.isUpdating) {
            Log.d(`${this.bundle} Checking or updating...`);
            this.handler.onUpdating(this);
            return;
        }
        if (!this.assetsManager.manager.getLocalManifest() || !this.assetsManager.manager.getLocalManifest().isLoaded()) {
            Log.d(`${this.bundle} Failed to load local manifest ....`);
            this.code = Update.Code.ERROR_DOWNLOAD_MANIFEST;
            this.state = Update.State.FAIL_TO_UPDATE;
            this.handler.onUpdateFailed(this);
            return;
        }
        if (this.isTryDownloadFailedAssets()) {
            //已经更新失败，尝试获取更新下载失败的
            Log.d(`${this.bundle} 之前下载资源未完全下载完成，请尝试重新下载`);
            this.code = Update.Code.UPDATE_FAILED;
            this.state = Update.State.TRY_DOWNLOAD_FAILED_ASSETS;
            this.handler.onTryDownloadFailedAssets(this);
        } else {
            this.isUpdating = true;
            this.assetsManager.manager.setEventCallback(this.checkCb.bind(this));
            this.assetsManager.manager.checkUpdate();
        }
    }

    /**@description 判断是否需要重新尝试下载之前下载失败的文件 */
    private isTryDownloadFailedAssets() {
        if (this.assetsManager.manager.getState() as any == Update.State.FAIL_TO_UPDATE) {
            return true;
        }
        return false;
    }

    private checkCb(event: any) {
        //这里不能置空，下载manifest文件也会回调过来
        //this.checkCallback = null;
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.assetsManager.code = event.getEventCode();
        Log.d(`${this.bundle} checkCb event code : ${event.getEventCode()} state : ${this.assetsManager.manager.getState()}`);
        let code = event.getEventCode();
        switch (event.getEventCode()) {
            case Update.Code.ERROR_NO_LOCAL_MANIFEST:
                Log.d(`${this.bundle} No local manifest file found, hot update skipped.`);
                break;
            case Update.Code.ERROR_DOWNLOAD_MANIFEST:
            case Update.Code.ERROR_PARSE_MANIFEST:
                Log.d(`${this.bundle} Fail to download manifest file, hot update skipped.`);
                break;
            case Update.Code.ALREADY_UP_TO_DATE:
                Log.d(`${this.bundle} Already up to date with the latest remote version.`);
                if (this.isMain) {
                    Manager.updateManager.savePreVersions();
                }
                break;
            case Update.Code.NEW_VERSION_FOUND:
                Log.d(`${this.bundle} New version found, please try to update.`);
                if (this.isMain) {
                    code = Manager.updateManager.checkAllowUpdate(this, code);
                }
                break;
            default:
                return;
        }

        if (code == Update.Code.NEW_VERSION_FOUND) {
            this.handler.onNewVersionFund(this);
        } else if (code == Update.Code.ALREADY_UP_TO_DATE) {
            this.handler.onAreadyUpToData(this);
        } else if (code == Update.Code.ERROR_DOWNLOAD_MANIFEST ||
            code == Update.Code.ERROR_NO_LOCAL_MANIFEST ||
            code == Update.Code.ERROR_PARSE_MANIFEST) {
            this.handler.onUpdateFailed(this);
        } else if (code == Update.Code.MAIN_PACK_NEED_UPDATE || code == Update.Code.PRE_VERSIONS_NOT_FOUND) {
            this.handler.onNeedUpdateMain(this);
        } else {
            this.handler.onOther(this);
        }

        this.isUpdating = false;
    }

    /**@description 下载失败的资源 */
    downloadFailedAssets() {
        if (this.assetsManager) {
            this.assetsManager.manager.downloadFailedAssets();
        }
    }

    /**@description 执行更新 */
    doUpdate() {
        Log.d(`${this.bundle} 即将热更新, updating : ${this.isUpdating}`);
        if (!this.isUpdating) {
            Log.d(`${this.bundle} 执行更新 `);
            this.assetsManager.manager.setEventCallback(this.updateCb.bind(this));
            this.assetsManager.manager.update();
        }
    }

    /**@description 热更新回调 */
    private updateCb(event: any) {
        let isUpdateFinished = false;
        let failed = false;
        Log.d(`${this.bundle} --update cb code : ${event.getEventCode()} state : ${this.assetsManager.manager.getState()}`);
        //存储当前的状态，当下载版本文件失败时，state的状态与下载非版本文件是一样的状态
        this.assetsManager.code = event.getEventCode();
        switch (event.getEventCode()) {
            case Update.Code.ERROR_NO_LOCAL_MANIFEST:
                Log.d(`${this.bundle} No local manifest file found, hot update skipped.`);
                failed = true;
                break;
            case Update.Code.UPDATE_PROGRESSION:
                Log.d(`${this.bundle} ${event.getDownloadedBytes()} / ${event.getTotalBytes()}`);
                Log.d(`${this.bundle} ${event.getDownloadedFiles()} / ${event.getTotalFiles()}`);
                Log.d(`${this.bundle} percent : ${event.getPercent()}`);
                Log.d(`${this.bundle} percent by file : ${event.getPercentByFile()}`);
                Log.d(`${this.bundle} assetId : ${event.getAssetId()}`)
                var msg = event.getMessage();
                if (msg) {
                    Log.d(`${this.bundle} Updated file: ${msg}`);
                }
                break;
            case Update.Code.ERROR_DOWNLOAD_MANIFEST:
            case Update.Code.ERROR_PARSE_MANIFEST:
                Log.d(`${this.bundle} Fail to download manifest file, hot update skipped.`);
                failed = true;
                break;
            case Update.Code.ALREADY_UP_TO_DATE:
                Log.d(`${this.bundle} Already up to date with the latest remote version`);
                failed = true;
                if (this.isMain) {
                    Manager.updateManager.savePreVersions();
                }
                break;
            case Update.Code.UPDATE_FINISHED:
                Log.d(`${this.bundle} Update finished. ${event.getMessage()}`);
                isUpdateFinished = true;
                if (this.isMain) {
                    Manager.updateManager.savePreVersions();
                }
                break;
            case Update.Code.UPDATE_FAILED:
                Log.d(`${this.bundle} Update failed. ${event.getMessage()}`);
                this.isUpdating = false;
                break;
            case Update.Code.ERROR_UPDATING:
                Log.d(`${this.bundle} Asset update error: ${event.getAssetId()} , ${event.getMessage()}`);
                break;
            case Update.Code.ERROR_DECOMPRESS:
                Log.d(`${this.bundle} ${event.getMessage()}`);
                break;
            default:
                break;
        }
        if (failed) {
            this.assetsManager.manager.setEventCallback(null as any);
            this.isUpdating = false;
        }

        if (isUpdateFinished) {
            //下载完成,需要重新设置搜索路径，添加下载路径
            var searchPaths: string[] = jsb.fileUtils.getSearchPaths();
            var newPaths: string[] = this.assetsManager.manager.getLocalManifest().getSearchPaths();
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

        let state = this.assetsManager.manager.getState();
        if (this.isMain) {
            if (isUpdateFinished) {
                this.assetsManager.manager.setEventCallback(null as any);
                //下载数量大于0，才有必要进入重启，在如下这种情况下，并不会发生下载
                //当只提升了版本号，而并未对代码进行修改时，此时的只下载了一个project.manifest文件，
                //不需要对游戏进行重启的操作
                if (event.getDownloadedFiles() > 0) {
                    Log.d(`${this.bundle} 主包更新完成，有下载文件，需要重启更新`);
                    game.restart();
                } else {
                    Log.d(`${this.bundle} 主包更新完成，写入远程版本信息到本地`);
                    jsb.fileUtils.purgeCachedEntries();
                    //下载完成 重置热更新管理器，在游戏期间如果有发热更新，可以再次检测
                    Manager.updateManager.restAssetsManager(this.updateName);
                }
            }
        } else {
            //子游戏更新
            if (isUpdateFinished) {
                Log.d(`${this.bundle} 下载资源数 : ${event.getDownloadedFiles()}`)
                //清除搜索路径缓存
                jsb.fileUtils.purgeCachedEntries();
                //下载完成 重置热更新管理器，在游戏期间如果有发热更新，可以再次检测
                Manager.updateManager.restAssetsManager(this.updateName);
            }
        }

        let info: Update.DownLoadInfo = {
            downloadedBytes: event.getDownloadedBytes(),
            totalBytes: event.getTotalBytes(),
            downloadedFiles: event.getDownloadedFiles(),
            totalFiles: event.getTotalFiles(),
            percent: event.getPercent(),
            percentByFile: event.getPercentByFile(),
            code: event.getEventCode(),
            state: state as any,
            needRestart: isUpdateFinished,
            bundle: this.bundle,
            assetId: event.getAssetId(),
            progress: 0
        };

        if (info.code == Update.Code.UPDATE_FINISHED) {
            info.progress = 1.1;
            this.handler.onDownloading(this, info);
        } else if (info.code == Update.Code.UPDATE_PROGRESSION) {
            info.progress = info.percent == Number.NaN ? 0 : info.percent;
            this.handler.onDownloading(this, info);
        } else if (info.code == Update.Code.ALREADY_UP_TO_DATE) {
            info.progress = 1;
            this.handler.onDownloading(this, info);
        } else if (info.code == Update.Code.UPDATE_FAILED ||
            info.code == Update.Code.ERROR_NO_LOCAL_MANIFEST ||
            info.code == Update.Code.ERROR_DOWNLOAD_MANIFEST ||
            info.code == Update.Code.ERROR_PARSE_MANIFEST ||
            info.code == Update.Code.ERROR_DECOMPRESS) {
            info.progress = -1;
            Log.e(`更新${this.name}失败`);
            this.handler.onUpdateFailed(this);
        }
        Log.d(`${this.bundle}update cb  failed : ${failed}  , need restart : ${isUpdateFinished} , updating : ${this.isUpdating}`);
    }
}

