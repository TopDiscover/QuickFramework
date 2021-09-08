import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import { LobbyService } from "../../../scripts/common/net/LobbyService";
import TankBattleGameView from "./view/TankBattleGameView";
import { TankBettle } from "./data/TankBattleGameData";
import TankBattleNetController from "./controller/TankBattleNetController";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Logic } from "../../../scripts/framework/core/logic/Logic";
/**
 * @description 坦克大战Logic
 * 1，指定logic类型
 * 2，监听logic进入事件
 * 3，监听logic进入完成事件
 * 4，返回当前bundle名
 * 5，返回该模块网络控制器数据
 * 6，监听资源加载与卸载相关事件
 * 7，返回需要加载资源的配置信息
 * 8，添加logic到logic管理器中
 */
class TankBattleLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    language = new TankBattleLanguage;
    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
        this.addUIEvent(Logic.Event.ENTER_ROOM_LIST, this.onEnterRoomList);
    }

    protected get bundle() {
        return TankBettle.gameData.bundle;
    }

    public onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == this.logicType) {

        } else {
            //删除子包的语言包
            Manager.language.removeSourceDelegate(this.language);
            //移除网络组件
            this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    private onEnterRoomList(data) {
        //打开自己的子游戏房间列表
    }

    protected onLoadResourceComplete(err: Resource.LoaderError) {
        if (err == Resource.LoaderError.LOADING) {
            return;
        }
        cc.log(`${this.bundle}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        //加载完成，恢复网络
        LobbyService.instance.resumeMessageQueue();
        Manager.uiManager.open({ type: TankBattleGameView, bundle: this.bundle });
    }

    protected getNetControllerType() {
        return TankBattleNetController
    }

    private onEnterGame(data) {
        if (data == this.bundle) {

            //游戏数据初始化
            Manager.gameData = TankBettle.gameData;
            Manager.gameData.clear();

            //子游戏语言包初始化
            Manager.language.addSourceDelegate(this.language);

            //添加网络组件
            this.addNetComponent();

            //先暂停网络回调处理，等待资源加载完成后，恢复处理
            LobbyService.instance.pauseMessageQueue();
            //加载资源
            this._loader.loadResources();
        } else {

            //移除网络组件
            this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    protected getLoadResources(): Resource.Data[] {
        return [{ preloadView: TankBattleGameView, bundle: this.bundle }];
    }
}

Manager.logicManager.push(TankBattleLogic);