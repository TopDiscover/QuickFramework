
/**
 * @description 界面资源
 */

import { DEBUG } from "cc/env";
import { Node, isValid, tiledLayerAssembler } from "cc";
import { Resource } from "./Resource";
import { ViewStatus } from "../../defines/Enums";
import { Macro } from "../../defines/Macros";

export namespace ViewAsset {
    /**@description 动态加载资源 */
    export class Dynamic {
        private local = new Map<string, Resource.Cache>();
        private remote = new Map<string, Resource.Cache>();
        public name: string | null;

        constructor(name: string | null = null) {
            this.name = name;
        }

        /**@description 添加动态加载的本地资源 */
        public addLocal(cache: Resource.Cache, className: string | null = null) {
            if (this.name == Macro.DYNAMIC_LOAD_GARBAGE) {
                Log.e(`找不到资源持有者: ${cache.key}`);
            }
            if (DEBUG) App.uiManager.checkView(cache.key, className);
            if (!this.local.has(cache.key)) {
                App.asset.retainAsset(cache);
                this.local.set(cache.key, cache);
            }
        }

        /**@description 添加动态加载的远程资源 */
        public addRemote(cache: Resource.Cache, className: string | null = null) {
            if (!this.remote.has(cache.key)) {
                if (this.name == Macro.DYNAMIC_LOAD_GARBAGE) {
                    Log.e(`找不到资源持有者 : ${cache.key}`);
                }
                if (DEBUG) App.uiManager.checkView(cache.key, className);
                App.cache.remoteCaches.retainAsset(cache);
                this.remote.set(cache.key, cache);
            }
        }

        /**@description 清除远程加载资源 */
        public clear(isCache = false) {
            if (this.name == Macro.DYNAMIC_LOAD_GARBAGE) {
                //先输出
                let isShow = this.local.size > 0 || this.remote.size > 0;
                if (isShow) {
                    Log.e(`当前未能释放资源如下:`);
                }
                if (this.local && this.local.size > 0) {
                    Log.e("-----------local-----------");
                    if (this.local) {
                        this.local.forEach((value, key) => {
                            Log.e(key);
                        });
                    }
                }
                if (this.remote && this.remote.size > 0) {
                    Log.e("-----------remote-----------");
                    if (this.remote) {
                        this.remote.forEach((value, key) => {
                            Log.e(key);
                        });
                    }
                }
            } else {
                //先清除当前资源的引用关系
                if (this.local) {
                    this.local.forEach((value, key) => {
                        App.asset.releaseAsset(value);
                    });
                    if (!isCache) {
                        this.local.clear();
                    }
                }
                if (this.remote) {
                    this.remote.forEach((value, key) => {
                        App.cache.remoteCaches.releaseAsset(value);
                    });
                    if (!isCache) {
                        this.remote.clear();
                    }
                }
            }
        }

        resume(input: Resource.Cache) {
            let cache = App.releaseManger.get(input.bundle, input.key);
            if (cache) {
                App.cache.set(cache);
                App.asset.retainAsset(cache);
            }
        }

        resumeRelease() {
            if (this.local) {
                this.local.forEach((value, key) => {
                    this.resume(value);
                });
            }
            if (this.remote) {
                this.remote.forEach((value, key) => {
                    this.resume(value);
                });
            }
        }
    }

    export class Data {
        /**@description 界面是否已经加载 */
        isLoaded: boolean = false;
        /**@description 界面当前等待操作状态 */
        status: ViewStatus = ViewStatus.WAITTING_NONE;
        /**@description 实际显示界面 */
        view: UIView = null!;
        /**@description 等待加载完成回调 */
        finishCb: ((view: any) => void)[] = [];
        /**是否预加载,不显示出来，但会加到当前场景上 */
        isPreload: boolean = false;
        /**@description 是否通过预置创建 */
        isPrefab: boolean = true;
        /**@description 资源缓存信息 */
        cache: Resource.Cache = null!;
        /**@description 界面的类型 */
        viewType: UIClass<UIView> = null!;
        /**@description bundle */
        bundle: BUNDLE_TYPE = null!;
        /**@description 界面动态加载的数据 */
        loadData: Dynamic = new Dynamic();
        node: Node = null!;
        isCache: boolean = false;

        get name() {
            return this.loadData.name!;
        }

        doFinish(view: UIView | null, className: string, msg: string) {
            for (let i = 0; i < this.finishCb.length; i++) {
                let cb = this.finishCb[i];
                if (cb) {
                    cb(view);
                    if (DEBUG) Log.w(`ViewData do finish view : ${className} msg : ${msg}`);
                }
            }
            this.finishCb = [];
        }

        resumeRelease() {
            let isCache = App.isLazyRelease && this.isCache;
            let ret = this;
            if (isCache) {
                //如果节点已经不存在，则直接销毁资源
                if (isValid(this.view) && isValid(this.node)) {
                    //先从释放管理器中取回预置
                    if (this.isPrefab) {
                        this.loadData.resume(this.cache);
                    }
                    //从待释放资源中取回已经加载过的资源
                    this.loadData.resumeRelease();
                } else {
                    //在释放管理器资源，由管理继续管理，等待超时释放就可以了
                    ret = undefined!;
                }
            }
            return ret;
        }

        toRelease() {
            this.status = ViewStatus.WAITTING_CLOSE;
            let isCache = App.isLazyRelease && this.isCache;
            let isSuccess = false;
            if (isValid(this.view) && isValid(this.node)) {
                this.node.removeFromParent();
                this.view.onClose();
                if (isCache) {
                    isSuccess = true
                } else {
                    this.node.destroy();
                }
            }
            if (this.isPrefab && this.cache) {
                App.asset.releaseAsset(this.cache);
            }
            this.loadData.clear(isCache);
            return isSuccess;
        }

        destroy(){
            if ( isValid(this.view) && isValid(this.node) ){
                this.node.destroy();
                DEBUG && Log.d(`${App.releaseManger.module}销毁UI : ${this.name}`);
            }
        }
    }
}
