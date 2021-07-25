import { Config } from "../config/Config";
import { Reconnect } from "../net/Reconnect";
/**
 * @description 主控制器 
 */

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("manager/MainController")
export default class MainController extends cc.Component {
    
    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    @property(cc.Asset)
    wssCacert : cc.Asset = null;

    onLoad () {

        if( this.wssCacert ){
            Manager.wssCacertUrl = this.wssCacert.nativeUrl;
        }

        Manager.resolutionHelper.onLoad(this.node);

        //全局网络管理器onLoad
        Manager.netManager.onLoad(this.node);
        //大厅
        Manager.hallNetManager.onLoad(this.node);

        //预先加载下loading预置体
        Manager.tips.preloadPrefab();
        Manager.uiLoading.preloadPrefab();
        Manager.loading.preloadPrefab();
        Manager.alert.preloadPrefab();
        Reconnect.preloadPrefab();
        

        //调试按钮事件注册
        let showUI = cc.find("showUI",this.node);
        let showNode = cc.find("showNode",this.node);
        let showRes = cc.find("showRes",this.node);
        let showComp = cc.find("showComponent",this.node);
        if ( showUI && showNode && showRes && showComp){
            showUI.zIndex = 9999;
            showNode.zIndex = 9999;
            showRes.zIndex = 9999;
            showComp.zIndex = 9999;
            let isShow = false;
            if ( Config.isShowDebugButton ){
                isShow = true;
                showUI.on(cc.Node.EventType.TOUCH_END,()=>{
                    Manager.uiManager.printViews();
                });
                showNode.on(cc.Node.EventType.TOUCH_END,()=>{
                    Manager.uiManager.printCanvasChildren();
                });
                showRes.on(cc.Node.EventType.TOUCH_END,()=>{
                    Manager.cacheManager.printCaches();
                });
                showComp.on(cc.Node.EventType.TOUCH_END,()=>{
                    Manager.uiManager.printComponent();
                });
            }
            showUI.active = isShow;
            showNode.active = isShow;
            showRes.active = isShow;
            showComp.active = isShow;
        }

        //游戏事件注册
        cc.game.on(cc.game.EVENT_HIDE,this.onEnterBackground,this);
        cc.game.on(cc.game.EVENT_SHOW,this.onEnterForgeground,this);

        //Service onLoad
        Manager.serviceManager.onLoad();

        //逻辑管理器
        Manager.logicManager.onLoad(this.node);
    }

    update(){

        //Service 网络调试
        Manager.serviceManager.update();

        //远程资源下载任务调度
        Manager.assetManager.remote.update();
    }

    onDestroy(){
        
        Manager.resolutionHelper.onDestroy();

        //网络管理器onDestroy
        Manager.netManager.onDestroy(this.node);
        Manager.hallNetManager.onDestroy(this.node);
        //移除键盘事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);

        //移除游戏事件注册
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);

        Manager.serviceManager.onDestroy();

        //逻辑管理器
        Manager.logicManager.onDestroy(this.node);
    }

    private onEnterBackground(){
        this._enterBackgroundTime = Date.timeNow();
        cc.log(`[MainController]`,`onEnterBackground ${this._enterBackgroundTime}`);
        Manager.globalAudio.onEnterBackground();
        Manager.serviceManager.onEnterBackground();
    }

    private onEnterForgeground(){
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        cc.log(`[MainController]`,`onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        Manager.globalAudio.onEnterForgeground(inBackgroundTime);
        Manager.serviceManager.onEnterForgeground(inBackgroundTime);
    }
}
