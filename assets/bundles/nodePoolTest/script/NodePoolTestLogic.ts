import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import NodePoolView from "./view/NodePoolView";

class NodePoolTestLogic extends IEntry {
    static bundle = "nodePoolTest";
    protected addNetComponent(): void {
        
    }
    protected removeNetComponent(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: NodePoolView, bundle: this.bundle });
    }
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }
}

Manager.entryManager.register(NodePoolTestLogic);