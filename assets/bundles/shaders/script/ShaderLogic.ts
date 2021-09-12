import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import ShaderView from "./view/ShaderView";

class ShaderLogic extends IEntry {

    static bundle = "shaders";

    protected addNetComponent(): void {
        
    }
    protected removeNetComponent(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: ShaderView, bundle: this.bundle });
    }
    protected initData(): void {
        
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }
}

Manager.entryManager.register(ShaderLogic);