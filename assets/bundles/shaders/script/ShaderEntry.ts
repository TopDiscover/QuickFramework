import { Entry } from "../../../scripts/framework/core/entry/Entry";
import ShaderView from "./view/ShaderView";

class ShaderEntry extends Entry {

    static bundle = "shaders";

    protected addNetHandler(): void {
    }
    protected removeNetHandler(): void {
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open(ShaderView,{ bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(ShaderView);
    }
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }
}

Manager.entryManager.register(ShaderEntry);