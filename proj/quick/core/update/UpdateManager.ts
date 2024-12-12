import { Update } from "./Update";
import { native, sys, } from "cc";
import { DEBUG, JSB, PREVIEW } from "cc/env";
import { Macro } from "../../defines/Macros";
import { UpdateItem } from "./UpdateItem";

const VERSION_FILENAME = "versions.json";
type VERSIONS = { [key: string]: { md5: string, version: string } };

/**
 * @description 热更新组件
 */
export class UpdateManager implements ISingleton {
    isResident?: boolean = true;
    static module: string = "【更新管理器】";
    module: string = null!;

    /**@description 本地存储热更新文件的路径,注意，该路径不能变动，Game.cpp中已经写了，如果要变动，需要连C++层一起改 */
    get storagePath() {
        return native.fileUtils.getWritablePath() + "caches/";
    }

    /**@description 所有下载项 */
    private items: UpdateItem[] = [];
    /**@description 当前项 */
    private current: UpdateItem | null = null;

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
    private _isSkipUpdate = false;
    /**@description 是否路过热更新 */
    public get isSkipUpdate() {
        if (this.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            return true;
        }
        return this._isSkipUpdate;
    }
    public set isSkipUpdate(value) {
        this._isSkipUpdate = value;
    }

    /**@description 资源管理器 */
    private assetsManagers: { [key: string]: Update.AssetsManager } = {};

    /**@description 远程所有版本信息 */
    private remoteVersions: VERSIONS = null!;

    /**@description 默认版本 */
    readonly defaultVersion = "1.0";

    /**@description 默认md5 */
    readonly defaultMD5 = Macro.UNKNOWN;

    /**@description 是否是预览或浏览器 */
    get isBrowser() {
        return sys.platform == sys.Platform.WECHAT_GAME || PREVIEW || sys.isBrowser;
    }

    /**@description 主包包含资源目录,固定的，请勿修改 */
    readonly mainBundles: string[] = ["src", "jsb-adapter", "assets/resources", "assets/main", "assets/internal", "main.js"];

    /**@description 是否使用了自动版本 */
    isAutoVersion: boolean = true;

    /**@description 获取资源管理器，默认为hall 大厅的资源管理器 */
    getAssetsManager(item: UpdateItem) {
        //初始化资源管理器
        let name = item.convertBundle(item.bundle);
        return this._getAssetsManager(name);
    }

    private _getAssetsManager(bundle: string) {
        if (JSB) {
            if (!this.assetsManagers[bundle]) {
                this.assetsManagers[bundle] = new Update.AssetsManager(bundle, this.storagePath);
                this.assetsManagers[bundle].manager.setMainBundles(this.mainBundles);
                //设置重新下载的标准
                this.assetsManagers[bundle].manager.setDownloadAgainZip(0.8);
            }
            Log.d(`${this.module} 设置热更新地址为:${this.realHotUpdateUrl}`);
            this.assetsManagers[bundle].manager.setPackageUrl(this.realHotUpdateUrl);
        }
        return this.assetsManagers[bundle];
    }

    get realHotUpdateUrl() {
        return `${this.hotUpdateUrl}/${this.navigationVersion}`;
    }

    /**
     * @description 删除下载的bundle缓存
     * @param bundle bundle名
     */
    removeBunbleCache(bundle: string) {
        if (JSB) {
            let assetManaer = this._getAssetsManager(bundle);
            if (assetManaer) {
                assetManaer.removeCache();
            }
        } else {
            Log.d(`${this.module} Web端无此功能`)
        }
    }

    /**@description 下载update项，以最新的为当前操作的对象 */
    dowonLoad(item: UpdateItem) {
        if (this.isSkipUpdate) {
            item.handler.onLoadBundle(item);
        } else {
            this.current = this.getItem(item);
            if (this.current) {
                if (this.current.isUpdating) {
                    Log.d(`${item.bundle} 正在更新中...`);
                    this.current.handler.onShowUpdating(this.current);
                } else {
                    Log.d(`${item.bundle} 不在更新状态，进入更新...`);
                    this._dowonLoad(item);
                }
            } else {
                Log.d(`${item.bundle} 放入下载队列中...`);
                this.items.push(item);
                this._dowonLoad(item);
            }
        }
    }

    private async _dowonLoad(item: UpdateItem) {
        this.current = item;
        let isOk = await this.loadVersions(this.current);
        if (isOk) {
            let status = this.getStatus(item.bundle);
            if (status == Update.Status.UP_TO_DATE) {
                item.state = Update.State.UP_TO_DATE;
                Log.d(`${item.bundle} 已经是最新，直接进入...`);
                item.handler.onLoadBundle(item);
            } else {
                Log.d(`${item.bundle} 进入检测更新...`);
                item.state = Update.State.READY_TO_UPDATE;
                item.checkUpdate();
            }
        }
    }

    getItem(item: UpdateItem | Update.Config) {
        if (item instanceof UpdateItem) {
            return this._getItem(item.bundle);
        } else {
            let temp = this._getItem(item.bundle);
            if (temp == null) {
                temp = new UpdateItem(item);
            }
            return temp;
        }
    }

    private _getItem(bundle: string) {
        for (let i = 0; i < this.items.length; i++) {
            if (bundle == this.items[i].bundle) {
                return this.items[i];
            }
        }
        return null;
    }

    /**
     * @description 获取当前bundle的状态
     * @param bundle bundle名
     * @returns 
     */
    getStatus(bundle: string) {
        if (this.isSkipUpdate) {
            //浏览器无更新
            return Update.Status.UP_TO_DATE;
        }
        bundle = this.convertBundle(bundle);
        let versionInfo = this.getVersionInfo(bundle);
        if (versionInfo) {
            if (versionInfo.md5 == this.remoteVersions[bundle].md5) {
                return Update.Status.UP_TO_DATE;
            }
            return Update.Status.NEED_UPDATE;
        } else {
            return Update.Status.NEED_DOWNLOAD;
        }
    }

    /**@description app 版本号 */
    get appVersion() {
        if (this.isBrowser) {
            return this.defaultVersion;
        } else {
            let path = `${Update.MANIFEST_ROOT}apk.json`;
            let dataStr = this.getString(path);
            if (dataStr) {
                let data = JSON.parse(dataStr);
                return `v${data.version}`;
            } else {
                Log.e(`${this.module}无法读取到${path}`);
                return this.defaultVersion;
            }
        }
    }

    /**
     * @description 返回当前bundle的md5
     * @param bundle 
     */
    getMd5(bundle: BUNDLE_TYPE) {
        if (this.isBrowser) {
            return this.defaultMD5;
        } else {
            bundle = this.convertBundle(bundle as string);
            let versionInfo = this.getVersionInfo(bundle);
            if (versionInfo) {
                return `${versionInfo.md5}`;
            } else {
                if (this.remoteVersions[bundle]) {
                    Log.w(`${this.module}本地无版本信息,返回远程版本${this.remoteVersions[bundle].md5}`);
                    return `${this.remoteVersions[bundle].md5}`;
                } else {
                    Log.e(`${this.module}远程无版本信息，返回默认版本${this.defaultMD5}`);
                    return this.defaultMD5;
                }
            }
        }
    }

    /**
     * @description 获取版本号,此版本号只是显示用，该热更新跟版本号无任何关系
     * @param bundle
     */
    getVersion(bundle: BUNDLE_TYPE) {
        if (this.isBrowser) {
            return this.defaultVersion;
        } else {
            bundle = this.convertBundle(bundle as string);
            if (this.isAutoVersion) {
                ///如果使用了自动版本，所有的版本号都是一致的,都使用主包版本号
                bundle = Macro.MAIN_PACK_BUNDLE_NAME;
            }
            let versionInfo = this.getVersionInfo(bundle);
            if (versionInfo) {
                return `${versionInfo.version}`;
            } else {
                if (this.remoteVersions[bundle]) {
                    Log.w(`${this.module}本地无版本信息,返回远程版本${this.remoteVersions[bundle].version}`);
                    return `${this.remoteVersions[bundle].version}`;
                } else {
                    Log.e(`${this.module}远程无版本信息，返回默认版本${this.defaultVersion}`);
                    return this.defaultVersion;
                }
            }
        }
    }

    private getString(path: string) {
        //下载缓存中
        let cachedPath = `${this.storagePath}${path}`;
        if (native.fileUtils.isFileExist(cachedPath)) {
            return native.fileUtils.getStringFromFile(cachedPath);
        } else {
            //包内
            if (native.fileUtils.isFileExist(path)) {
                return native.fileUtils.getStringFromFile(path);
            } else {
                return undefined;
            }
        }
    }

    private getVersionString(bundle: string) {
        bundle = this.convertBundle(bundle);
        let path = `${Update.MANIFEST_ROOT}${bundle}_version.json`;
        return this.getString(path);
    }

    getProjectString(bundle: string) {
        bundle = this.convertBundle(bundle);
        let path = `${Update.MANIFEST_ROOT}${bundle}_project.json`;
        return this.getString(path);
    }

    private getVersionInfo(bundle: string): { md5: string, version: string } | undefined {
        let content = this.getVersionString(bundle);
        if (content) {
            let obj = JSON.parse(content);
            return obj;
        }
        return undefined;
    }

    /**
     * @description 热更新初始化,先读取本地的所有版本信息，再拉取远程所有的版本信息
     * */
    private loadVersions(item: UpdateItem) {
        return new Promise<boolean>(async (resolove, reject) => {
            if (this.isBrowser) {
                resolove(true);
                return;
            }
            item.state = Update.State.PREDOWNLOAD_VERSION;
            item.handler.onShowUpdating(item);

            const onError = () => {
                this.remoteVersions = {};
                item.state = Update.State.FAIL_TO_UPDATE;
                item.code = Update.Code.PRE_VERSIONS_NOT_FOUND;
                item.handler.onPreVersionFailed(item);
                Log.e(`${this.module} 加载${item.bundle}时，加载远程版本信息失败...`);
                resolove(false);
            }

            let version = await this.readNavigationVersion();
            if (version) {
                DEBUG && Log.d(`${this.module} 请求远程版本信息`);
                let data = await this.readRemoteVersions();
                if (data) {
                    let bundle = item.convertBundle(item.bundle);
                    if (bundle == Update.MAIN_PACK && this.getStatus(bundle) == Update.Status.UP_TO_DATE) {
                        Log.d(`${this.module} 主包已经是最新，写入远程的版本信息`);
                        //主包更新完成，清除路径缓存信息;
                        native.fileUtils.purgeCachedEntries();
                    }
                    Log.d(`${this.module} 加载${item.bundle}时，加载远程版本信息成功...`);
                    item.state = Update.State.VERSION_LOADED;
                    resolove(true);
                } else {
                    onError();
                }
            } else {
                Log.e(`${this.module} 读取导航文件版本失败`);
                onError();
            }
        });
    }

    /**
     * @description 转换成热更新bundle
     * @param bundle 
     * @returns 
     */
    convertBundle(bundle: string) {
        if (bundle == Macro.BUNDLE_RESOURCES) {
            return Update.MAIN_PACK;
        }
        return bundle;
    }

    /**@description 读取远程版本文件 */
    private readRemoteVersions() {
        return new Promise<VERSIONS | null>((resolove) => {
            if (this.remoteVersions) {
                resolove(this.remoteVersions);
                return;
            }
            App.http.fetch(`${this.realHotUpdateUrl}/${Update.MANIFEST_ROOT}${VERSION_FILENAME}`,
                {
                    timestamp: true,
                })
                .then(response => response.json())
                .then(data => {
                    this.remoteVersions = data;
                    resolove(data);
                })
                .catch((err: Error) => {
                    Log.e(`${this.module} 读取远程版本信息失败:${err.message}`);
                    resolove(null);
                })
        })
    }

    private get navigationVersion() {
        if (this.navigationData) {
            if (this.navigationData.whiteList) {
                DEBUG && Log.d(`${this.module} 白名单更新`);
                if (this.navigationData.whiteList.length > 0 && this.navigationData.whiteList.indexOf(App.platform.uuid) > -1) {
                    DEBUG && Log.d(`${this.module} 白名单更新,更新版本:${this.navigationData.version}`);
                    return this.navigationData.version;
                } else {
                    // 更新运营版本
                    DEBUG && Log.d(`${this.module} 白名单为空,更新运营版本:${this.navigationData.onlineVersion}`);
                    return this.navigationData.onlineVersion;
                }
            }
            DEBUG && Log.d(`${this.module} 全量更新`);
            // 全量更新
            return this.navigationData.version;
        }
        return null;
    }
    navigationData: NavigationData | null = null;

    /**@description 获取导航文件版本 */
    private readNavigationVersion() {
        DEBUG && Log.d(`${this.module} 获取导航文件版本`);
        return new Promise<string | null>((resolove) => {
            if (this.navigationData) {
                resolove(this.navigationData.version);
                return;
            }
            DEBUG && Log.d(`${this.hotUpdateUrl}/navigation.json`);
            App.http.fetch(`${this.hotUpdateUrl}/navigation.json`,
                {
                    timestamp: true,
                })
                .then(response => response.json())
                .then(data => {
                    this.navigationData = data;
                    Log.d(`${this.module} 获取导航文件版本成功,热更新版本:${this.navigationData!.version}`);
                    resolove(this.navigationData!.version);
                })
                .catch((err: Error) => {
                    DEBUG && Log.e(`${this.module} 获取导航文件版本失败:${err.message}`);
                    resolove(null);
                })
        })
    }

    debug() {
        Log.d(`-----------热更新管理器中相关信息------------`);
        Log.dump({ name: "远程版本信息", data: this.remoteVersions });
    }
}
