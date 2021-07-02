
import { Node } from 'cc';

export interface IBundleConfig{
    /**@description Bundle名 如:hall*/
    bundle: string;
    /**@description Bundle名 如:大厅  */
    name: string;
    index :number;
    /**@description 加载bundle完成后，发出的bundle事件 */
    event : string;
    /**@description 是否需要提示弹出框提示升级 */
    isNeedPrompt : boolean;
}

export interface IBundleManager {
    /**@description 删除已经加载的bundle */
    removeLoadedBundle(): void;
    /**@description 删除所有加载子游戏的bundle,大厅的bundle除外 */
    removeLoadedGamesBundle(): void;
    /**
    * 外部接口 进入Bundle
    * @param config 配置
    */
    enterBundle(config: IBundleConfig):void;
}
