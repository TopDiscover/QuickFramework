
/**@description 断线重连控制器 */

import { ServiceEvent } from "../../framework/base/Defines";
import Controller from "../../framework/controller/Controller";
import { CustomNetEventType } from "../../framework/event/EventApi";
import { Manager } from "../manager/Manager";
import { CommonService } from "./CommonService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ReconnectController extends Controller<CommonService> {

    logTag = "[ReconnectController]"
    protected onNetError(ev:ServiceEvent) {
        let result = super.onNetError(ev);
        if( result ){
            Manager.uiManager.getView("LoginView").then(view => {
                if (view) {
                    return;
                }
                if( this.service && Manager.serviceManager.isCanTryReconnect(this.service) ){
                    this.service.reconnect.show();
                }
            });
        }
        return result;
    }

    protected onNetClose(ev: ServiceEvent) {
        let result = super.onNetClose(ev);
        if( result ){
            if (ev.event.type == CustomNetEventType.CLOSE) {
                cc.log(`${this.logTag} 应用层主动关闭socket`);
                return;
            }
            Manager.uiManager.getView("LoginView").then(view => {
                if (view) {
                    return;
                }
                if( this.service && Manager.serviceManager.isCanTryReconnect(this.service) ){
                    this.service.reconnect.show();
                }
            });
        }
        return result;
    }
}
