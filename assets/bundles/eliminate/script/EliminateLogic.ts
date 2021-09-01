import { Prefab } from "cc";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import { EliminateData } from "./data/EliminateData";
import { CELL_PREFAB_URL, EFFECTS_CONFIG } from "./data/EliminateDefines";
import EliminateGameView from "./view/EliminateGameView";

class EliminateLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return EliminateData.bundle;
    }

    public onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == this.logicType) {

        } else {
            this._loader.unLoadResources();
        }
    }

    private onEnterGame(data:string) {
        if (data == this.bundle) {
            Manager.loading.show(Manager.getLanguage("loading_game_resources")as string);
            this._loader.loadResources();
        } else {
            this._loader.unLoadResources();
        }
    }

    protected onLoadResourceComplete(err: Resource.LoaderError) {
        if (err == Resource.LoaderError.LOADING) {
            return;
        }
        log(`${this.bundle} 资源加载完成`);
        Manager.loading.hide();
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: EliminateGameView, bundle: this.bundle });
    }

    protected getLoadResources(): Resource.Data[] {

        let res: Resource.Data[] = [];
        for (let i = 0; i < CELL_PREFAB_URL.length; i++) {
            let prefabUrl = CELL_PREFAB_URL[i];
            if (prefabUrl) {
                res.push({ url: prefabUrl, type: Prefab, bundle: this.bundle })
            }
        }

        res.push({url:EFFECTS_CONFIG.crush.url,type:Prefab,bundle:this.bundle});
        res.push({url:EFFECTS_CONFIG.colBomb.url,type:Prefab,bundle:this.bundle});
        return res;
    }
}

Manager.logicManager.push(EliminateLogic);