import { Asset, isValid , log } from "cc";
import { EDITOR } from "cc/env";

/**
 * @description 框架全局数据类型定义，请勿引入其它文件
 */
export function typesInit() {
    if (!EDITOR) {
        log("框架数据类型初始化");
    }
}

/**@description 资源相关 */
namespace Resource {
    /**@description 资源加载器错误 */
    export enum LoaderError {
        /**@description 加载中 */
        LOADING,
        /** @description 未找到或设置加载资源*/
        NO_FOUND_LOAD_RESOURCE,
        /**@description 完美加载 */
        SUCCESS,
    }

    /**@description 资源缓存类型 */
    export enum CacheStatus {
        /**@description 无状态 */
        NONE,
        /**@description 等待释放 */
        WAITTING_FOR_RELEASE,
    }
    /**@description 资源类型 */
    export enum Type {
        /**@description 本地 */
        Local,
        /**@description 远程资源 */
        Remote,
    }
    /**@description 资源信息 */
    export class Info {
        url: string = "";
        type: typeof Asset = null!;
        data: Asset | Asset[] = null!;
        /**@description 是否常驻内存，远程加载资源有效 */
        retain: boolean = false;
        bundle: BUNDLE_TYPE = null!;
        /**@description 默认为本地资源 */
        resourceType: Type = Type.Local;
    }
    export class CacheData {
        /**@description 是否已经加载完成 */
        isLoaded: boolean = false;
        /**@description 加载完成数据 
         * cc.Prefab 
         * cc.SpriteAtlas 
         * cc.SpriteFrame 
         * cc.AudioClip 
         * cc.Font 
         * sp.SkeletonData 
         * cc.ParticleAsset 
         * cc.Texture2D
         * cc.JsonAsset
         * */
        data: Asset | Asset[] | null = null;

        info: Info = new Info();

        status: CacheStatus = CacheStatus.NONE;

        /**@description 在加载过程中有地方获取,加载完成后再回调 */
        getCb: ((data: any) => void)[] = [];

        /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
        finishCb: ((data: any) => void)[] = [];

        public doGet(data:any) {
            for (let i = 0; i < this.getCb.length; i++) {
                if (this.getCb[i]) this.getCb[i](data);
            }
            this.getCb = [];
        }

        public doFinish(data:any) {
            for (let i = 0; i < this.finishCb.length; i++) {
                if (this.finishCb[i]) this.finishCb[i](data);
            }
            this.finishCb = [];
        }

        public get isInvalid() {
            return this.isLoaded && this.data && !isValid(this.data);
        }
    }
}

toNamespace("Resource", Resource);


/**@description 热更新相关*/
namespace HotUpdate {
    /**@description 下载事件 */
    export enum Event {
        /**@description 热更新事件*/
        HOTUPDATE_DOWNLOAD = "HOTUPDATE_DOWNLOAD",
        /**@description 下载进度 */
        DOWNLOAD_PROGRESS = "DOWNLOAD_PROGRESS",
        /**@description 提示下载弹出框事件 */
        DOWNLOAD_MESSAGE = "DOWNLOAD_MESSAGE",
    }

    export enum Code {
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
    export enum State {
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

    export class BundleConfig {
        /**@description Bundle名 如:hall*/
        bundle: string = "";
        /**@description Bundle名 如:大厅  */
        name: string = "";
        index = 0;
        /**@description 加载bundle完成后，发出的bundle事件 */
        event: string = td.Logic.Event.ENTER_GAME;
        /**@description 是否需要提示弹出框提示升级 */
        isNeedPrompt: boolean = false;
        /**
         * 
         * @param name bundle名 如：大厅
         * @param bundle Bundle名 如:hall
         * @param index 游戏index,可根据自己需要决定需不需要
         * @param event 加载bundle完成后，派发事件
         * @param isNeedPrompt 是否需要弹出提示升级的弹出框
         */
        constructor(
            name: string,
            bundle: string,
            index: number,
            event?: string,
            isNeedPrompt: boolean = false) {
            this.name = name;
            this.bundle = bundle;
            this.index = index;
            this.isNeedPrompt = isNeedPrompt;
            if (event) {
                this.event = event;
            }
        }
    }
}

toNamespace("HotUpdate", HotUpdate);
