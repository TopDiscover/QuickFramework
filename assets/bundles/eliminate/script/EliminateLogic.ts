import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import { EliminateData } from "./data/EliminateData";
import { CELL_PREFAB_URL, EFFECTS_CONFIG } from "./data/EliminateDefines";
import EliminateGameView from "./view/EliminateGameView";

class EliminateLogic extends IEntry {
    static bundle = EliminateData.bundle;
    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        Manager.loading.show(Manager.getLanguage("loading_game_resources"));
        this.loader.getLoadResources = () => {
            let res: Resource.Data[] = [];
            for (let i = 0; i < CELL_PREFAB_URL.length; i++) {
                if (CELL_PREFAB_URL[i]) {
                    res.push({ url: CELL_PREFAB_URL[i], type: cc.Prefab, bundle: this.bundle })
                }
            }

            res.push({ url: EFFECTS_CONFIG.crush.url, type: cc.Prefab, bundle: this.bundle });
            res.push({ url: EFFECTS_CONFIG.colBomb.url, type: cc.Prefab, bundle: this.bundle });
            return res;
        };
        this.loader.onLoadProgress = (err: Resource.LoaderError) => {
            if (err == Resource.LoaderError.LOADING) {
                return;
            }
            Manager.loading.hide();
            completeCb();
        };
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: EliminateGameView, bundle: this.bundle });
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(EliminateLogic);