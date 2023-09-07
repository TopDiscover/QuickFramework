import { Asset, isValid, js } from "cc";

/**@description 资源相关 */
export namespace Resource {
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
    export class Cache {

        constructor(url: string, type: typeof Asset, bundle: BUNDLE_TYPE) {
            this.url = url;
            this.type = type;
            this.bundle = bundle;
        }

        /**@description 缓存的key值 */
        get key() {
            return getKey(this.url, this.type);
        }

        /**@description 描述 */
        get description() {
            let typeStr = js.getClassName(this.type);
            if (this.resourceType == Resource.Type.Local) {
                return `本地 : ${Array.isArray(this.data) ? "目录" : ""}[${typeStr}]${this.fullUrl}`;
            }
            return `远程 : [${typeStr}]${this.fullUrl}`;
        }

        /**@description 资源全路径 */
        get fullUrl() {
            if (this.resourceType == Resource.Type.Local) {
                return `${this.bundle}/${this.url}`;
            } else {
                return this.url;
            }
        }

        /**@description 资源url */
        url: string = "";
        /**@description 资源类型 */
        type: typeof Asset = null!;
        /**@description 资源所在bundle */
        bundle: BUNDLE_TYPE = null!;
        /**@description 是否常驻内存，远程加载资源有效 */
        protected _retain: boolean = false;
        set retain(v) {
            if (this._retain) {
                Log.w(`${this.fullUrl}已经是常驻资源，无需要重复设置`);
                return;
            }
            this._retain = v;
        }
        get retain() {
            return this._retain;
        }

        /**@description 目录资源有效 */
        refCount = 0;

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
        data: Asset | Asset[] = null!;
        /**@description 默认为本地资源 */
        resourceType: Type = Type.Local;
        /**@description 加入释放资源的時間戳 */
        stamp: number | null = null;

        /**@description 是否已经加载完成 */
        isLoaded: boolean = false;

        status: CacheStatus = CacheStatus.NONE;

        /**@description 在加载过程中有地方获取,加载完成后再回调 */
        getCb: ((data: any) => void)[] = [];

        /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
        finishCb: ((data: any) => void)[] = [];

        public doGet() {
            for (let i = 0; i < this.getCb.length; i++) {
                if (this.getCb[i]) this.getCb[i]([this, this.data]);
            }
            this.getCb = [];
        }

        public doFinish(data: any) {
            for (let i = 0; i < this.finishCb.length; i++) {
                if (this.finishCb[i]) this.finishCb[i](data);
            }
            this.finishCb = [];
        }

        public get isInvalid() {
            return this.isLoaded && this.data && !isValid(this.data);
        }

        debug() {

            let type = js.getClassName(this.type);
            let info = (data: Asset | Asset[] | null) : { url: string, isValid: boolean, refCount: number }[] =>{
                if (!data) {
                    return [{ url : this.fullUrl , isValid : false , refCount : -1}];
                }
                if (Array.isArray(data)) {
                    let datas: { url: string, isValid: boolean, refCount: number }[] = [];
                    data.forEach(v => {
                        let temp = isValid(v);
                        datas.push({
                            url: `${this.fullUrl}/${temp ? v.name : "unknown"}`,
                            isValid: temp,
                            refCount: temp ? v.refCount : -1
                        })
                    })
                    return datas;
                } else {
                    let temp = isValid(data);
                    return [{
                        url: this.fullUrl,
                        isValid: temp,
                        refCount: temp ? data.refCount : -1
                    }];
                }
            };

            let data = {
                isLoaded: this.isLoaded,
                info: info(this.data),
                status: this.status,
                type : type,
            }
            return data;
        }
    }

    export interface Data {
        /**@description resources 目录url 与 type 必须成对出现*/
        url?: string,
        /**@description 资源类型 与 url 必须成对出现*/
        type?: typeof Asset,
        /**
         * @description 预加载界面，不需要对url type赋值 
         * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
         * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
         * 从而会造成消息处理不是顺序执行 
         * */
        preloadView?: UIClass<UIView>,
        bundle?: BUNDLE_TYPE,
        /**@description 如果是加载的目录，请用dir字段,必须指定类型，否则无法正确的释放资源 */
        dir?: string,
        /**@description 是否缓存preloadView */
        isCache?:boolean,
    }

    export function getKey(url: string, type: typeof Asset | Asset) {
        if (url.indexOf(js.getClassName(type)) >= 0) {
            return url;
        }
        return `${url}(${js.getClassName(type)})`;
    }
}