/**
 * @description 框架全局数据类型定义，请勿引入其它文件
 */
export function typesInit() {
    if (!CC_EDITOR) {
        cc.log("框架数据类型初始化");
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
        type: typeof cc.Asset = null;
        data: cc.Asset | cc.Asset[] = null;
        /**@description 是否常驻内存，远程加载资源有效 */
        retain: boolean = false;
        bundle: BUNDLE_TYPE = null;
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
        data: cc.Asset | cc.Asset[] = null;

        info: Info = new Info();

        status:CacheStatus = CacheStatus.NONE;

        /**@description 在加载过程中有地方获取,加载完成后再回调 */
        getCb: ((data: any) => void)[] = [];

        /**@description 完成回调，在资源正在加载过程中，又有其它地方调用加载同一个资源，此时需要等待资源加载完成，统一回调 */
        finishCb: ((data: any) => void)[] = [];

        public doGet(data) {
            for (let i = 0; i < this.getCb.length; i++) {
                if (this.getCb[i]) this.getCb[i](data);
            }
            this.getCb = [];
        }

        public doFinish(data) {
            for (let i = 0; i < this.finishCb.length; i++) {
                if (this.finishCb[i]) this.finishCb[i](data);
            }
            this.finishCb = [];
        }

        public get isInvalid() {
            return this.isLoaded && this.data && !cc.isValid(this.data);
        }
    }
}

toNamespace("Resource", Resource);
