import ViewController from "../../framework/controller/ViewController";
import { dataBase } from "../../framework/database/DataBase";
import { remoteLoader } from "../../framework/loader/RemoteLoader";
import { resolutionHelper } from "../../framework/adaptor/ResolutionHelper";
import { logicManager } from "./LogicManager";
import { uiManager } from "../../framework/base/UIManager";
import { loader } from "../../framework/loader/Loader";
import GlobalAudio from "../component/GlobalAudio";

/**
 * @description 主控制器 
 */

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends ViewController {
    
    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    onLoad () {

        resolutionHelper().onLoad(this.node);
        
        //本地缓存数据库打开
        dataBase().open();

        //先添加全局的网络action组件

        //预先加载下loading预置体
        

        //键盘事件注册

        //游戏事件注册
        cc.game.on(cc.game.EVENT_HIDE,this.onEnterBackground,this);
        cc.game.on(cc.game.EVENT_SHOW,this.onEnterForgeground,this);

        cc.director.on(cc.Director.EVENT_AFTER_DRAW,this._onDirectorAfterDraw,this);

        //逻辑管理器
        logicManager().onLoad(this.node);
    }

    /**@description 游戏完成一次渲染过程之后 */
    private _onDirectorAfterDraw( ){
        let cando = uiManager().onDirectorAfterDraw();
        loader().onDirectorAfterDraw(cando);
    }

    update(){
        //主逻辑

        //远程资源下载任务调度
        remoteLoader().update();
    }

    onDestroy(){
        
        resolutionHelper().onDestroy();

        //移除网络组件 
        //移除键盘事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);

        //移除游戏事件注册
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);

        //逻辑管理器
        logicManager().onDestroy(this.node);
    }

    private onEnterBackground(){
        this._enterBackgroundTime = Date.timeNow();
        cc.log(`[MainController]`,`onEnterBackground ${this._enterBackgroundTime}`);
        uiManager().getCanvas().getComponent(GlobalAudio).onEnterBackground();
    }

    private onEnterForgeground(){
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        cc.log(`[MainController]`,`onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        uiManager().getCanvas().getComponent(GlobalAudio).onEnterForgeground(inBackgroundTime);
    }
}
