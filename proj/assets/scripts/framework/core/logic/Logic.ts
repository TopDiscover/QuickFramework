import { js } from "cc";
import OnlyEventComponent from "../../componects/OnlyEventComponent";
import { Macro } from "../../defines/Macros";

export class Logic extends OnlyEventComponent {
    /**@description 所属模块,管理器设置，GameView中的bundle的值 */
    static module = Macro.UNKNOWN;
    /**@description 所属模块,管理器设置，GameView中的bundle的值 */
    module = Macro.UNKNOWN;
    /**@description 当前逻辑管理器bundle */
    get bundle() {
        return this.module;
    }

    protected gameView: GameView = null!;

    /**@description 重置游戏逻辑 */
    reset(gameView: GameView) {

    }

    onLoad(gameView: GameView): void {
        this.gameView = gameView;
        super.onLoad(gameView);
    }
    update(dt: number): void { }

    destory(...args: any[]): void {
        this.onDestroy();
    }

    debug(){
        Log.d(`${this.module} : ${js.getClassName(this)}`);
    }
}