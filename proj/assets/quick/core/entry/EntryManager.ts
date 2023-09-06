import { EntryDelegate } from "./EntryDelegate";
import { Macro } from "../../defines/Macros";
import { UpdateItem } from "../update/UpdateItem";
import GameView from "../ui/GameView";

/**@description 入口管理 */
export class EntryManager implements ISingleton{
    static module: string = "【入口管理器】";
    module: string = null!;
    isResident?: boolean  = true;
    private _entrys: Map<string, Entry> = new Map();

    /**@description 默认代理，可根据自己项目需要重新实现 */
    public delegate: EntryDelegate = new EntryDelegate();

    private node: cc.Node | null = null;

    /**@description 注册入口 */
    register(entryClass: EntryClass<Entry>,type:typeof GameView) {
        let entry = this.getEntry(entryClass.bundle);
        if (entry) {
            if ( CC_DEBUG ){
                Log.w(`${this.module}更新Bundle : ${entryClass.bundle} 入口程序!!!`);
            }
            this._entrys.delete(entryClass.bundle);
        }
        entry = new entryClass;
        entry.bundle = entryClass.bundle;
        entry.gameViewType = type;
        this._entrys.set(entry.bundle, entry);
        if (this.node) {
            if ( CC_DEBUG ){
                Log.d(`${this.module} ${entry.bundle} onLoad`);
            }
            entry.onLoad(this.node);
        }
    }

    onLoad(node: cc.Node) {
        this.node = node;
        this._entrys.forEach((entry,key)=>{
            if ( !entry.isRunning ){
                entry.onLoad(this.node);
                if ( entry.isMain ){
                    if ( CC_DEBUG ){
                        Log.d(`${this.module}${entry.bundle} onEnter`);
                    }
                    //启动主程序入口
                    entry.onEnter();
                }
            }
        });
    }

    onDestroy(node: cc.Node) {
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
     * @param userData 用户自定义数据
     **/
    enterBundle(bundle: BUNDLE_TYPE , userData ?: any) {
        let config = this.delegate.getEntryConfig(bundle);
        if (config) {
            if (bundle == Macro.BUNDLE_RESOURCES) {
                let entry = this.getEntry(bundle);
                this.delegate.onEnterMain(entry,userData);
            } else {
                config.userData = userData;
                App.bundleManager.enterBundle(config);
            }
        }
    }

    /**
     * @description 返回上一场景 
     * */
    backBundle( userData ?: any ){
        let bundle = App.stageData.prevWhere;
        if ( bundle ){
            this.enterBundle(bundle,userData);
        }else{
            Log.d(`${this.module}已经是最后一个场景，无法返回`);
        }
    }

    /**@description 加载bundle完成 */
    onLoadBundleComplete(item:UpdateItem) {
        // 加载完成后，记录加载过的标识
        item.isLoaded = true;
        //通知入口管理进入bundle
        let entry = this.getEntry(item.bundle);
        if (entry) {
            entry.onEnter(item.userData);
        }
    }

    /**@description 进入GameView完成，卸载除了自己之外的其它bundle */
    onEnterGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            this.delegate.onEnterGameView(entry, gameView);
            entry.onEnterGameView(gameView);
        }
    }

    onDestroyGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onDestroyGameView(gameView);
        }
    }

    /**@description 管理器调用show时,在GameView的onLoad之后  */
    onShowGameView(bundle : BUNDLE_TYPE , gameView : GameView){
        let entry = this.getEntry(bundle);
        if ( entry ){
            this.delegate.onShowGameView(entry,gameView);
            entry.onShowGameView(gameView);
        }
    }

    onCloseGameView(bundle : BUNDLE_TYPE , gameView : GameView){
        let entry = this.getEntry(bundle);
        if ( entry ){
            entry.onCloseGameView(gameView);
        }
    }

    /**@description bundle管事器卸载bundle前通知 */
    onUnloadBundle(bundle: BUNDLE_TYPE) {
        let entry = this.getEntry(bundle);
        if (entry) {
            entry.onUnloadBundle();
        }
    }

    /**@description 获取bundle入口 */
    getEntry(bundle: BUNDLE_TYPE) {
        let name = App.bundleManager.getBundleName(bundle);
        let entry = this._entrys.get(name)
        if (entry) {
            return entry;
        }
        return null;
    }

    debug(){
        Log.d(`-------Bundle入口管理器-------`)
        this._entrys.forEach(v=>{
            Log.d(`bundle : ${v.bundle}`);
        })
    }
}