import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent } from "../../../script/common/event/LogicEvent";
import GameTwoResPath from "./GameTwoResPath";
import { GamePath } from "../../../script/common/base/ResPath";
import { uiManager } from "../../../script/framework/base/UIManager";
import GameTwoView from "./GameTwoView";
import { logicManager } from "../../../script/common/manager/LogicManager";


class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    gamePahtDelegate = new GameTwoResPath();

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected getGameName() {
        return "gameTwo";
    }

    private onEnterGame(data) {
        if (data == this.getGameName()) {
            GamePath.instance.delegate = this.gamePahtDelegate;
            uiManager().open({ type: GameTwoView ,bundle:this.getGameName()});
        }
    }
}

logicManager().push(GameTwoLogic);