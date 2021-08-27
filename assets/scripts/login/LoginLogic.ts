
/**
 * @description 登录流程 , 不用导出
 */

import { Logic } from "../framework/base/Logic";
import LoginView from "./view/LoginView";
import { HotUpdate } from "../common/base/HotUpdate";
import DownloadLoading from "../common/component/DownloadLoading";
import { i18n } from "../common/language/CommonLanguage";

class LoginLogic extends Logic {

    logicType: td.Logic.Type = td.Logic.Type.LOGIN;

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Logic.Event.ENTER_LOGIN, this.onEnterLogin);
    }

    get bundle() {
        return td.Macro.BUNDLE_RESOURCES;
    }

    onLoad() {
        super.onLoad();
        this.onEnterLogin();
    }

    private onEnterLogin(data?) {
        cc.log(`--------------onEnterLogin--------------`);
        Manager.loading.show(i18n.checkingUpdate);
        HotUpdate.checkHallUpdate((code, state) => {
            if (code == td.HotUpdate.Code.NEW_VERSION_FOUND || state == td.HotUpdate.State.TRY_DOWNLOAD_FAILED_ASSETS) {
                //有新版本
                cc.log(`提示更新`);
                Manager.loading.hide();
                Manager.alert.show({
                    text: i18n.newVersion, confirmCb: (isOK) => {
                        if (isOK) {
                            Manager.uiManager.open({ type: DownloadLoading, zIndex: td.ViewZOrder.UI, args: [state,i18n.hallText] });
                        } else {
                            //退出游戏
                            cc.game.end();
                        }
                    }
                });
            } else if (code == td.HotUpdate.Code.ALREADY_UP_TO_DATE) {
                //已经是最新版本
                cc.log(`已经是最新版本`);
                Manager.loading.hide();
            } else if (code == td.HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
                code == td.HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
                code == td.HotUpdate.Code.ERROR_PARSE_MANIFEST) {
                Manager.loading.hide();
                let content = i18n.downloadFailManifest;
                if (code == td.HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST) {
                    content = i18n.noFindManifest;
                } else if (code == td.HotUpdate.Code.ERROR_PARSE_MANIFEST) {
                    content = i18n.manifestError;
                }
                Manager.tips.show(content);
            } else if (code == td.HotUpdate.Code.CHECKING) {
                //当前正在检测更新
                cc.log(`正在检测更新!!`);
            } else {
                cc.log(`检测更新当前状态 code : ${code} state : ${state}`);
            }
        });
        Manager.uiManager.open({ type: LoginView, zIndex: td.ViewZOrder.zero, bundle: this.bundle });
    }

    public onEnterComplete(data: td.Logic.EventData) {
        super.onEnterComplete(data);
        if( data.type == this.logicType ){
            //进入到登录，关闭掉所有网络连接，请求登录成功后才连接网络
            Manager.serviceManager.close();
        }
    }

}
Manager.logicManager.push(LoginLogic);
