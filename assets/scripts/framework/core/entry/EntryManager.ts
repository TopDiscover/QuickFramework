import { HotUpdate } from "../hotupdate/Hotupdate";
import { EntryDelegate } from "./EntryDelegate";
import { AssetManager, Node } from "cc";
import { DEBUG } from "cc/env";

/**@description 入口管理 */
export class EntryManager {
    private static _instance: EntryManager = null!;
    public static Instance() { return this._instance || (this._instance = new EntryManager()); }
    private tag = "[EntryManager] : ";
    private _entrys: Map<string, Entry> = new Map();

    /**@description 默认代理，可根据自己项目需要重新实现 */
    public delegate: EntryDelegate = new EntryDelegate();

    private node: Node | null = null;

    /**@description 注册入口 */
    register(entryClass: EntryClass<Entry>) {
        let entry = this.getEntry(entryClass.bundle);
        if (entry) {
            if ( DEBUG ){
                Log.w(`${this.tag}更新Bundle : ${entryClass.bundle} 入口程序!!!`);
            }
            this._entrys.delete(entryClass.bundle);
        }
        entry = new entryClass;
        entry.bundle = entryClass.bundle;
        this._entrys.set(entry.bundle, entry);
        if (this.node) {
            if ( DEBUG ){
                Log.d(`${this.tag} ${entry.bundle} onLoad`);
            }
            entry.onLoad(this.node);
        }
    }

    onLoad(node: Node) {
        this.node = node;
        this._entrys.forEach((entry,key)=>{
            if ( !entry.isRunning ){
                entry.onLoad(this.node as Node);
                if ( entry.isMain ){
                    if ( DEBUG ){
                        Log.d(`${this.tag}${entry.bundle} onEnter`);
                    }
                    //启动主程序入口
                    entry.onEnter();
                }
            }
        });
    }

    onDestroy(node: Node) {
        this._entrys.forEach((entry) => {
            entry.onDestroy();
        });
    }

    /**@description 主包检测更新 */
    onCheckUpdate() {
        this.delegate.onCheckUpdate();
    }

    call(bundle: BUNDLE_TYPE, eventName: string, ...args: any[]) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.call(eventName, args);
        }
    }

    /**
     * @description 进入bundle,默认代理没办法满足需求的情况，可自行定制 
     * @param bundle bundle
     * @param isQuitGame 是否退出游戏，bundel为主包时有效果
     **/
    enterBundle(bundle: BUNDLE_TYPE, isQuitGame: boolean = false) {
        let config = this.delegate.getEntryConfig(bundle);
        if (config) {
            if (isQuitGame) {
                let entry = this.getEntry(bundle);
                this.delegate.onQuitGame(entry);
            } else {
                Manager.bundleManager.enterBundle(config, this.delegate);
            }
        }
    }

    /**@description 加载bundle完成 */
    onLoadBundleComplete(versionInfo: HotUpdate.BundleConfig, bundle: AssetManager.Bundle) {
        //通知入口管理进入bundle
        let entry = this.getEntry(versionInfo.bundle);
        if (entry) {
            entry.onEnter();
        }
    }

    /**@description 进入GameView完成，卸载除了自己之外的其它bundle */
    onEnterGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onEnterGameView(gameView);
        }
        this.delegate.onEnterGameView(entry, gameView);
    }

    /**@description bundle管事器卸载bundle前通知 */
    onUnloadBundle(bundle: BUNDLE_TYPE) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
        }
    }

    onDestroyGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
            entry.onDestroyGameView(gameView);
        }
    }

    /**@description 获取bundle入口 */
    getEntry(bundle: BUNDLE_TYPE) {
        let name = Manager.bundleManager.getBundleName(bundle);
        let entry = this._entrys.get(name)
        if (entry) {
            return entry;
        }
        return null;
    }

    print(delegate: ManagerPrintDelegate<Entry>) {
        if (delegate) {
            this._entrys.forEach((data)=>{
                delegate.print(data);
            });
        }
    }
}