
import { _decorator, Component, Node, find, SystemEventType, setDisplayStats, isDisplayStats, Toggle } from 'cc';
import { LogLevel } from '../../framework/defines/Enums';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends Component {

    private logView: Node = null!;
    onLoad() {
        let showUI = find("content/showUI", this.node);
        let showNode = find("content/showNode", this.node);
        let showRes = find("content/showRes", this.node);
        let showComp = find("content/showComponent", this.node);
        let background = find("background", this.node);
        if (background) {
            background.on(SystemEventType.TOUCH_END, () => {
                this.node.active = false;
                if (this.debug) this.debug.active = true;
            });
        }
        if (showUI && showNode && showRes && showComp) {
            showUI.on(SystemEventType.TOUCH_END, () => {
                Manager.uiManager.printViews();
            });
            showNode.on(SystemEventType.TOUCH_END, () => {
                Manager.uiManager.printViewRootChildren();
            });
            showRes.on(SystemEventType.TOUCH_END, () => {
                Manager.cacheManager.printCaches();
            });
            showComp.on(SystemEventType.TOUCH_END, () => {
                Manager.uiManager.printComponent();
            });
        }
        let showDebugInfo = find("content/showDebugInfo", this.node);
        if (showDebugInfo) {
            showDebugInfo.on(SystemEventType.TOUCH_END, () => {
                setDisplayStats(!isDisplayStats())
            });
        }
        let logLevel = find("content/log", this.node);
        let logView = find("logView", this.node);
        if (logLevel && logView) {
            logView.active = false;
            this.logView = logView;
            this.initLogView();
            logLevel.on(SystemEventType.TOUCH_END, () => {
                this.logView.active = true;
            });
        }
    }
    debug: Node = null!;

    private initLogView() {
        let background = find("background", this.logView);
        if (background) {
            background.on(SystemEventType.TOUCH_END, () => {
                this.logView.active = false;
            });
        }

        //连接网络 
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
                        if ( toggle.isChecked ){
                            Manager.logger.attach(this.getLogLevel(i));
                        }else{
                            Manager.logger.detach(this.getLogLevel(i));
                        }
                    });
                }
            }
        }

        let test = find("test", this.logView);
        if (test) {
            for (let i = 0; i < test.children.length - 1; i++) {
                let node = find(`type${i}`, test);
                if (node) {
                    node.on("toggle", (toggle: Toggle) => {
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

