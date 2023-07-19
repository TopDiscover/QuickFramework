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
    /**@description 资源信息 */
    export class Info {
        url: string = "";
        type: typeof cc.Asset = null;
        data: cc.Asset | cc.Asset[] = null;
        /**@description 是否常驻内存，远程加载资源有效 */
        retain: boolean = false;
        bundle: BUNDLE_TYPE = null;
        /**@description 默认为本地资源 */
        resourceType: Type = Type.Local;
        /**@description 加入释放资源的時間戳 */
        stamp: number | null = null;
        debug() {
            if (Array.isArray(this.data)) {
                this.data.forEach(v => {
                    Log.d(`url : ${this.url}/${v.name} , refCount : ${v.refCount} `)
                })
            } else {
                Log.d(`url : ${this.url} , refCount : ${this.data.refCount} `)
            }
        }
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
        data: cc.Asset | cc.Asset[] = null;

        info: Info = new Info();

        status: CacheStatus = CacheStatus.NONE;

        /**@description 在加载过程中有地方获取,加载完成后再回调 */
        getCb: ((data: any) => void)[] = [];

        /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
        finishCb: ((data: any) => void)[] = [];

        public doGet(data: any) {
            for (let i = 0; i < this.getCb.length; i++) {
                if (this.getCb[i]) this.getCb[i](data);
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
            return this.isLoaded && this.data && !cc.isValid(this.data);
        }

        debug() {

            let info = (data: cc.Asset | cc.Asset[]) => {
                if (Array.isArray(data)) {
                    let datas: { url: string, isValid: boolean, refCount: number }[] = [];
                    data.forEach(v => {
                        let isValid = cc.isValid(v);
                        datas.push({
                            url: `${this.info.url}/${isValid ? v.name : "unknown"}`,
                            isValid: isValid,
                            refCount: isValid ? v.refCount : -1
                        })
                    })
                } else {
                    let isValid = cc.isValid(data);
                    return [{
                        url: this.info.url,
                        isValid: isValid,
                        refCount: isValid ? data.refCount : -1
                    }];
                }
            };

            let data = {
                isLoaded: this.isLoaded,
                info: info(this.data),
                type: cc.js.getClassName(this.info.type),
                status: this.status,
            }
            return data;
        }
    }

    export interface Data {
        /**@description resources 目录url 与 type 必须成对出现*/
        url?: string,
        /**@description 资源类型 与 url 必须成对出现 目前支持预加载的资源有cc.Prefab | cc.SpriteFrame | sp.SkeletonData*/
        type?: typeof cc.Asset,
        /**
         * @description 预加载界面，不需要对url type赋值 
         * 如GameView游戏界面，需要提前直接加载好界面，而不是只加载预置体，
         * 在网络消息来的时间，用预置体加载界面还是需要一定的时间，
         * 从而会造成消息处理不是顺序执行 
         * */
        preloadView?: UIClass<UIView>,
        bundle?: BUNDLE_TYPE,
        /**@description 如果是加载的目录，请用dir字段 */
        dir?: string,
    }
}