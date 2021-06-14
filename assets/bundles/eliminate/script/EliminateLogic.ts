import { Prefab } from "cc";
import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../scripts/common/event/LogicEvent";
import { Manager } from "../../../scripts/common/manager/Manager";
import { ResourceLoaderError } from "../../../scripts/framework/assetManager/ResourceLoader";
import { ResourceData } from "../../../scripts/framework/base/Defines";
import { EliminateData } from "./data/EliminateData";
import { CELL_PREFAB_URL, EFFECTS_CONFIG } from "./data/EliminateDefines";
import EliminateGameView from "./view/EliminateGameView";

class EliminateLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return EliminateData.bundle;
    }

    public onEnterComplete(data: LogicEventData) {
        super.onEnterComplete(data);
        if (data.type == this.logicType) {

        } else {
            this._loader.unLoadResources();
        }
    }

    private onEnterGame(data:string) {
        if (data == this.bundle) {
            Manager.loading.show(Manager.getLanguage("loading_game_resources"));
            this._loader.loadResources();
        } else {
            this._loader.unLoadResources();
        }
    }

    protected onLoadResourceComplete(err: ResourceLoaderError) {
        if (err == ResourceLoaderError.LOADING) {
            return;
        }
        log(`${this.bundle} 资源加载完成`);
        Manager.loading.hide();
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: EliminateGameView, bundle: this.bundle });
    }

    protected getLoadResources(): ResourceData[] {

        let res: ResourceData[] = [];
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