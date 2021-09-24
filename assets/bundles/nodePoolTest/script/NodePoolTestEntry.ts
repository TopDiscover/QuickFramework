import { Entry } from "../../../scripts/framework/core/entry/Entry";
import NodePoolView from "./view/NodePoolView";

class NodePoolTestEntry extends Entry {
    static bundle = "nodePoolTest";
    protected addNetHandler(): void {
        
    }
    protected removeNetHandler(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open(NodePoolView,{ bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(NodePoolView);
    }
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }
}

Manager.entryManager.register(NodePoolTestEntry);