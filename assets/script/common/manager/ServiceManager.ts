/**
 * @description 网络Service服务管理
 */

import { GameEventInterface } from "../../framework/base/GameEventInterface";
import { ChatService } from "../net/ChatService";
import { CommonService } from "../net/CommonService";
import { GameService } from "../net/GameService";
import { LobbyService } from "../net/LobbyService";

 export class ServiceManager implements GameEventInterface {
    
    private static _instance: ServiceManager = null;
    public static Instance() { return this._instance || (this._instance = new ServiceManager()); }

    private services : CommonService [] = [];

    /**
     * @description 如果自己项目有多个网络Service，
     * 可直接在这里添加，由ServiceManager统一处理 
     * */
    onLoad(){
        //可根据自己项目需要，添加多个service ,添加时必须从优先级 高->低 添加
        this.services.push(LobbyService.instance);
        this.services.push(GameService.instance);
        this.services.push(ChatService.instance);
    }

    /**@description 网络事件调度 */
    update(){
        this.services.forEach((value)=>{
            value && value.handMessage();
        });
    }

    /**@description 主场景销毁,关闭所有连接 */
    onDestroy(){
        this.services.forEach((value)=>{
            value && value.close(true);
        });
    }

    /**@description 关闭当前所有连接 */
    close(){
        this.services.forEach(value=>{
            value && value.close();
        });
    }

    /**@description 进入后台 */
    onEnterBackground() {
        this.services.forEach(value=>{
            value && value.onEnterBackground();
        })
    }
    /**@description 进入前台 */
    onEnterForgeground(inBackgroundTime: number) {
        this.services.forEach(value=>{
            value && value.onEnterForgeground(inBackgroundTime);
        });
    }

    isCanTryReconnect( service : CommonService ){
        let prev : CommonService = null;
        for( let i = 1 ; i < this.services.length ; i++ ){
            //如果高优先级未连接成功时，低优先的网络不重连
            prev = this.services[i-1];
            if( !prev.isConnected ){
                if( prev == service ){
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    onReconnectSuccess( service : CommonService ){
        for( let i = 0 ; i < this.services.length ; i++ ){
            //优先级高的重连成功后，连接优先级低的
            if( !this.services[i].isConnected ){
                this.services[i].reconnect.show();
                break;
            }
        }
    }
 }