/**@description 游戏层公共基类 */
import UIView from "./UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends UIView {

    onLoad(){
        //调用进入后台重连的时间
        Manager.gameView = this;
        super.onLoad();

        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        this.onEnterComplete()
    }

    protected onEnterComplete(){
        Manager.entryManager.onEnterBundleComplete(this.bundle);
    }

    onDestroy(){
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        
        Manager.gameView = null;
        super.onDestroy();
    }
}
