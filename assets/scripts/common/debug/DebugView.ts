
import { LogLevel } from '../../framework/defines/Enums';
const { ccclass, property } = cc._decorator;

@ccclass('DebugView')
export class DebugView extends cc.Component {

    private logView: cc.Node = null!;
    onLoad() {
        let showUI = cc.find("content/showUI", this.node);
        let showNode = cc.find("content/showNode", this.node);
        let showRes = cc.find("content/showRes", this.node);
        let showComp = cc.find("content/showComponent", this.node);
        let background = cc.find("background", this.node);
        if (background) {
            background.on(cc.Node.EventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug) this.debug.active = true;
            });
        }
        if (showUI && showNode && showRes && showComp) {
            showUI.on(cc.Node.EventType.TOUCH_END, () => {
                Manager.uiManager.printViews();
            });
            showNode.on(cc.Node.EventType.TOUCH_END, () => {
                Manager.uiManager.printViewRootChildren();
            });
            showRes.on(cc.Node.EventType.TOUCH_END, () => {
                Manager.cacheManager.printCaches();
            });
            showComp.on(cc.Node.EventType.TOUCH_END, () => {
                Manager.uiManager.printComponent();
            });
        }
        let showDebugInfo = cc.find("content/showDebugInfo", this.node);
        if (showDebugInfo) {
            showDebugInfo.on(cc.Node.EventType.TOUCH_END, () => {
                cc.debug.setDisplayStats(!cc.debug.isDisplayStats())
            });
        }
        let logLevel = cc.find("content/log", this.node);
        let logView = cc.find("logView", this.node);
        if (logLevel && logView) {
            logView.active = false;
            this.logView = logView;
            this.initLogView();
            logLevel.on(cc.Node.EventType.TOUCH_END, () => {
                this.logView.active = true;
            });
        }
    }
    debug: cc.Node = null!;

    private initLogView() {
        let background = cc.find("background", this.logView);
        if (background) {
            background.on(cc.Node.EventType.TOUCH_END, () => {
                this.logView.active = false;
            });
        }

        //连接网络 
        let level = cc.find("level", this.logView);
        if (level) {
            for (let i = 0; i < level.children.length - 1; i++) {
                let node = cc.find(`type${i}`, level);
                if (node) {
                    let toggle = node.getComponent(cc.Toggle);
                    if (toggle) {
                        toggle.isChecked = Manager.logger.isValid(this.getLogLevel(i));
                    }
                    node.on("toggle", (toggle: cc.Toggle) => {
                        if ( toggle.isChecked ){
                            Manager.logger.attach(this.getLogLevel(i));
                        }else{
                            Manager.logger.detach(this.getLogLevel(i));
                        }
                    });
                }
            }
        }

        let test = cc.find("test", this.logView);
        if (test) {
            for (let i = 0; i < test.children.length - 1; i++) {
                let node = cc.find(`type${i}`, test);
                if (node) {
                    node.on("toggle", (toggle: cc.Toggle) => {
                        if ( i == 0 ){
                            Log.d("sssss");
                        }else if( i == 1 ){
                            Log.w("sssssssssfffffff");
                        }else if( i == 2 ){
                            Log.e("eeeeeeee");
                        } else {
                            Log.dump({a :100,b:300,c : { b :300,d : 400}},"test");
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
            default : return LogLevel.DEBUG;
        }
    }
}

