/**
 * @description 网络Service服务管理
 */

import { DEBUG } from "cc/env";
 import { ChatService } from "../net/ChatService";
 import { CommonService } from "../net/CommonService";
 import { GameService } from "../net/GameService";
 import { LobbyService } from "../net/LobbyService";
 
 export class ServiceManager implements GameEventInterface {
 
     private static _instance: ServiceManager = null!;
     public static Instance() { return this._instance || (this._instance = new ServiceManager()); }
 
     private services: CommonService[] = [];
 
     /**
      * @description 如果自己项目有多个网络Service，
      * 可直接在这里添加，由ServiceManager统一处理 
      * */
     onLoad() {
         //可根据自己项目需要，添加多个service ,添加时必须从优先级 高->低 添加
         this.services.push(LobbyService.instance);
         this.services.push(GameService.instance);
         this.services.push(ChatService.instance);
         LobbyService.instance.priority = 3;
         GameService.instance.priority = 2;
         ChatService.instance.priority = 1;
     }
 
     /**@description 网络事件调度 */
     update() {
         this.services.forEach((value) => {
             value && value.handMessage();
         });
     }
 
     /**@description 主场景销毁,关闭所有连接 */
     onDestroy() {
         this.services.forEach((value) => {
             value && value.close(true);
         });
     }
 
     /**@description 关闭当前所有连接 */
     close() {
         this.services.forEach(value => {
             value && value.close();
         });
     }
 
     /**@description 进入后台 */
     onEnterBackground() {
         this.services.forEach(value => {
             value && value.onEnterBackground();
         })
     }
     /**@description 进入前台 */
     onEnterForgeground(inBackgroundTime: number) {
         this.services.forEach(value => {
             value && value.onEnterForgeground(inBackgroundTime);
         });
     }
 
     /**@description 尝试重连 */
     tryReconnect(service: CommonService, isShowTips: boolean = false) {
         if (!service) {
             error(`service is null`);
             return;
         }
         if( !service.enabled || !service.reconnect.enabled ){
             return;
         }
 
         if (isShowTips) {
             //登录界面，不做处理
             Manager.uiManager.getView("LoginView").then((view) => {
                 if (view) return;
                 service.reconnect.hide();
                 log(`${service.serviceName} 断开`)
                 let current = Manager.alert.currentShow(td.Config.RECONNECT_ALERT_TAG);
                 if( current ){
                     let showService : CommonService = current.userData;
                     if( service.priority > showService.priority ){
                         //如果尝试连接的优先级更高，显示优先级更高的连接
                         log(`显示更新优先级重连弹出框 : ${service.serviceName}`);
                         Manager.alert.close(td.Config.RECONNECT_ALERT_TAG);
                     }
                 }
                 Manager.alert.show({
                     tag: td.Config.RECONNECT_ALERT_TAG,
                     isRepeat: false,
                     userData:service,
                     text: Manager.getLanguage(["warningReconnect", service.serviceName]),
                     confirmCb: (isOK) => {
                         if (isOK) {
                             service.reconnect.show();
                         } else {
                             log(`${service.serviceName} 玩家网络不好，不重连，退回到登录界面`);
                             dispatch(td.Logic.Event.ENTER_LOGIN, true);
                         }
                     },
                     cancelCb: () => {
                         log(`${service.serviceName} 玩家网络不好，不重连，退回到登录界面`);
                         dispatch(td.Logic.Event.ENTER_LOGIN, true);
                     }
                 });
             });
         } else {
             if( Manager.alert.isCurrentShow(td.Config.RECONNECT_ALERT_TAG)){
                 if( DEBUG ) warn(`有一个重连提示框显示，等待玩家操作`);
                 return;
             }
             let prev: CommonService = null!;
             let cur : CommonService = null!;
             for (let i = 1; i < this.services.length; i++) {
                 //如果高优先级未连接成功时，低优先的网络不重连
                 prev = this.services[i - 1];
                 cur = this.services[i];
                 if( !prev.enabled || !prev.reconnect.enabled ){
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
             if( cur == service ){
                 service.reconnect.show();
             }
         }
     }
 
     /**@description 重连成功 */
     onReconnectSuccess(service: CommonService) {
         for (let i = 0; i < this.services.length; i++) {
             //优先级高的重连成功后，连接优先级低的
             if( !this.services[i].enabled || !this.services[i].reconnect.enabled){
                 //如果没有启用，直接跳过
                 continue;
             }
             if (!this.services[i].isConnected) {
                 this.services[i].reconnect.show();
                 break;
             }
         }
     }
 }