
/**
 * @description 登录流程 , 不用导出
 */

import LoginView from "./view/LoginView";
import { ViewZOrder } from "../common/config/Config";
import { Macro } from "../framework/defines/Macros";
import { Entry } from "../framework/core/entry/Entry";
import { Singleton } from "../framework/utils/Singleton";
import { registerEntry } from "../framework/defines/Decorators";

@registerEntry("LoginEntry",Macro.BUNDLE_RESOURCES,LoginView)
class LoginEntry extends Entry {
    /**@description 是否是主包入口，只能有一个主包入口 */
    isMain = true;
    protected addNetHandler(): void {
        
    }
    protected removeNetHandler(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
       completeCb();
    }
    protected openGameView(): void {
        super.openGameView();
        App.entryManager.onCheckUpdate();
    }
    protected initData(): void {
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
        //关闭除登录之外的界面
        App.uiManager.closeExcept([LoginView]);
        Singleton.destory();
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle() {
        //移除本模块网络事件
        this.removeNetHandler();
        //卸载资源
        this.unloadResources();
    }
}
