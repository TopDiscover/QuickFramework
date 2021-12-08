
/**
 * @description 登录流程 , 不用导出
 */

import LoginView from "./view/LoginView";
import { Config, ViewZOrder } from "../common/config/Config";
import { Macro } from "../framework/defines/Macros";
import { Entry } from "../framework/core/entry/Entry";
import { Update } from "../framework/core/update/Update";
import { Resource } from "../framework/core/asset/Resource";

class LoginEntry extends Entry {
    static bundle = Macro.BUNDLE_RESOURCES;
    /**@description 是否是主包入口，只能有一个主包入口 */
    isMain = true;

    protected addNetHandler(): void {
        
    }
    protected removeNetHandler(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        this.loader.getLoadResources = ()=>{
            return [{ preloadView: LoginView, bundle: this.bundle }];
        };
        this.loader.onLoadProgress = (err : Resource.LoaderError)=>{
            if ( err == Resource.LoaderError.LOADING){
                return;
            }
            completeCb();
        };
        this.loader.loadResources();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: LoginView, zIndex: ViewZOrder.zero, bundle: this.bundle });
        Manager.entryManager.onCheckUpdate();
    }
    protected closeGameView(): void {
        Manager.uiManager.close(LoginView);
    }
    protected initData(): void {
        Config.ENTRY_CONFIG[Macro.BUNDLE_HALL] = new Update.Config(Manager.getLanguage("hallText"),Macro.BUNDLE_HALL);
        Config.ENTRY_CONFIG[Macro.BUNDLE_RESOURCES] = new Update.Config(Manager.getLanguage("mainPack"),Macro.BUNDLE_RESOURCES);
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    
    /**@description 管理器通知自己进入GameView */
    onEnter( userData ?: any) {
        super.onEnter(userData);
        Log.d(`--------------onEnterLogin--------------`);
    }

    /**@description 这个位置说明自己GameView 进入onLoad完成 */
    onEnterGameView(gameView:GameView) {
        super.onEnterGameView(gameView);
        //销毁所有网络Handler
        Manager.netHelper.clearHandler();
        //销毁所有网络Sender
        Manager.netHelper.clearSender();
        //关闭网络
        Manager.serviceManager.close();
        //卸载proto
        Manager.protoManager.unload();
        //关闭除登录之外的界面
        Manager.uiManager.closeExcept([LoginView]);
        //清理所有数据中数据
        Manager.dataCenter.clear();
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle() {
        //移除本模块网络事件
        this.removeNetHandler();
        //卸载资源
        this.unloadResources();
    }
}
Manager.entryManager.register(LoginEntry);
