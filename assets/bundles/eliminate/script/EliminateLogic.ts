import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { EliminateData } from "./data/EliminateData";
import { CELL_PREFAB_URL, EFFECTS_CONFIG } from "./data/EliminateDefines";
import EliminateGameView from "./view/EliminateGameView";

class EliminateLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(td.Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return EliminateData.bundle;
    }

    public onEnterComplete(data: td.Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == this.logicType) {

        } else {
            this._loader.unLoadResources();
        }
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.loading.show(Manager.getLanguage("loading_game_resources"));
            this._loader.loadResources();
        } else {
            this._loader.unLoadResources();
        }
    }

    protected onLoadResourceComplete(err: td.Resource.LoaderError) {
        if (err == td.Resource.LoaderError.LOADING) {
            return;
        }
        cc.log(`${this.bundle} 资源加载完成`);
        Manager.loading.hide();
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: EliminateGameView, bundle: this.bundle });
    }

    protected getLoadResources(): td.Resource.Data[] {

        let res: td.Resource.Data[] = [];
        for (let i = 0; i < CELL_PREFAB_URL.length; i++) {
            if (CELL_PREFAB_URL[i]) {
                res.push({ url: CELL_PREFAB_URL[i], type: cc.Prefab, bundle: this.bundle })
            }
        }

        res.push({ url: EFFECTS_CONFIG.crush.url, type: cc.Prefab, bundle: this.bundle });
        res.push({ url: EFFECTS_CONFIG.colBomb.url, type: cc.Prefab, bundle: this.bundle });
        return res;
    }
}

Manager.logicManager.push(EliminateLogic);