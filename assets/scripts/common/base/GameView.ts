/**@description 游戏层公共基类 */

import { _decorator } from "cc";
import { Manager } from "../../framework/Framework";
import UIView from "../../framework/ui/UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property} = _decorator;

@ccclass
export default class GameView extends UIView {


    //重写show函数自己处理自己的喇叭位置,如果不写，默认为上一个场景的显示位置
    //show(args:any[]){
    //    super.show(args);
    //    Manager.horn.update();
    //}

    onLoad(){
        //调用进入后台重连的时间
        Manager.gameView = this;
        super.onLoad();

        //通用公共网络重连组件添加

        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        //dispatchEnterComplete( {type : LogicType.GAME,views:[this],data : GameName.likuiby });
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
