/**
 * @description 网络Service服务管理
 */

import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";
import { CommonService } from "../net/CommonService";
export class ServiceManager implements GameEventInterface {

    private static _instance: ServiceManager = null;
    public static Instance() { return this._instance || (this._instance = new ServiceManager()); }

    private services: CommonService[] = [];
    private services_names: { [keyof: string]: CommonService } = {}

    /**
     * @description 如果自己项目有多个网络Service，
     * 可直接在这里添加，由ServiceManager统一处理 
     * */
    onLoad() {
        //可根据自己项目需要，添加多个service ,添加时必须从优先级 高->低 添加
        // this.addService(EchoService.instance, 3)
        // this.services.push(PinusGameService.instance, 3)

        // PinusGameService.instance.priority = 3
        //  this.services.push(LobbyService.instance);
        //  this.services.push(GameService.instance);
        //  this.services.push(ChatService.instance);
        //  LobbyService.instance.priority = 3;
        //  GameService.instance.priority = 2;
        //  ChatService.instance.priority = 1;
    }

    public getServiceByNmame(name: string): CommonService | null {
        return this.services_names[name]
    }

    private addService(service: CommonService, priority: number) {
        let className = cc.js.getClassName(service)
        this.services_names[className] = service
        this.services.push(service)
        service.priority = priority
    }

    /**@description 网络事件调度 */
    update() {
        this.services.forEach((value) => {
            value && value.handMessage()
        })
    }

    /**@description 主场景销毁,关闭所有连接 */
    onDestroy() {
        this.services.forEach((value) => {
            value && value.close(true)
        });
    }

    /**@description 关闭当前所有连接 */
    close() {
        this.services.forEach(value => {
            value && value.close()
        });
    }

    /**@description 进入后台 */
    onEnterBackground() {
        this.services.forEach(value => {
            value && value.onEnterBackground()
        })
    }
    /**@description 进入前台 */
    onEnterForgeground(inBackgroundTime: number) {
        this.services.forEach(value => {
            value && value.onEnterForgeground(inBackgroundTime)
        });
    }

    /**@description 尝试重连 */
    tryReconnect(service: CommonService, isShowTips: boolean = false) {
        if (!service) {
            cc.error(`service is null`);
            return;
        }
        if (!service.enabled || !service.reconnect.enabled) {
            return;
        }

        if (isShowTips) {
            //登录界面，不做处理
            Manager.uiManager.getView("LoginView").then((view) => {
                if (view) return;
                service.reconnect.hide();
                cc.log(`${service.serviceName} 断开`)
                let current = Manager.alert.currentShow(Config.RECONNECT_ALERT_TAG);
                if (current) {
                    let showService: CommonService = current.userData;
                    if (service.priority > showService.priority) {
                        //如果尝试连接的优先级更高，显示优先级更高的连接
                        cc.log(`显示更新优先级重连弹出框 : ${service.serviceName}`);
                        Manager.alert.close(Config.RECONNECT_ALERT_TAG);
                    }
                }
                Manager.alert.show({
                    tag: Config.RECONNECT_ALERT_TAG,
                    isRepeat: false,
                    userData: service,
                    text: Manager.getLanguage(["warningReconnect", service.serviceName]),
                    confirmCb: (isOK) => {
                        if (isOK) {
                            service.reconnect.show();
                        } else {
                            cc.log(`${service.serviceName} 玩家网络不好，不重连，退回到登录界面`);
                            Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES,true);
                        }
                    },
                    cancelCb: () => {
                        cc.log(`${service.serviceName} 玩家网络不好，不重连，退回到登录界面`);
                        Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES,true);
                    }
                });
            });
        } else {
            if (Manager.alert.isCurrentShow(Config.RECONNECT_ALERT_TAG)) {
                if (CC_DEBUG) cc.warn(`有一个重连提示框显示，等待玩家操作`);
                return;
            }
            let prev: CommonService = null!;
            let cur: CommonService = null!;
            if (this.services.length == 1) { cur = this.services[0] }
            else {
                for (let i = 1; i < this.services.length; i++) {
                    //如果高优先级未连接成功时，低优先的网络不重连
                    prev = this.services[i - 1];
                    cur = this.services[i];
                    if (!prev.enabled || !prev.reconnect.enabled) {
                        //如果没有启用，直接跳过
                        continue;
                    }
                    if (!prev.isConnected) {
                        if (prev == service) {
                            service.reconnect.show();
                        } else {
                            prev.reconnect.show();
                        }
                        return;
                    }
                }
            }

            if (cur == service) {
                service.reconnect.show();
            }
        }
    }

    /**@description 重连成功 */
    onReconnectSuccess(service: CommonService) {
        for (let i = 0; i < this.services.length; i++) {
            //优先级高的重连成功后，连接优先级低的
            if (!this.services[i].enabled || !this.services[i].reconnect.enabled) {
                //如果没有启用，直接跳过
                continue;
            }
            if (!this.services[i].isConnected) {
                this.services[i].reconnect.show();
                break;
            }
        }
    }

    hideReconnet(){
        for( let i = 0 ; i < this.services.length ; i++ ){
            let service = this.services[i];
            service.reconnect.hide();
        }
    }
}