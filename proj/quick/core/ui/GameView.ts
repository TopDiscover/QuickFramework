/**@description 游戏层公共基类 */

import { _decorator } from "cc";
import UIView from "./UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property,menu} = _decorator;

@ccclass("GameView")
@menu("Quick公共组件/GameView")
export default class GameView extends UIView {

    onLoad(){
        super.onLoad();
        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        this.onEnterGameView()
    }

    onShow(): void {
        App.entryManager.onShowGameView(this.bundle,this);
        super.onShow();
    }

    protected onEnterGameView(){
        App.entryManager.onEnterGameView(this.bundle,this);
    }

    /**
     * @description 进入指定Bundle
     * @param bundle Bundle名
     * @param userData 用户自定义数据
     */
    enterBundle( bundle : BUNDLE_TYPE , userData ?: EntryUserData){
        App.entryManager.enterBundle(bundle , userData);
    }

    /**
     * @description 返回上一场景
     * @param userData 用户自定义数据
     */
    backBundle(userData?:EntryUserData){
        App.entryManager.backBundle(userData);
    }

    onDestroy(){
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        App.entryManager.onDestroyGameView(this.bundle,this);
        super.onDestroy();
    }

    onClose(): void {
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        App.entryManager.onCloseGameView(this.bundle,this);
        super.onClose();
    }
}
