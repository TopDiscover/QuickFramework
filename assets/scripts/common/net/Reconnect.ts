/**
 * @description 断线重连
 */

 import { Prefab, Node, instantiate, Vec3, find, Label } from "cc";
import { DEBUG } from "cc/env";
import { BUNDLE_RESOURCES } from "../../framework/base/Defines";
 import { EventApi } from "../../framework/event/EventApi";
 import { Config } from "../config/Config";
import { ViewZOrder } from "../config/ViewZOrder";
 import { i18n } from "../language/LanguageImpl";
 import { Manager } from "../manager/Manager";
 import { CommonService } from "./CommonService";
 import ReconnectComponent from "./ReconnectComponent";
 
 export class Reconnect {
 
     static preloadPrefab() {
         this.loadPrefab();
     }
 
     private static prefab: Prefab = null!;
     private static isLoadingPrefab = false
     private static async loadPrefab() {
         return new Promise<boolean>((resolove, reject) => {
             //正在加载中
             if (this.isLoadingPrefab) {
                 warn(`正在加载Reconnect预置体`);
                 return;
             }
             if (this.prefab) {
                 resolove(true);
                 return;
             }
             this.isLoadingPrefab = true;
             Manager.assetManager.load(
                 BUNDLE_RESOURCES,
                 Config.CommonPrefabs.loading,
                 Prefab,
                 (finish, total, item) => { },
                 (data) => {
                     this.isLoadingPrefab = false;
                     if (data && data.data && data.data instanceof Prefab) {
                         Manager.assetManager.addPersistAsset(Config.CommonPrefabs.loading, data.data, BUNDLE_RESOURCES)
                         this.prefab = data.data;
                         resolove(true);
                     }
                     else {
                         resolove(false);
                     }
                 });
         });
     }
 
     private node: Node = null!;
     private isWaitingHide = false;
     private service: CommonService = null!;
     private _enabled = true;
     /**@description 是否启用 */
     public get enabled() {
         return this._enabled;
     }
     public set enabled(value: boolean) {
         this._enabled = value;
     }
     constructor(service: CommonService) {
         this.service = service;
         Manager.eventDispatcher.addEventListener(EventApi.AdaptScreenEvent, this.onAdaptScreen, this)
     }
 
     private onAdaptScreen() {
         Manager.resolutionHelper.fullScreenAdapt(this.node);
     }
 
     public async show(content: string = i18n.reconnect) {
         if( DEBUG ) log(`${this.service.serviceName} 显示重连`);
         if (this.isExistReconnectComponent()) {
             return;
         }
         this.isWaitingHide = false;
         let finish = await Reconnect.loadPrefab();
         if (finish) {
             if (!this.node) {
                 this.node = instantiate(Reconnect.prefab);
             }
             Manager.resolutionHelper.fullScreenAdapt(this.node);
             this.node.name = "Reconnect";
             this.node.removeFromParent();
             this.node.parent = Manager.uiManager.getCanvas();
             this.node.setSiblingIndex(ViewZOrder.Loading);
             this.node.setPosition(new Vec3(0,0,0));
             if (this.isWaitingHide) {
                 this.isWaitingHide = false;
                 this.setActive(false);
                 return;
             }
             if (content) {
                 let label = find('content/text', this.node);
                 if (label) {
                     (label.getComponent(Label) as Label).string = content;
                 }
             }
             this.setActive(true);
         }
     }
 
     /**@description 是否存在重连组件 */
     private isExistReconnectComponent() {
         if (this.node) {
             if (this.node.getComponent(ReconnectComponent)) {
                 return true;
             }
         }
         return false;
     }
 
     private setActive(active: boolean) {
         if (this.node) {
             let controller = this.node.getComponent(ReconnectComponent);
             if (active) {
                 //添加重连组件
                 if (!controller) {
                     controller = this.node.addComponent(ReconnectComponent);
                     controller.service = this.service;
                 }
             } else {
                 this.node.removeComponent(ReconnectComponent);
             }
             this.node.active = active;
         }
     }
 
     public hide() {
         log(`Reconnect hide`);
         if (this.node) {
             this.isWaitingHide = true;
             this.setActive(false);
         } else {
             //没有加载好预置，置一个标记
             this.isWaitingHide = true;
         }
     }
 
     public hideNode() {
         log(`Reconnect hideNode`);
         if (this.node) {
             this.isWaitingHide = true;
             this.node.active = false;
         } else {
             this.isWaitingHide = true;
         }
     }
 
     public showNode(content: string) {
         log(`Reconnect showNode`);
         if (this.node) {
             this.node.active = true;
             if (content) {
                 let label = find('content/text', this.node);
                 if (label) {
                     (label.getComponent(Label) as Label).string = content;
                 }
             }
         }
     }
 }