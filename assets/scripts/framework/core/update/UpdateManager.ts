import { Update } from "./Update";
import { Macro } from "../../defines/Macros";
import { HttpPackage } from "../net/http/HttpClient";
import { Http } from "../net/http/Http";
import { UpdateItem } from "./UpdateItem";

const VERSION_FILENAME = "versions.json";
type VERSIONS = { [key: string]: { md5: string, version: string } };

/**
 * @description 热更新组件
 */
export class UpdateManager {
    private static _instance: UpdateManager = null!;
    public static Instance() { return this._instance || (this._instance = new UpdateManager()); }
    /**@description 本地存储热更新文件的路径 */
    get storagePath() {
        return jsb.fileUtils.getWritablePath() + "caches/";
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
    public isSkipCheckUpdate = true;

    /**@description 资源管理器 */
    private assetsManagers: { [key: string]: Update.AssetsManager } = {};

    /**@description 预处理版本信息 */
    private preVersions: VERSIONS = {};
    /**@description 远程所有版本信息 */
    private remoteVersions: VERSIONS = {};

    /**@description 释放资源管理器，默认为hall 大厅资源管理器 */
    restAssetsManager(name: string = Update.MAIN_PACK) {
        if (this.assetsManagers[name]) {
            Log.d("restAssetsManager : " + name);
            this.assetsManagers[name].reset();
        }
    }

    /**@description 获取资源管理器，默认为hall 大厅的资源管理器 */
    getAssetsManager(item: UpdateItem) {
        //初始化资源管理器
        let name = item.convertBundle(item.bundle);
        if (CC_JSB) {
            Log.d(`Storage path for remote asset : ${this.storagePath}`);
            this.assetsManagers[name] = new Update.AssetsManager(name);
            this.assetsManagers[name].manager = new jsb.AssetsManager(name == Update.MAIN_PACK ? `type.${Update.MAIN_PACK}` : `type.${name}`, this.storagePath);
            //设置下载并发量
            this.assetsManagers[name].manager.setPackageUrl(this.hotUpdateUrl);
            this.assetsManagers[name].manager.setMainBundles(Manager.bundleManager.mainBundles);
            //设置重新下载的标准
            this.assetsManagers[name].manager.setDownloadAgainZip(0.8);
        }
        return this.assetsManagers[name];
    }

    /**@description 是否是预览或浏览器 */
    private get isBrowser( ){
        return cc.sys.platform == cc.sys.WECHAT_GAME || CC_PREVIEW || cc.sys.isBrowser;
    }

    private isSkipUpdate(item: UpdateItem) {
        if (this.isBrowser) {
            //预览及浏览器下，不需要有更新的操作
            item.isUpdating = false;
            return true;
        } else {
            if (this.isSkipCheckUpdate) {
                Log.d("跳过热更新，直接使用本地资源代码");
                item.isUpdating = false;
            }
            return this.isSkipCheckUpdate;
        }
    }

    /**@description 下载update项，以最新的为当前操作的对象 */
    dowonLoad(item: UpdateItem) {
        if (this.isSkipUpdate(item)) {
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

    private _dowonLoad(item: UpdateItem) {
        this.current = item;
        this.current.isUpdating = true;
        this.loadVersions(this.current).then((isOk) => {
            if (isOk) {
                item.isUpdating = false;
                let status = this.getStatus(item.bundle);
                if (status == Update.Status.UP_TO_DATE) {
                    if (item.bundle == Macro.BUNDLE_HALL && this.isMd5Change(Update.MAIN_PACK)) {
                        //大厅已经是最新，需要检测主包是否有更新
                        Log.d(`进入${item.bundle} 时，需要更新主包`);
                        item.handler.onNeedUpdateMain(item);
                    } else {
                        Log.d(`${item.bundle} 已经是最新，直接进入...`);
                        item.handler.onLoadBundle(item);
                    }
                } else {
                    Log.d(`${item.bundle} 进入检测更新...`);
                    item.checkUpdate();
                }
            }
        });
    }

    private getItem(item: UpdateItem) {
        for (let i = 0; i < this.items.length; i++) {
            if (item.bundle == this.items[i].bundle) {
                return item;
            }
        }
        return null;
    }

    checkAllowUpdate(item: UpdateItem, code: number) {
        //非主包检测更新
        //有新版本，看下是否与主包版本匹配
        let md5 = item.remoteMd5;
        let versionInfo = this.preVersions[item.updateName];
        if (versionInfo == undefined || versionInfo == null) {
            Log.e(`预处理版本未存在!!!!`);
            return Update.Code.PRE_VERSIONS_NOT_FOUND;
        } else {
            //先检查主包是否需要更新
            if (versionInfo.md5 == md5) {
                //主包无需要更新
                Log.d(`${item.bundle} 将要下载版本 md5 与远程版本 md5 相同，可以下载 version : ${versionInfo.version} md5:${versionInfo.md5}`);
            } else {
                if (item.bundle == Macro.BUNDLE_HALL) {
                    //如果是大厅更新，只要主包的md5不发生变化，则可以直接更新大厅
                    Log.d(`${item.bundle} 更新`);
                    if (this.isMd5Change(Update.MAIN_PACK)) {
                        Log.d(`更新${item.bundle}时，主包有更新，需要先更新主包`);
                        code = Update.Code.MAIN_PACK_NEED_UPDATE;
                    } else {
                        Log.d(`更新${item.bundle}时，主包无更新，直接更新进入`);
                    }
                } else {
                    //更新其它子包，只需要大厅的md5及主包md5没有变化，即可直接更新进入bundle
                    if (this.isMd5Change(Update.MAIN_PACK) || this.isMd5Change(Macro.BUNDLE_HALL)) {
                        Log.d(`更新${item.bundle}时，主包与大厅有更新，下载 md5 :${md5} 与预处理md5不一致，需要对主包先进行更新`);
                        code = Update.Code.MAIN_PACK_NEED_UPDATE;
                    } else {
                        Log.e(`更新${item.bundle}时，主包与大厅无更新，可直接下载更新！！`);
                    }
                }
            }
            return code;
        }
    }
    /**@description 检测主包md5 */
    checkMainMd5(item: UpdateItem, code: number) {
        Log.d(`${item.bundle} 无更新，检测主包md5是否变化，如果变更，需要提示玩家更新主包`);
        if (this.isMd5Change(Update.MAIN_PACK)) {
            Log.d(`进入${item.bundle}时，主包有更新，需要先更新主包`);
            code = Update.Code.MAIN_PACK_NEED_UPDATE;
        }
        return code;
    }

    /**
     * @description 获取当前bundle的状态
     * @param bundle bundle名
     * @returns 
     */
    getStatus(bundle: string) {
        if (cc.sys.isBrowser) {
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

    /**
     * @description 获取版本号,此版本号只是显示用，该热更新跟版本号无任何关系
     * @param bundle 
     * @param isShortVersion 是否使用简单的版本号
     */
    getVersion(bundle: BUNDLE_TYPE, isShortVersion: boolean = true) {
        if (cc.sys.isBrowser) {
            return "v1.0";
        } else {
            bundle = this.convertBundle(bundle as string);
            let versionInfo = this.getVersionInfo(bundle);
            if (versionInfo) {
                if (isShortVersion) {
                    return `v${versionInfo.version}`;
                }
                return `v${versionInfo.version}(${versionInfo.md5})`;
            } else {
                if (this.remoteVersions[bundle]) {
                    if (isShortVersion) {
                        return `v${this.remoteVersions[bundle]}`;
                    }
                    return `v${this.remoteVersions[bundle]}(${this.remoteVersions[bundle].md5})`;
                } else {
                    return `v1.0`;
                }
            }
        }
    }

    /**
     * @description md5是否发生变化
     * @param bundle 
     */
    private isMd5Change(bundle: string) {
        bundle = this.convertBundle(bundle);
        if (this.preVersions[bundle] && this.remoteVersions[bundle] && this.preVersions[bundle].md5 != this.remoteVersions[bundle].md5) {
            return true
        }
        return false
    }

    private getString(path:string){
        //下载缓存中
        let cachedPath = `${this.storagePath}${path}`;
        if (jsb.fileUtils.isFileExist(cachedPath)) {
            return jsb.fileUtils.getStringFromFile(cachedPath);
        } else {
            //包内
            if (jsb.fileUtils.isFileExist(path)) {
                return jsb.fileUtils.getStringFromFile(path);
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

    getProjectString(bundle:string){
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
        return new Promise<boolean>((resolove, reject) => {
            if (cc.sys.isBrowser) {
                resolove(true);
                return;
            }
            item.state = Update.State.DOWNLOADING_VERSION;
            item.handler.onShowUpdating(item);
            this.readRemoteVersions((data, err) => {
                if (err) {
                    this.remoteVersions = {};
                    item.code = Update.Code.PRE_VERSIONS_NOT_FOUND;
                    item.handler.onPreVersionFailed(item);
                    //重新标识
                    item.isUpdating = false;
                    Log.e(`加载${item.bundle}时，加载远程版本信息失败...`);
                    resolove(false);
                } else {
                    this.remoteVersions = JSON.parse(data);
                    let bundle = item.convertBundle(item.bundle);
                    if (bundle == Update.MAIN_PACK && this.getStatus(bundle) == Update.Status.UP_TO_DATE) {
                        Log.d(`主包已经是最新，写入远程的版本信息`);
                        this.preVersions = JSON.parse(data);
                        //主包更新完成，清除路径缓存信息
                        jsb.fileUtils.purgeCachedEntries();
                    }
                    Log.d(`加载${item.bundle}时，加载远程版本信息成功...`);
                    resolove(true);
                }
            });
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
    private readRemoteVersions(complete: (data: string, err?: Http.Error) => void) {
        let httpPackage = new HttpPackage;
        httpPackage.data.url = `${this.hotUpdateUrl}/${Update.MANIFEST_ROOT}${VERSION_FILENAME}`;
        httpPackage.data.isAutoAttachCurrentTime = true;
        httpPackage.send((data) => {
            complete(data);
        }, (err) => {
            Log.dump(err);
            complete("", err);
        });
    }

    savePreVersions() {
        this.readRemoteVersions((data, err) => {
            if (err) {
                this.preVersions = {};
            } else {
                this.preVersions = JSON.parse(data);
            }
        });
    }

    print(delegate: ManagerPrintDelegate<any>) {
        delegate.print({ name: "预处理版本信息", data: this.preVersions });
        delegate.print({ name: "远程版本信息", data: this.remoteVersions });
    }
}
