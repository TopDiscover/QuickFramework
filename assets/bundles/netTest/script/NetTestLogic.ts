import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import NetTestView from "./view/NetTestView";

class NetTestLogic extends IEntry {
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
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

}

Manager.entryManager.register(NetTestLogic);