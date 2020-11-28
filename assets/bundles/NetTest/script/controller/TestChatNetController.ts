/**
 * @description 聊天测试
 */

import { injectService } from "../../../../script/framework/decorator/Decorators";
import Controller from "../../../../script/framework/controller/Controller";
import { ChatService } from "../../../../script/common/net/ChatService";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { ServiceEvent } from "../../../../script/framework/base/Defines";
const { ccclass, property } = cc._decorator;

@ccclass
@injectService(ChatService.instance)
export default class TestChatNetController extends Controller<ChatService> {

    protected bindingEvents() {
        super.bindingEvents()
    }

    protected onNetOpen(event: ServiceEvent) {
        let result = super.onNetOpen(event);
        if (result) dispatch(CommonEvent.CHAT_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.CHAT_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(TestChatNetController);
