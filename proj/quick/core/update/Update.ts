import { native } from "cc";
import { Macro } from "../../defines/Macros";

/**@description 热更新相关*/
export namespace Update {
    export const MAIN_PACK = Macro.MAIN_PACK_BUNDLE_NAME;
    export const MANIFEST_ROOT = "manifest/";
    /**@description 下载信息 */
    export interface DownLoadInfo {
        /**@description 下载当前数据大小 */
        downloadedBytes: number,
        /**@description 下载数据总大小 */
        totalBytes: number,
        /**@description 当前下载文件数量 */
        downloadedFiles: number,
        /**@description 当前下载的总文件数量 */
        totalFiles: number,
        /**@description 下载总进入 */
        percent: number,
        /**@description 下载当前文件的进度 */
        percentByFile: number,
        /**@description 下载Code */
        code: Code,
        /**@description 下载State */
        state: State,
        /**@description 是否需要重启 */
        needRestart: boolean;
        /**@description bundle */
        bundle: string;
        /**@description 资源id */
        assetId: string;
        /**@description 总下载进度 0 ~ 1 >1 为下载完成 */
        progress: number;
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
        /**@description 预处理版本文件不存在 */
        PRE_VERSIONS_NOT_FOUND,
        /**@description 未初始化 */
        UNINITED,
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
        /**@description 准备加载project文件 */
        PREDOWNLOAD_MANIFEST,
        /**@description 下载project文件中 */
        DOWNLOADING_MANIFEST,
        /**@description 下载project文件完成 */
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
        /**
         * @description 准备下载更新(3.8.5之后才有) , 
         * 原3.8.5 放在READY_TO_UPDATE之前，为了统一逻辑处理，
         * 添加到末尾，为了兼容3.8.5之前的版本
         * */
        PREDOWNLOAD_UPDATE,
    }

    /**
     * @description 热更新状态，
     */
    export enum Status {
        /**@description 需要下载 */
        NEED_DOWNLOAD,
        /**@description 已经是最新版本 */
        UP_TO_DATE,
        /**@description 需要下载更新 */
        NEED_UPDATE,
    }

    export class Config {
        /**@description Bundle名 如:hall*/
        bundle: string = "";
        /**@description bundle 语言包key  */
        name: string = "";
        /**
         * 
         * @param name bundle名 如：大厅
         * @param bundle Bundle名 如:hall
         */
        constructor(
            name: string,
            bundle: string) {
            this.name = name;
            this.bundle = bundle;
        }

        clone() {
            return new Config(this.name, this.bundle);
        }
    }

    export class AssetsManager {

        constructor(name: string, storagePath: string) {
            this.name = name;
            this.type = `type.${name}`;
            this.storagePath = storagePath;
            this.create();
        }

        /**@description 当前资源管理器的名称 */
        name: string = "";

        private _manager: native.AssetsManager = null!;
        /**@description 当前资源管理器的实体 jsb.AssetsManager */
        get manager() {
            if (!this._manager) {
                this.create();
            }
            return this._manager;
        }
        set manager(v) {
            this._manager = v;
        }

        private type: string = "";

        private storagePath: string = "";

        reset() {
            this.manager.reset();
        }

        /**
         * @description 删除本地缓存
         */
        removeCache(){
            //删除下载缓存
            this.manager.removeBundle(this.storagePath);
            //删除下载临时缓存
            this.manager.removeBundle(this.storagePath.substring(0,this.storagePath.length-1) + "_temp/");
            //派发事件
            dispatch(Macro.ON_DELETE_BUNDLE_CACHE,this.name);
        }

        private create() {
            Log.d(`创建 ${this.name} AssetsManager`);
            this.manager = new native.AssetsManager(this.type, this.storagePath);
        }
    }
}