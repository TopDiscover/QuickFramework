import { Macro } from "../../defines/Macros";

export class Logic {
    /**@description logic bundle，管理器设置 */
    static bundle = Macro.UNKNOWN;
    /**@description logic bundle，管理器设置 */
    bundle: string = Macro.UNKNOWN;

    protected gameView : GameView = null!;

    /**@description 重置游戏逻辑 */
    reset( gameView : GameView ) {

    }

    onLoad( gameView : GameView ):void{
        this.gameView = gameView;
    }
    update(dt: number): void{}
    onDestroy():void{}
}