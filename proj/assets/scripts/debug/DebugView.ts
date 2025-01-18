
import { _decorator, Node, find, Toggle, view, Input, profiler, screen, instantiate, Label, EventTouch } from 'cc';
import { DEBUG } from 'cc/env';
import UIView from 'db://quick/core/ui/UIView';
import { inject } from 'db://quick/defines/Decorators';
import { LogLevel } from 'db://quick/defines/Enums';
import { Macro } from 'db://quick/defines/Macros';
import { Singleton } from 'db://quick/utils/Singleton';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends UIView {

    static getPrefabUrl(): string {
        return "common/prefabs/DebugView";
    }

    @inject("logView", Node)
    private logView: Node = null!;
    @inject("content", Node)
    private content: Node = null!;
    @inject("item", Node,"content")
    private itemPrefab: Node = null!;
    @inject("background", Node)
    private background: Node = null!;
    @inject("background", Node, "logView")
    private logViewBackground: Node = null!;

    private get datas() {
        const data = App.dataCenter.get(App.stageData.where);
        if (data && data.debugConfig) {
            return data.debugConfig
        }
        return [];
    }

    get config() {
        let config: DebugConfig[] = [
            {
                text: "显示视图",
                onEvent: this.onShowUI,
            },
            {
                text: "显示节点",
                onEvent: this.onShowNode,
            },
            {
                text: "资源缓存",
                onEvent: this.onShowRes,
            },
            {
                text: "显示组件",
                onEvent: this.onShowComp,
            },
            {
                text: "调试信息",
                onEvent: this.onShowDebugInfo,
            },
            {
                text: "日志",
                onEvent: this.onLog,
            },
            {
                text: "逻辑管理器",
                onEvent: this.onLogicManager,
            },
            {
                text: "数据中心",
                onEvent: this.onDataCenter,
            },
            {
                text: "Bundle入口",
                onEvent: this.onEntry,
            },
            {
                text: "Proto信息",
                onEvent: this.onProto,
            },
            {
                text: "Bundle管理器",
                onEvent: this.onBundleMgr,
            },
            {
                text: "节点缓存池",
                onEvent: this.onPool,
            },
            {
                text: "Handlers",
                onEvent: this.onHandler,
            },
            {
                text: "网络管理器",
                onEvent: this.onServiceManager,
            },
            {
                text: "热更新",
                onEvent: this.onHotUpdate,
            },
            {
                text: "内存警告模拟",
                onEvent: this.onLowMemory,
            },
            {
                text: "释放管理器",
                onEvent: this.onReleaseManager,
            },
            {
                text: "适配器",
                onEvent: this.onAdaptor,
            },
            {
                text: "当前单例",
                onEvent: this.onSingleton,
            }
        ]

        return config;
    }

    private initData(){
        const config = this.config;
        this.content.removeAllChildren();
        config.forEach((v,i)=>{
            const node = instantiate(this.itemPrefab);
            node.name = `debug${i}`;
            find("Label",node)!.getComponent(Label)!.string = v.text;
            this.onN(node,Node.EventType.TOUCH_END,v.onEvent);
            this.content.addChild(node);
        })
    }

    onLoad() {
        super.onLoad();
        this.itemPrefab.removeFromParent();
        this.initData();
        this.doOther();
    }

    onShow(): void {
        super.onShow();
        // 删除除内置外的其它高度按钮
        for (let i = this.content.children.length - 1; i >= 0; i--) {
            const node = this.content.children[i];
            if (node.name.startsWith("extra_debug")) {
                node.removeFromParent();
            }
        }

        for (let i = 0; i < this.datas.length; i++) {
            let data = this.datas[i];
            let node = instantiate(this.itemPrefab);
            find("Label", node)!.getComponent(Label)!.string = data;
            node.name = `extra_debug${i}`
            node.userData = data;
            this.onN(node, Node.EventType.TOUCH_END, this.onExtraEvent);
            this.content.addChild(node);
        }
    }

    private doOther() {
        if (this.logView) {
            this.logView.active = false;
            this.initLogView();
        }
        this.onN(this.background, Input.EventType.TOUCH_END, () => {
            if ( this.args.onClose ) this.args.onClose();
            this.close();
        });
    }

    onClose() {
        const args : DebugViewArgs = this.args;
        if (args && args.onClose) {
            args.onClose();
        }
        super.onClose();
        
    }

    private initLogView() {
        this.onN(this.logViewBackground, Input.EventType.TOUCH_END, () => {
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
                    this.onN(node, "toggle", (toggle: Toggle) => {
                        if (toggle.isChecked) {
                            App.logger.attach(this.getLogLevel(i));
                        } else {
                            App.logger.detach(this.getLogLevel(i));
                        }
                        this.testLog();
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

    private testLog(){
        Log.d("测试 debug");
        Log.w("测试 warn");
        Log.e("测试 error");
        Log.dump({
            name : "测试dump",
            value : 666,
        },"dump")
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
        if (profiler.isShowingStats()) {
            profiler.hideStats();
        } else {
            profiler.showStats();
        }
        App.storage.setItem(Macro.SHOW_DEBUG_INFO_KEY, profiler.isShowingStats());
    }

    private onShowUI() {
        App.uiManager.debug();
    }

    private onShowNode() {
        App.layerMgr.debug({ showChildren: true });
    }

    private onShowRes() {
        App.cache.debug();
    }

    private onShowComp() {
        App.layerMgr.debug({ showComp: true });
    }

    private onHandler() {
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
        let viewRate = screen.windowSize.width / screen.windowSize.height;
        let designRate = view.getDesignResolutionSize().width / view.getDesignResolutionSize().height;
        Log.d(`视图宽高比:${viewRate}`);
        Log.d(`设置分辨率宽高比:${designRate}`);
    }

    private onSingleton() {
        Singleton.debug();
    }

    private onExtraEvent(event: EventTouch) {
        let data = event.target.userData;
        if (data) {
            DEBUG && Log.d(`派发调试事件:${data}`);
            dispatch(data);
        }
        this.close();
    }
}

