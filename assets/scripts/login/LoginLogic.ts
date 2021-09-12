
/**
 * @description 登录流程 , 不用导出
 */

import { LogicImpl } from "../framework/core/logic/LogicImpl";
import LoginView from "./view/LoginView";
import { i18n } from "../common/language/CommonLanguage";
import { HotUpdate } from "../framework/core/hotupdate/Hotupdate";
import { Logic } from "../framework/core/logic/Logic";
import { Config, ViewZOrder } from "../common/config/Config";
import { Macro } from "../framework/defines/Macros";

class LoginLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.LOGIN;

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_LOGIN, this.onEnterLogin);
    }

    get bundle() {
        return Macro.BUNDLE_RESOURCES;
    }

    onLoad() {
        super.onLoad();
        this.onEnterLogin();
    }

    private onEnterLogin(data?) {
        cc.log(`--------------onEnterLogin--------------`);
        Manager.loading.show(i18n.checkingUpdate);
        Manager.hotupdate.checkHallUpdate((code, state) => {
            if (code == HotUpdate.Code.NEW_VERSION_FOUND || state == HotUpdate.State.TRY_DOWNLOAD_FAILED_ASSETS) {
                //有新版本
                cc.log(`提示更新`);
                Manager.loading.hide();
                Manager.alert.show({
                    text: i18n.newVersion, confirmCb: (isOK) => {
                        let data: HotUpdate.MessageData = {
                            isOk: isOK,
                            state: state,
                            name: i18n.hallText,
                            bundle: Config.BUNDLE_HALL
                        };
                        dispatch(HotUpdate.Event.DOWNLOAD_MESSAGE, data);
                    }
                });
            } else if (code == HotUpdate.Code.ALREADY_UP_TO_DATE) {
                //已经是最新版本
                cc.log(`已经是最新版本`);
                Manager.loading.hide();
            } else if (code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
                code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
                code == HotUpdate.Code.ERROR_PARSE_MANIFEST) {
                Manager.loading.hide();
                let content = i18n.downloadFailManifest;
                if (code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST) {
                    content = i18n.noFindManifest;
                } else if (code == HotUpdate.Code.ERROR_PARSE_MANIFEST) {
                    content = i18n.manifestError;
                }
                Manager.tips.show(content);
            } else if (code == HotUpdate.Code.CHECKING) {
                //当前正在检测更新
                cc.log(`正在检测更新!!`);
            } else {
                cc.log(`检测更新当前状态 code : ${code} state : ${state}`);
            }
        });
        Manager.uiManager.open({ type: LoginView, zIndex: ViewZOrder.zero, bundle: this.bundle });
    }

    public onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == this.logicType) {
            //进入到登录，关闭掉所有网络连接，请求登录成功后才连接网络
            Manager.serviceManager.close();
            Manager.protoManager.unload();
        }
    }

}
Manager.logicManager.push(LoginLogic);
