import { Entry } from "../../../scripts/framework/core/entry/Entry";
import AimLineView from "./view/AimLineView";

class AimLineEntry extends Entry {
    static bundle = "aimLine";
    protected addNetHandler(): void {
    }
    protected removeNetHandler(): void {
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open(AimLineView,{bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(AimLineView);
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(AimLineEntry);