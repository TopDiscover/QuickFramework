import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { setClassName } from "../../../scripts/framework/decorator/Decorators";
import NodePoolView from "./view/NodePoolView";

@setClassName()
class NodePoolTestEntry extends Entry {
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