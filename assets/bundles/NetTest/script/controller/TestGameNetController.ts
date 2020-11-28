/**
 * @description 游戏测试
 */

import { injectService } from "../../../../script/framework/decorator/Decorators";
import Controller from "../../../../script/framework/controller/Controller";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { GameService } from "../../../../script/common/net/GameService";
import { ServiceEvent } from "../../../../script/framework/base/Defines";
const { ccclass, property } = cc._decorator;

@ccclass
@injectService(GameService.instance)
export default class TestGameNetController extends Controller<GameService> {

    protected bindingEvents() {
        super.bindingEvents()
    }

    protected onNetOpen(event: ServiceEvent) {
        let result = super.onNetOpen(event);
        if (result) dispatch(CommonEvent.GAME_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.GAME_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(TestGameNetController);
