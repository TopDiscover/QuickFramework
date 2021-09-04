import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import GameOneView from "./view/GameOneView";

class GameOneLogic extends LogicImpl {

    /**@description 指定逻辑类型 */
    logicType: Logic.Type = Logic.Type.GAME;

    /**@description 添加逻辑处理事件监听 */
    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    /**@description 返回你的bundle名，即在creator中设置的bundle名 */
    protected get bundle() {
        return "gameOne";
    }

    /**@description 处理进入该模块的游戏事件 */
    private onEnterGame(data) {
        if (data == this.bundle) {
            Manager.uiManager.open({ type: GameOneView, bundle: this.bundle });
        }
    }
}
/**@description 将自己的Bundle逻辑入口交给逻辑管理器 */
Manager.logicManager.push(GameOneLogic);