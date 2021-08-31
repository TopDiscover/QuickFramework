import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import LoadTestView from "./view/LoadTestView";

class LoadTestLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.GAME;

    onLoad() {
        super.onLoad();
    }

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "loadTest";
    }

    private onEnterGame(data) {
        if (data == this.bundle) {
            //游戏数据初始化
            //加载资源
            this._loader.loadResources();
        } else {

            //卸载资源
            this._loader.unLoadResources();
        }
    }

    /**@description 进入的模块只要不是自己的模块，需要把自己加载的资源卸载 */
    onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        //关闭房间列表
        if (data.type == this.logicType) {

        }
        else {
            //移除网络组件 
            //this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    protected onLoadResourceComplete(err: Resource.LoaderError) {
        if (err == Resource.LoaderError.LOADING) {
            return;
        }
        cc.log(`${this.bundle}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: LoadTestView, bundle: this.bundle });
    }

    protected getLoadResources(): Resource.Data[] {
        // return [];
        return [{ dir: "texture/sheep", bundle: this.bundle, type: cc.SpriteFrame }];
    }
}

Manager.logicManager.push(LoadTestLogic);