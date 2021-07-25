
/**
 * @description 登录流程 , 不用导出
 */

 import { Logic } from "../common/base/Logic";
 import { LogicType, LogicEvent, LogicEventData } from "../common/event/LogicEvent";
 import LoginView from "./view/LoginView";
 import { BUNDLE_RESOURCES } from "../framework/base/Defines";
 import { HotUpdate, AssetManagerCode, AssetManagerState } from "../common/base/HotUpdate";
 import DownloadLoading from "../common/component/DownloadLoading";
import { game, log } from "cc";
import { ViewZOrder } from "../common/config/ViewZOrder";
import { i18n } from "../common/language/CommonLanguage";
 
 class LoginLogic extends Logic {
 
     logicType: LogicType = LogicType.LOGIN;
 
     protected bindingEvents() {
         super.bindingEvents();
         this.registerEvent(LogicEvent.ENTER_LOGIN, this.onEnterLogin);
     }
 
     get bundle() {
         return BUNDLE_RESOURCES;
     }
 
     onLoad() {
         super.onLoad();
         this.onEnterLogin();
     }
 
     private onEnterLogin(data?:any) {
         log(`--------------onEnterLogin--------------`);
         Manager.loading.show(i18n.checkingUpdate);
         HotUpdate.checkHallUpdate((code, state) => {
             if (code == AssetManagerCode.NEW_VERSION_FOUND || state == AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
                 //有新版本
                 log(`提示更新`);
                 Manager.loading.hide();
                 Manager.alert.show({
                     text: i18n.newVersion, confirmCb: (isOK) => {
                         if (isOK) {
                             Manager.uiManager.open({ type: DownloadLoading, zIndex: ViewZOrder.UI, args: [state,i18n.halltext] });
                         } else {
                             //退出游戏
                             game.end();
                         }
                     }
                 });
             } else if (code == AssetManagerCode.ALREADY_UP_TO_DATE) {
                 //已经是最新版本
                 log(`已经是最新版本`);
                 Manager.loading.hide();
             } else if (code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
                 code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
                 code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
                 Manager.loading.hide();
                 let content = i18n.downloadFailManifest;
                 if (code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST) {
                     content = i18n.noFindManifest;
                 } else if (code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
                     content = i18n.manifestError;
                 }
                 Manager.tips.show(content);
             } else if (code == AssetManagerCode.CHECKING) {
                 //当前正在检测更新
                 log(`正在检测更新!!`);
             } else {
                 log(`检测更新当前状态 code : ${code} state : ${state}`);
             }
         });
         Manager.uiManager.open({ type: LoginView, zIndex: ViewZOrder.zero, bundle: this.bundle });
     }
 
     public onEnterComplete(data: LogicEventData) {
         super.onEnterComplete(data);
         if( data.type == this.logicType ){
             //进入到登录，关闭掉所有网络连接，请求登录成功后才连接网络
             Manager.serviceManager.close();
         }
     }
 
 }
 Manager.logicManager.push(LoginLogic);
 