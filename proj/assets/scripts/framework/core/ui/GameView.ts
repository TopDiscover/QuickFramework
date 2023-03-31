/**@description 游戏层公共基类 */
import UIView from "./UIView";

/**
 * @description 游戏视图基类,处理了前后台切换对网络进行后台最大允许时间做统一处理,
 * 游戏层设置为ViewZOrder.zero
 */

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Quick公共组件/GameView")
export default class GameView extends UIView {

    static logicType : ModuleClass<Logic> | null = null;
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

    show(args ?: any[] | any){
        super.show(args);
        App.entryManager.onShowGameView(this.bundle,this);
    }

    protected onEnterGameView(){
        App.entryManager.onEnterGameView(this.bundle,this);
    }

    /**
     * @description 进入指定Bundle
     * @param bundle Bundle名
     * @param userData 用户自定义数据
     */
    enterBundle( bundle : BUNDLE_TYPE , userData ?: any){
        App.entryManager.enterBundle(bundle , userData);
    }

    /**
     * @description 返回上一场景
     * @param userData 用户自定义数据
     */
    backBundle(userData?:any){
        App.entryManager.backBundle(userData);
    }

    onDestroy(){
        if ( this.audioHelper ){
            //停止背景音乐
            //this.audioHelper.stopMusic();
            this.audioHelper.stopAllEffects();
        }
        if ( this.logic ){
            App.logicManager.destory(this.logic.bundle);
        }
        App.entryManager.onDestroyGameView(this.bundle,this);
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
