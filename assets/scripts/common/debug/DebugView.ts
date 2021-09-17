
import { _decorator, Component, Node, find, SystemEventType, setDisplayStats, isDisplayStats } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugView')
export class DebugView extends Component {

    private status : boolean = false;
    onLoad() {
        this.status = isDisplayStats();
        let showUI = find("content/showUI", this.node);
        let showNode = find("content/showNode", this.node);
        let showRes = find("content/showRes", this.node);
        let showComp = find("content/showComponent", this.node);
        let background = find("background", this.node);
        if (background) {
            background.on(SystemEventType.TOUCH_END, () => {
                this.node.active = false;
                if ( this.debug ) this.debug.active = true;
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
        let showDebugInfo = find("content/showDebugInfo",this.node);
        if ( showDebugInfo ){
            showDebugInfo.on(SystemEventType.TOUCH_END,()=>{
                this.status = !this.status;
                setDisplayStats(this.status)
            });
        }
    }
    debug : Node = null!;
}

