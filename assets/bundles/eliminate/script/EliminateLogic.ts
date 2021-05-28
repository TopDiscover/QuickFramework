import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../script/common/event/LogicEvent";
import { Manager } from "../../../script/common/manager/Manager";
import { ResourceLoaderError } from "../../../script/framework/assetManager/ResourceLoader";
import { ResourceData } from "../../../script/framework/base/Defines";
import { EliminateData } from "./data/EliminateData";
import { CELL_PREFAB_URL } from "./data/EliminateDefines";
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

    private onEnterGame(data) {
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
        cc.log(`${this.bundle} 资源加载完成`);
        Manager.loading.hide();
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: EliminateGameView, bundle: this.bundle });
    }

    protected getLoadResources(): ResourceData[] {

        let res: ResourceData[] = [];
        for (let i = 0; i < CELL_PREFAB_URL.length; i++) {
            if (CELL_PREFAB_URL[i]) {
                res.push({ url: CELL_PREFAB_URL[i], type: cc.Prefab, bundle: this.bundle })
            }

        }

        return res;
    }
}

Manager.logicManager.push(EliminateLogic);