import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import GameOneView from "./view/GameOneView";

class GameOneLogic extends IEntry {
    static bundle = "gameOne"
    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: GameOneView, bundle: this.bundle });
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}
/**@description 将自己的Bundle逻辑入口交给逻辑管理器 */
Manager.entryManager.register(GameOneLogic);