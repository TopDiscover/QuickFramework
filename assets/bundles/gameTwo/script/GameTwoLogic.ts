import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import GameTwoView from "./GameTwoView";

class GameTwoLogic extends IEntry {
    static bundle = "gameTwo";
    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: GameTwoView, bundle: this.bundle });
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(GameTwoLogic);