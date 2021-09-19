import { HotUpdate } from "../hotupdate/Hotupdate";
import { EntryDelegate } from "./EntryDelegate";

/**@description 入口管理 */
export class EntryManager {
    private static _instance: EntryManager = null!;
    public static Instance() { return this._instance || (this._instance = new EntryManager()); }
    private tag = "[EntryManager] : ";
    private _entryTypes: EntryClass<Entry>[] = [];
    private _entrys: Entry[] = [];

    /**@description 默认代理，可根据自己项目需要重新实现 */
    public delegate: EntryDelegate = new EntryDelegate();

    private node: cc.Node | null = null;

    /**@description 注册入口 */
    register(entryClass: EntryClass<Entry>) {
        let index = this._entryTypes.indexOf(entryClass);
        if (index != -1) {
            if (CC_DEBUG) {
                Log.e(`${this.tag}重复添加 : ${entryClass.bundle}`);
            }
            return;
        }
        if (this.node) {
            //场景已经进入了onLoad,创建该入口，初始化
            let entry = new entryClass;
            entry.bundle = entryClass.bundle;
            entry.onLoad(this.node);
            this._entrys.push(entry);
        } else {
            this._entryTypes.push(entryClass);
        }
    }

    onLoad(node: cc.Node) {
        this.node = node;
        let mainEntry : Entry | null = null;
        for (let i = 0; i < this._entryTypes.length; i++) {
            let type = this._entryTypes[i];
            if (!this.isRunning(type)) {
                //如果当前entry没有运行,执行它
                let entry = new type();
                Log.d(`${this.tag}添加${entry.bundle}入口程序!!!`);
                entry.bundle = type.bundle;
                entry.onLoad(this.node);
                if( type.isMain ){
                    mainEntry = entry;
                }
                this._entrys.push(entry);
            }
        }

        //启动主包入口，
        if ( mainEntry ){
            mainEntry.onEnter();
        }
    }

    onDestroy(node: cc.Node) {
        this._entrys.forEach((entry) => {
            entry.onDestroy();
        });
    }

    /**@description 主包检测更新 */
    onCheckUpdate(){
        this.delegate.onCheckUpdate();
    }

    call(bundle:BUNDLE_TYPE,eventName:string,...args:any[]){
        let entry = this.getEntry(bundle);
        if( entry ){
            entry.call(eventName,args);
        }
    }

    /**
     * @description 进入bundle,默认代理没办法满足需求的情况，可自行定制 
     * @param bundle bundle
     * @param isQuitGame 是否退出游戏，bundel为主包时有效果
     **/
    enterBundle(bundle:BUNDLE_TYPE,isQuitGame : boolean = false) {
        let config = this.delegate.getEntryConfig(bundle);
        if ( config ){
            if( isQuitGame ){
                let entry = this.getEntry(bundle);
                this.delegate.onQuitGame(entry);
            }else{
                Manager.bundleManager.enterBundle(config, this.delegate);
            }
        }   
    }

    /**@description 加载bundle完成 */
    onLoadBundleComplete(versionInfo: HotUpdate.BundleConfig, bundle: cc.AssetManager.Bundle) {
        //通知入口管理进入bundle
        let entry = this.getEntry(versionInfo.bundle);
        if ( entry ){
            entry.onEnter();
        }
    }

    /**@description 进入GameView完成，卸载除了自己之外的其它bundle */
    onEnterGameView( bundle : BUNDLE_TYPE , gameView : GameView ){
        let entry = this.getEntry(bundle);
        if( entry ){
            entry.onEnterGameView(gameView);
        }
        this.delegate.onEnterGameView(entry,gameView);
    }

    /**@description bundle管事器卸载bundle前通知 */
    onUnloadBundle( bundle : BUNDLE_TYPE){
        let entry = this.getEntry(bundle);
        if ( entry ){
            entry.onUnloadBundle();
        }
    }

    onDestroyGameView(bundle: BUNDLE_TYPE, gameView: GameView) {
        let entry = this.getEntry(bundle);
        if ( entry ){
            entry.onUnloadBundle();
            entry.onDestroyGameView(gameView);
        }
    }

    /**@description 获取bundle入口 */
    getEntry( bundle : BUNDLE_TYPE ){
        for ( let i = 0 ; i < this._entrys.length ; i++){
            let entry = this._entrys[i];
            if ( entry && entry.bundle == bundle ){
                return entry;
            }
        }
        return null;
    }

    private isRunning(entryClass: EntryClass<Entry>) {
        for (let i = 0; i < this._entrys.length; i++) {
            let entry = this._entrys[i];
            if (entry.bundle == entryClass.bundle) {
                return entry.isRunning;
            }
        }
        return false;
    }
}