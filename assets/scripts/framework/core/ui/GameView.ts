/**@description 游戏层公共基类 */
import UIView from "./UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends UIView {

    static logicType : LogicClass<Logic> | null = null;
    protected _logic : Logic | null = null;
    protected get logic(){
        return this._logic;
    }
    /**@description 由管理器统一设置，请勿操作 */
    setLogic(logic : Logic ){
        this._logic = logic;
        if ( logic ){
            logic.onLoad(this);
        }
    }
    onLoad(){
        super.onLoad();
        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        this.onEnterGameView()
    }

    show(options ?: ViewOption){
        super.show(options);
        Manager.entryManager.onShowGameView(this.bundle,this);
    }

    protected onEnterGameView(){
        Manager.entryManager.onEnterGameView(this.bundle,this);
    }

    enterBundle( bundle : BUNDLE_TYPE , isQuitGame : boolean = false){
        Manager.entryManager.enterBundle(bundle , isQuitGame);
    }

    onDestroy(){
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        if ( this.logic ){
            Manager.logicManager.destory(this.logic.bundle);
        }
        Manager.entryManager.onDestroyGameView(this.bundle,this);
        super.onDestroy();
    }

    update(dt:number){
        if ( this.logic ){
            this.logic.update(dt);
        }
    }

    /**@description 游戏重置 */
    protected reset(){
        if ( this.logic ){
            this.logic.reset(this);
        }
    }
}
