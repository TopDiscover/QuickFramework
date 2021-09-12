import { Entry } from "../../../scripts/framework/core/entry/Entry";
import NetTestView from "./view/NetTestView";

class NetTestEntry extends Entry {
    static bundle = "netTest";
    protected addNetComponent(): void {
        
    }
    protected removeNetComponent(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: NetTestView, bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(NetTestView);
    }
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

}

Manager.entryManager.register(NetTestEntry);