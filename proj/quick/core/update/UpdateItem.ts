import { game, native, sys } from "cc";
import { Macro } from "../../defines/Macros";
import { Update } from "./Update";

/**@description 更新项处理者代理 */
export interface UpdateHandlerDelegate {
    /**@description 发现新版本*/
    onNewVersionFund(item: UpdateItem): void;
    /**@description 更新失败 */
    onUpdateFailed(item: UpdateItem): void;
    /**@description 加载远程版本信息失败 */
    onPreVersionFailed(item: UpdateItem): void;
    /**@description 正在更新或检测更新中 */
    onShowUpdating(item: UpdateItem): void;
    /**@description 其它状态 */
    onOther(item: UpdateItem): void;
    /**@description 下载进度 */
    onDownloading(item: UpdateItem, info: Update.DownLoadInfo): void;
    /**@description 已经是最新版本或跳过热更新 */
    onAreadyUpToData(item: UpdateItem): void;
    /**@description 下载更新完成 */
    onDownloadComplete(item: UpdateItem): void;
    /**@description 开始测试更新 */
    onStarCheckUpdate(item: UpdateItem): void;

    /**@description 加载bundle */
    onLoadBundle(item: UpdateItem): void
    /**@description 开始加载bundle */
    onStartLoadBundle(item: UpdateItem): void;
    /**@description 加载bundle错误 */
    onLoadBundleError(item: UpdateItem, err: Error | null): void;
    /**@description 加载bundle完成 */
    onLoadBundleComplete(item: UpdateItem): void;

    /**
     * @description 更新完成，需要重启 
     * @param onComplete 完成回调，收到此消息，玩家必须重启App，为了比较友好，结玩家一个提示
     * */
    onNeedRestartApp(item : UpdateItem , onComplete : (isDelayRestart : boolean)=>void): void;
}

export class UpdateItem {
    /**@description 更新项名字,如果大厅 */
    private _name = "";
    get name(){
        return App.getLanguage(this._name as any);
    };
    /**@description 更新项bundle名 */
    bundle: string = "";
    /**@description 处理者,统一指定，具体实现由内部的代理来处理 */
    handler: UpdateHandlerDelegate = null!;
    /**@description 更新用户自定义数据,多次点击，以最新数据为主 */
    userData: EntryUserData = null!;

    /**@description 是否已经加载完成过 */
    isLoaded: boolean = false;

    /**@description 下载管理器，请不要从外面进行设置,管理器专用 */
    private get assetsManager() {
        return App.updateManager.getAssetsManager(this);
    }

    private _code: Update.Code = Update.Code.UNINITED;
    get code() {
        if (this.isBrowser) {
            return Update.Code.ALREADY_UP_TO_DATE;
        }
        return this._code;
    }
    set code(v) {
        this._code = v;
    }

    private _state: Update.State = Update.State.UNINITED;
    get state() {
        if (this.isBrowser) {
            return Update.State.UP_TO_DATE;
        }
        return this._state;
    }
    set state(v) {
        this._state = v;
    }

    constructor(config: Update.Config) {
        this._name = config.name;
        this.bundle = config.bundle;
    }

    /**@description 热更新bundle名 */
    get updateName() {
        return this.assetsManager.name;
    }

    /**@description 是否是预览或浏览器 */
    private get isBrowser() {
        return App.updateManager.isBrowser;
    }

    /**
     * @description 重置
     */
    reset() {
        this.state = Update.State.UNINITED;
        this.code = Update.Code.UNINITED;
        Log.d(`${this.bundle} AssetsManager 重置`);
        this.assetsManager.manager.reset();
    }

    /**
     * @description 转换成热更新bundle
     * @param bundle 
     * @returns 
     */
    convertBundle(bundle: string) {
        return App.updateManager.convertBundle(bundle);
    }

    private getProjectString() {
        return App.updateManager.getProjectString(this.bundle);
    }

    /**@description 检测更新 */
    checkUpdate() {
        this.handler.onStarCheckUpdate(this);
        this.checkBundleUpdate();
    }

    /**@description 只有assetsManager有值时有效 */
    private get isMain() {
        return this.assetsManager.name == Update.MAIN_PACK;
    }

    get remoteMd5() {
        return this.assetsManager.manager.getRemoteManifest().getMd5();
    }

    private get storagePath() {
        return App.updateManager.storagePath;
    }

    private get hotUpdateUrl() {
        return App.updateManager.realHotUpdateUrl;
    }

    /**@description 当前是否正在检测更新或更新过程中 */
    get isUpdating() {
        let state = this.assetsManager.manager.getState() as any;
        let _isUpdating = (state: Update.State) => {
            if (state == Update.State.PREDOWNLOAD_VERSION) {
                Log.d(`${this.bundle} 准备下载版本文件`)
                return true;
            } else if (state == Update.State.DOWNLOADING_VERSION) {
                Log.d(`${this.bundle} 下载版本文件中`)
                return true;
            } else if (state == Update.State.PREDOWNLOAD_MANIFEST) {
                Log.d(`${this.bundle} 准备下载project文件`)
                return true;
            } else if (state == Update.State.DOWNLOADING_MANIFEST) {
                Log.d(`${this.bundle} 下载project文件中`);
                return true;
            } else if (state == Update.State.VERSION_LOADED) {
                Log.d(`${this.bundle} 下载版本文件完成，下一步骤会解析版本文件，也算在更新过程中`)
                return true;
            } else if (state == Update.State.MANIFEST_LOADED) {
                Log.d(`${this.bundle} 下载project文件完成,下载步骤会解析project文件，也算在更新过程中`)
                return true;
            } else if (state == Update.State.UPDATING) {
                Log.d(`${this.bundle} 正在更新中`);
                return true;
            }
        }
        //C++更新状态
        if (_isUpdating(state)) {
            Log.d(`${this.bundle} C++层更新中`);
            return true;
        }

        //ts更新状态
        if (_isUpdating(this.state)) {
            Log.d(`${this.bundle} TS层更新中`);
            return true;
        }

        return false;
    }

    /**@description bundle更新 */
    private checkBundleUpdate() {
        if (this.assetsManager.manager.getLocalManifest()) {
            Log.d(`${this.bundle} 本地文件已经加载完成,直接进入更新流程`);
            if (this.isUpdating) {
                Log.d(`${this.bundle} 正在检测更新中...`);
                this.handler.onShowUpdating(this);
                return;
            }
        }
        let content = this.getProjectString();
        //先检测本地是否已经存在子游戏版本控制文件 
        if (content) {
            //存在版本控制文件 
            let jsbGameManifest = new native.Manifest(content, this.storagePath, this.hotUpdateUrl);
            Log.d(`${this.bundle} --存在本地版本控制文件checkUpdate--`);
            // Log.d(`${this.bundle} mainifestUrl : ${content}`);
            this.assetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this._checkUpdate();
        } else {
            //不存在版本控制文件 ，生成一个初始版本
            let gameManifest = {
                version: "0",
                bundle: this.convertBundle(this.bundle),
                md5: Macro.UNKNOWN,
            };
            let gameManifestContent = JSON.stringify(gameManifest);
            let jsbGameManifest = new native.Manifest(gameManifestContent, this.storagePath, this.hotUpdateUrl);
            Log.d(`${this.bundle} 检测更新`);
            Log.d(`${this.bundle} 版本信息 : ${gameManifestContent}`);
            this.assetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this._checkUpdate();
        }
    }


    private _checkUpdate() {
        Log.d(`${this.bundle} 进入检测更新`);
        this.state = Update.State.UPDATING;
        this.assetsManager.manager.setEventCallback(this.checkCb.bind(this));
        this.assetsManager.manager.checkUpdate();
    }

    private checkCb(event: any) {
        let code = event.getEventCode();
        let state = this.assetsManager.manager.getState() as any;
        Log.d(`${this.bundle} checkCb event code : ${code} state : ${state}`);

        switch (code) {
            case Update.Code.ERROR_NO_LOCAL_MANIFEST:
                Log.d(`${this.bundle} No local manifest file found, hot update skipped.`);
                break;
            case Update.Code.ERROR_DOWNLOAD_MANIFEST:
            case Update.Code.ERROR_PARSE_MANIFEST:
                Log.d(`${this.bundle} Fail to download manifest file, hot update skipped.`);
                break;
            case Update.Code.ALREADY_UP_TO_DATE:
                Log.d(`${this.bundle} Already up to date with the latest remote version.`);
                break;
            case Update.Code.NEW_VERSION_FOUND:
                Log.d(`${this.bundle} New version found, please try to update.`);
                break;
            default:
                return;
        }
        this.state = state;
        this.code = code;
        if (code == Update.Code.NEW_VERSION_FOUND) {
            this.handler.onNewVersionFund(this);
        } else if (code == Update.Code.ALREADY_UP_TO_DATE) {
            this.handler.onAreadyUpToData(this);
        } else if (code == Update.Code.ERROR_DOWNLOAD_MANIFEST ||
            code == Update.Code.ERROR_NO_LOCAL_MANIFEST ||
            code == Update.Code.ERROR_PARSE_MANIFEST ||
            code == Update.Code.PRE_VERSIONS_NOT_FOUND) {
            this.handler.onUpdateFailed(this);
        } else {
            this.handler.onOther(this);
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
        let code = event.getEventCode();
        let state = this.assetsManager.manager.getState() as any;
        Log.d(`${this.bundle} --update cb code : ${code} state : ${state}`);
        switch (code) {
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
                break;
            case Update.Code.UPDATE_FINISHED:
                Log.d(`${this.bundle} Update finished. ${event.getMessage()}`);
                isUpdateFinished = true;
                break;
            case Update.Code.UPDATE_FAILED:
                Log.d(`${this.bundle} Update failed. ${event.getMessage()}`);
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
        }

        let isRestartApp = false;
        if (this.isMain) {
            if (isUpdateFinished) {
                this.assetsManager.manager.setEventCallback(null as any);
                //下载数量大于0，才有必要进入重启，在如下这种情况下，并不会发生下载
                //当只提升了版本号，而并未对代码进行修改时，此时的只下载了一个project.manifest文件，
                //不需要对游戏进行重启的操作
                if (event.getDownloadedFiles() > 0) {
                    isRestartApp = true;
                }
            }
        } else {
            //子游戏更新
            if (isUpdateFinished) {
                Log.d(`${this.bundle} 更新前是否加载过 : ${this.isLoaded}`)
                if (this.isLoaded && event.getDownloadedFiles() > 0) {
                    Log.d(`${this.bundle} 已经加载过，需要重启`)
                    isRestartApp = true;
                }
            }
        }

        this.state = state;
        this.code = code;

        let info: Update.DownLoadInfo = {
            downloadedBytes: event.getDownloadedBytes(),
            totalBytes: event.getTotalBytes(),
            downloadedFiles: event.getDownloadedFiles(),
            totalFiles: event.getTotalFiles(),
            percent: event.getPercent(),
            percentByFile: event.getPercentByFile(),
            code: event.getEventCode(),
            state: state as any,
            needRestart: isRestartApp,
            bundle: this.bundle,
            assetId: event.getAssetId(),
            progress: 0
        };

        if (info.code == Update.Code.UPDATE_FINISHED) {
            info.progress = 1.1;
            this.handler.onDownloading(this, info);
        } else if (info.code == Update.Code.UPDATE_PROGRESSION) {
            if (info.totalBytes <= 0) {
                info.progress = 0;
            } else {
                info.progress = info.percent == Number.NaN ? 0 : info.percent;
            }
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
        if (isUpdateFinished) {
            Log.d(`${this.bundle} 更新完成,下载资源数 : ${event.getDownloadedFiles()}`)
            if (isRestartApp) {
                Log.d(`${this.bundle} 更新完成，需要重启游戏`)
                this.handler.onNeedRestartApp(this,(isDelayRestart : boolean)=>{
                    native.fileUtils.purgeCachedEntries();
                    let delay = 0.5;
                    if ( isDelayRestart ){
                        delay = 1;
                    }
                    setTimeout(() => {
                        Log.d(`${this.bundle} 重启游戏`);
                        game.restart();
                    }, delay);
                })
            }else{
                //清除搜索路径缓存
                native.fileUtils.purgeCachedEntries();
                //下载完成 重置热更新管理器，在游戏期间如果有发热更新，可以再次检测
                this.reset();
                this.handler.onDownloadComplete(this);
            }
        }
        Log.d(`${this.bundle}update cb  failed : ${failed}  , isRestartApp : ${isRestartApp} isUpdateFinished : ${isUpdateFinished} , updating : ${this.isUpdating}`);
    }
}

