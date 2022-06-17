
import { _decorator, Component, Node, find, setDisplayStats, isDisplayStats, Toggle, js, isValid, sys, SystemEvent, view, UITransform, Widget } from 'cc';
import { DEBUG } from 'cc/env';
import { LogLevel } from '../../framework/defines/Enums';
import { Singleton } from '../../framework/utils/Singleton';
import { Config } from '../config/Config';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends Component {

    private logView: Node = null!;
    private content: Node = null!;
    onLoad() {

        this.content = find("content", this.node) as Node;
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
        //网络辅助类
        this.bindEvent("netHelper", this.onNetHelper);
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
        let logView = find("logView", this.node);
        if (logView) {
            logView.active = false;
            this.logView = logView;
            this.initLogView();
        }

        let background = find("background", this.node);
        if (background) {
            background.on(SystemEvent.EventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug) this.debug.active = true;
            });
        }
    }

    private bindEvent(path: string, cb: Function) {
        let node = find(path, this.content);
        if (node) {
            node.on(SystemEvent.EventType.TOUCH_END, cb, this);
        }
    }

    private initLogView() {
        let background = find("background", this.logView);
        if (background) {
            background.on(SystemEvent.EventType.TOUCH_END, () => {
                this.logView.active = false;
            });
        }

        let level = find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(Toggle);
                    if (toggle) {
                        toggle.isChecked = Manager.logger.isValid(this.getLogLevel(i));
                    }
                    node.on("toggle", (toggle: Toggle) => {
                        if (toggle.isChecked) {
                            Manager.logger.attach(this.getLogLevel(i));
                        } else {
                            Manager.logger.detach(this.getLogLevel(i));
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
        Manager.logicManager.debug();
    }

    private onDataCenter() {
        Manager.dataCenter.debug();
    }

    private onEntry() {
        Manager.entryManager.debug();
    }

    private onProto() {
        Manager.protoManager.debug()
    }

    private onBundleMgr() {
        Manager.bundleManager.debug();
    }

    private onPool() {
        Manager.pool.debug();
    }

    private onLog() {
        this.logView.active = true;
    }

    private onShowDebugInfo() {
        setDisplayStats(!isDisplayStats())
        Manager.storage.setItem(Config.SHOW_DEBUG_INFO_KEY, isDisplayStats());
    }

    private onShowUI() {
        Manager.uiManager.debug({showViews:true});
    }

    private onShowNode() {
        Manager.uiManager.debug({showChildren:true});
    }

    private onShowRes() {
        Manager.cache.debug();
    }

    private onShowComp() {
        Manager.uiManager.debug({showComp:true});
    }

    private onNetHelper() {
        Manager.netHelper.debug();
    }

    private onServiceManager() {
        Manager.serviceManager.debug();
    }

    private onHotUpdate() {
        Manager.updateManager.debug()
    }

    private onLowMemory() {
        Manager.onLowMemory();
    }

    private onReleaseManager() {
        Manager.releaseManger.debug()
    }

    private onAdaptor() {
        Log.d(`-----------------------------适配信息-----------------------------------------------`);
        Log.d(`屏幕分辨率: ${view.getCanvasSize().width} x ${view.getCanvasSize().height}`);
        Log.d(`视图窗口可见区域分辨率: ${view.getVisibleSize().width} x ${view.getVisibleSize().height}`);
        Log.d(`视图中边框尺寸: ${view.getFrameSize().width} x ${view.getFrameSize().height}`);
        Log.d(`设备或浏览器像素比例: ${view.getDevicePixelRatio()}`);
        Log.d(`返回视图窗口可见区域像素尺寸: ${view.getVisibleSizeInPixel().width} x ${view.getVisibleSizeInPixel().height}`);
        Log.d(`当前场景设计分辨率: ${view.getDesignResolutionSize().width} x ${view.getDesignResolutionSize().height}`);
        let viewRate = view.getFrameSize().width/view.getFrameSize().height;
        let designRate = view.getDesignResolutionSize().width/view.getDesignResolutionSize().height;
        Log.d(`视图宽高比:${viewRate}`);
        Log.d(`设置分辨率宽高比:${designRate}`);
    }

    private onSingleton() {
        Singleton.instance.debug();
    }
}

