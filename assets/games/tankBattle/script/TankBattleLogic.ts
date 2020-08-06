import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import { uiManager } from "../../../script/framework/base/UIManager";
import { logicManager } from "../../../script/common/manager/LogicManager";
import TankBattleGameView from "./TankBattleGameView";

class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected getGameName() {
        return "tankBattle";
    }

    private onEnterGame(data) {
        if (data == this.getGameName()) {
            uiManager().open({ type: TankBattleGameView ,bundle:this.getGameName()});
        }
    }
}

logicManager().push(GameTwoLogic);