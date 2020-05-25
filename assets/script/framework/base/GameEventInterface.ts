/**
 * @description 处理游戏事件接口声明
 *      cc.game.EVENT_ENGINE_INITED
        cc.game.EVENT_GAME_INITED
        cc.game.EVENT_HIDE
        cc.game.EVENT_RESTART
        cc.game.EVENT_SHOW
 */

export interface GameEventInterface{

    /**@description 进入后台 cc.game.EVENT_HIDE*/
    onEnterBackground();

    /**
     * @description 进入前台 cc.game.EVENT_SHOW
     * @param inBackgroundTime 在后台运行的总时间，单位秒
     */
    onEnterForgeground( inBackgroundTime : number );
}
