import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import GameOneResPath from "./GameOneResPath";
import { GamePath } from "../../../script/common/base/ResPath";
import { uiManager } from "../../../script/framework/base/UIManager";
import GameOneView from "./GameOneView";
import { logicManager } from "../../../script/common/manager/LogicManager";

class GameOneLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    gamePahtDelegate = new GameOneResPath();

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected getGameName() {
        return "gameOne";
    }

    private onEnterGame(data) {
        if (data == this.getGameName()) {
            GamePath.instance.delegate = this.gamePahtDelegate;
            uiManager().open({ type: GameOneView, bundle: this.getGameName() });
        }
    }
}

logicManager().push(GameOneLogic);