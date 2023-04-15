
import { _decorator, Component, Node, find, Toggle, view, Input, profiler ,screen, input } from 'cc';
import EventComponent from '../../framework/componects/EventComponent';
import { inject } from '../../framework/defines/Decorators';
import { LogLevel } from '../../framework/defines/Enums';
import { Singleton } from '../../framework/utils/Singleton';
import { Config } from '../config/Config';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends EventComponent {

    @inject("logView",Node)
    private logView: Node = null!;
    @inject("content",Node)
    private content: Node = null!;
    @inject("background",Node)
    private background : Node = null!;
    @inject("background",Node,"logView")
    private logViewBackground : Node = null!;
    onLoad() {
        //显示界面信息
        this.bindEvent("showUI", this.onShowUI);
        //显示节点信息
        this.bindEvent("showNode", this.onShowNode);
        //显示资源缓存信息
        this.bindEvent("showRes", this.onShowRes);
        //显示当前组件信息
        this.bindEvent("showComponent", this.onShowComp);
        //显示调试信息
        this.bindEvent("showDebugInfo", this.onShowDebugInfo);
        this.bindEvent("log", this.onLog);
        //逻辑管理器信息输出
        this.bindEvent("logic", this.onLogicManager);
        //数据中心
        this.bindEvent("dataCenter", this.onDataCenter);
        //bundle入口管理器
        this.bindEvent("entry", this.onEntry);
        //proto 信息输出 
        this.bindEvent("proto", this.onProto);
        //bundle管理器
        this.bindEvent("bundleMgr", this.onBundleMgr);
        //节点缓存池
        this.bindEvent("pool", this.onPool);
        //Senders
        this.bindEvent("sender", this.onSender);
        this.bindEvent("handler", this.onHandler);
        //网络管理器
        this.bindEvent("serviceManager", this.onServiceManager);
        //热火更新管理
        this.bindEvent("hotupdate", this.onHotUpdate);
        //内存警告
        this.bindEvent("lowMemory", this.onLowMemory);
        //释放管理器
        this.bindEvent("releaseManager", this.onReleaseManager);
        //适配器
        this.bindEvent("adaptor", this.onAdaptor);
        //当前所有单例
        this.bindEvent("singleton", this.onSingleton);
        this.doOther();
    }
    debug: Node = null!;

    private doOther() {
        if (this.logView) {
            this.logView.active = false;
            this.initLogView();
        }
        this.onN(this.background,Input.EventType.TOUCH_END, () => {
            this.node.active = false;
            if (this.debug) this.debug.active = true;
        });
    }

    private bindEvent(path: string, cb: ()=>void) {
        let node = find(path, this.content);
        this.onN(node!,Input.EventType.TOUCH_END,cb);
    }

    private initLogView() {
        this.onN(this.logViewBackground,Input.EventType.TOUCH_END, () => {
            this.logView.active = false;
        });

        let level = find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(Toggle);
                    if (toggle) {
                        toggle.isChecked = App.logger.isValid(this.getLogLevel(i));
                    }
                    this.onN(node,"toggle", (toggle: Toggle) => {
                        if (toggle.isChecked) {
                            App.logger.attach(this.getLogLevel(i));
                        } else {
                            App.logger.detach(this.getLogLevel(i));
                        }
                    });
                }
            }
        }
    }

    private getLogLevel(index: number) {
        switch (index) {
            case 0: return LogLevel.DEBUG;
            case 1: return LogLevel.WARN;
            case 2: return LogLevel.ERROR;
            case 3: return LogLevel.DUMP;
            default: return LogLevel.DEBUG;
        }
    }

    private onLogicManager() {
        App.logicManager.debug();
    }

    private onDataCenter() {
        App.dataCenter.debug();
    }

    private onEntry() {
        App.entryManager.debug();
    }

    private onProto() {
        App.protoManager.debug()
    }

    private onBundleMgr() {
        App.bundleManager.debug();
    }

    private onPool() {
        App.pool.debug();
    }

    private onLog() {
        this.logView.active = true;
    }

    private onShowDebugInfo() {
        if (profiler.isShowingStats() ){
            profiler.hideStats();
        }else{
            profiler.showStats();
        }
        App.storage.setItem(Config.SHOW_DEBUG_INFO_KEY, profiler.isShowingStats());
    }

    private onShowUI() {
        App.uiManager.debug({showViews:true});
    }

    private onShowNode() {
        App.uiManager.debug({showChildren:true});
    }

    private onShowRes() {
        App.cache.debug();
    }

    private onShowComp() {
        App.uiManager.debug({showComp:true});
    }

    private onSender() {
        App.senderManager.debug();
    }

    private onHandler(){
        App.handlerManager.debug();
    }

    private onServiceManager() {
        App.serviceManager.debug();
    }

    private onHotUpdate() {
        App.updateManager.debug()
    }

    private onLowMemory() {
        App.onLowMemory();
    }

    private onReleaseManager() {
        App.releaseManger.debug()
    }

    private onAdaptor() {
        Log.d(`-----------------------------适配信息-----------------------------------------------`);
        Log.d(`屏幕分辨率: ${screen.windowSize.width} x ${screen.windowSize.height}`);
        Log.d(`视图窗口可见区域分辨率: ${view.getVisibleSize().width} x ${view.getVisibleSize().height}`);
        Log.d(`视图中边框尺寸: ${screen.windowSize.width} x ${screen.windowSize.height}`);
        Log.d(`设备或浏览器像素比例: ${screen.devicePixelRatio}`);
        Log.d(`返回视图窗口可见区域像素尺寸: ${view.getVisibleSizeInPixel().width} x ${view.getVisibleSizeInPixel().height}`);
        Log.d(`当前场景设计分辨率: ${view.getDesignResolutionSize().width} x ${view.getDesignResolutionSize().height}`);
        let viewRate = screen.windowSize.width/screen.windowSize.height;
        let designRate = view.getDesignResolutionSize().width/view.getDesignResolutionSize().height;
        Log.d(`视图宽高比:${viewRate}`);
        Log.d(`设置分辨率宽高比:${designRate}`);
    }

    private onSingleton() {
        Singleton.instance.debug();
    }
}

