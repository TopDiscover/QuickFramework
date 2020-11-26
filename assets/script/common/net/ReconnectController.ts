
/**@description 断线重连控制器 */

import Controller from "../../framework/controller/Controller";
import { CustomNetEventType } from "../../framework/event/EventApi";
import { Manager } from "../manager/Manager";
import { CommonService } from "./CommonService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ReconnectController extends Controller<CommonService> {

    logTag = "[ReconnectController]"
    protected onNetError(ev: Event) {
        super.onNetError(ev);
        Manager.uiManager.getView("LoginView").then(view => {
            if (view) {
                return;
            }
            this.service && this.service.reconnect.show();
        });
    }

    protected onNetClose(ev: Event) {
        super.onNetClose(ev);
        if (ev.type == CustomNetEventType.CLOSE) {
            cc.log(`${this.logTag} 应用层主动关闭socket`);
            return;
        }
        Manager.uiManager.getView("LoginView").then(view => {
            if (view) {
                return;
            }
            this.service && this.service.reconnect.show();
        });
    }
}
