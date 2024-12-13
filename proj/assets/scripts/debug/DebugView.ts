
import EventComponent from '../../quick/components/EventComponent';
import { inject } from '../../quick/defines/Decorators';
import { LogLevel } from '../../quick/defines/Enums';
import { Singleton } from '../../quick/utils/Singleton';
import { Macro } from '../../quick/defines/Macros';
import UIView from '../../quick/core/ui/UIView';
const { ccclass, property } = cc._decorator;

interface Data {
    text: string;
    onEvent: () => void;
}

@ccclass
export class DebugView extends UIView {

    static getPrefabUrl(): string {
        return "common/prefabs/DebugView";
    }

    @inject("logView", cc.Node)
    private logView: cc.Node = null!;
    @inject("content", cc.Node)
    private content: cc.Node = null!;
    @inject("item", cc.Node,"content")
    private itemPrefab: cc.Node = null!;
    @inject("background", cc.Node)
    private background: cc.Node = null!;
    @inject("background", cc.Node, "logView")
    private logViewBackground: cc.Node = null!;

    get config() {
        let config: Data[] = [
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
                text: "Sandlers",
                onEvent: this.onSender,
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
        config.forEach(v=>{
            const node = cc.instantiate(this.itemPrefab);
            node.name = v.text;
            cc.find("Label",node).getComponent(cc.Label).string = v.text;
            this.onN(node,cc.Node.EventType.TOUCH_END,v.onEvent);
            this.content.addChild(node);
        })
    }

    onLoad() {
        super.onLoad();
        this.itemPrefab.removeFromParent();
        this.initData();
        this.doOther();
    }

    private doOther() {
        if (this.logView) {
            this.logView.active = false;
            this.initLogView();
        }
        this.onN(this.background, cc.Node.EventType.TOUCH_END, () => {
            if (this.args.onClose) this.args.onClose();
            this.close();
        });
    }

    private bindEvent(path: string, cb: () => void) {
        let node = cc.find(path, this.content);
        this.onN(node, cc.Node.EventType.TOUCH_END, cb, this);
    }

    private initLogView() {
        this.onN(this.logViewBackground, cc.Node.EventType.TOUCH_END, () => {
            this.logView.active = false;
        });

        let level = cc.find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = cc.find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(cc.Toggle);
                    if (toggle) {
                        toggle.isChecked = App.logger.isValid(this.getLogLevel(i));
                    }
                    this.onN(node, "toggle", (toggle: cc.Toggle) => {
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
        cc.debug.setDisplayStats(!cc.debug.isDisplayStats())
        App.storage.setItem(Macro.SHOW_DEBUG_INFO_KEY, cc.debug.isDisplayStats());
    }

    private onShowUI() {
        App.uiManager.debug({ showViews: true });
    }

    private onShowNode() {
        App.uiManager.debug({ showChildren: true });
    }

    private onShowRes() {
        App.cache.debug();
    }

    private onShowComp() {
        App.uiManager.debug({ showComp: true });
    }

    private onSender() {
        App.senderManager.debug();
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
        Log.d(`屏幕分辨率: ${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`);
        Log.d(`视图窗口可见区域分辨率: ${cc.view.getVisibleSize().width} x ${cc.view.getVisibleSize().height}`);
        Log.d(`视图中边框尺寸: ${cc.view.getFrameSize().width} x ${cc.view.getFrameSize().height}`);
        Log.d(`设备或浏览器像素比例: ${cc.view.getDevicePixelRatio()}`);
        Log.d(`返回视图窗口可见区域像素尺寸: ${cc.view.getVisibleSizeInPixel().width} x ${cc.view.getVisibleSizeInPixel().height}`);
        Log.d(`当前场景设计分辨率: ${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`);
        let viewRate = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        let designRate = cc.view.getDesignResolutionSize().width / cc.view.getDesignResolutionSize().height;
        Log.d(`视图宽高比:${viewRate}`);
        Log.d(`设置分辨率宽高比:${designRate}`);
    }

    private onSingleton() {
        Singleton.debug();
    }
}

