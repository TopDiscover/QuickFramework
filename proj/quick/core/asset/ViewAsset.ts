
/**
 * @description 界面资源
 */

import { DEBUG } from "cc/env";
import { Node } from "cc";
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
        public clear() {
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
                    this.local.clear();
                }
                if (this.remote) {
                    this.remote.forEach((value, key) => {
                        App.cache.remoteCaches.releaseAsset(value);
                    });
                    this.remote.clear();
                }
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
        /**@description 等待获取界面回调 */
        getViewCb: ((view: any) => void)[] = [];
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

        private doGet(view: UIView | null, className: string, msg: string) {
            for (let i = 0; i < this.getViewCb.length; i++) {
                let cb = this.getViewCb[i];
                if (cb) {
                    cb(view);
                    if (DEBUG) Log.w(`ViewData do get view : ${className} msg : ${msg}`);
                }
            }

            this.getViewCb = [];
        }

        private doFinish(view: UIView | null, className: string, msg: string) {
            for (let i = 0; i < this.finishCb.length; i++) {
                let cb = this.finishCb[i];
                if (cb) {
                    cb(view);
                    if (DEBUG) Log.w(`ViewData do finish view : ${className} msg : ${msg}`);
                }
            }
            this.finishCb = [];
        }

        doCallback(view: UIView | null, className: string, msg: string) {
            this.doFinish(view, className, msg);
            this.doGet(view, className, msg);
        }
    }
}
