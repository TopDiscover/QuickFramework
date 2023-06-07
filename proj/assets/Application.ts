import Alert from "./scripts/common/component/Alert";
import GlobalAudio from "./scripts/common/component/GlobalAudio";
import Loading from "./scripts/common/component/Loading";
import Tips from "./scripts/common/component/Tips";
import UILoading from "./scripts/common/component/UILoading";
import { UIReconnect } from "./scripts/common/component/UIReconnect";
import UpdateLoading from "./scripts/common/component/UpdateLoading";
import { Config } from "./scripts/common/config/Config";
import { Bundles } from "./scripts/common/data/Bundles";
import { StageData } from "./scripts/common/data/StageData";
import { CmmEntry } from "./scripts/common/entry/CmmEntry";
import { CommonLanguage } from "./scripts/common/language/CommonLanguage";
import { CmmUtils } from "./scripts/common/utils/CmmUtils";
import { LogLevel } from "./scripts/framework/defines/Enums";
import { Framewok } from "./scripts/framework/Framework";
import { Singleton } from "./scripts/framework/utils/Singleton";

/**@description 游戏所有运行单例的管理 */
export class Application extends Framewok implements GameEventInterface {

    get isLazyRelease(){
        if ( !this.isAutoReleaseUnuseResources ){
            Log.w(`需要使用都自己导出cc.game.EVENT_LOW_MEMORY事件`);
        }
        return true;
    }

    get Bundles(){
        return Bundles;
    }

    /**@description 是否开启自动释放长时间未使用资源 */
    get isAutoReleaseUnuseResources(){
        return true;
    }

    /**@description 当isLazyRelease 为true时有效，当资源长时间未使用时自动释放 */
    get autoReleaseUnuseResourcesTimeout(){
        return 5 * 60;
    }

    get utils(){
        return Singleton.get(CmmUtils)!;
    }

    /**@description 进入后台的时间 */
    private _enterBackgroundTime = 0;

    /**@description 重连专用提示UI部分 */
    get uiReconnect( ){
        return Singleton.get(UIReconnect)!;
    }

    /**@description 小提示 */
    get tips() {
        return Singleton.get(Tips)!;
    }

    /**@description 界面加载时的全屏Loading,显示加载进度 */
    get uiLoading(): UILoading {
        return Singleton.get(UILoading)!;
    }

    /**@description 弹出提示框,带一到两个按钮 */
    get alert() {
        return Singleton.get(Alert)!;
    }

    /**@description 公共loading */
    get loading() {
        return Singleton.get(Loading)!;
    }

    get updateLoading(){
        return Singleton.get(UpdateLoading)!;
    }

    /**@description 获取Stage数据 */
    get stageData(){
        return this.dataCenter.get(StageData) as StageData;
    }

    private _wssCacertUrl = "";
    /**@description websocket wss 证书url地址 */
    set wssCacertUrl(value) {
        this._wssCacertUrl = value;
    }
    get wssCacertUrl() {
        return this._wssCacertUrl;
    }

    /**@description 全局网络播放声音组件，如播放按钮音效，弹出框音效等 */
    private _globalAudio: GlobalAudio = null!;
    get globalAudio() {
        if (this._globalAudio) {
            return this._globalAudio;
        }
        this._globalAudio = this.uiManager.canvas.getComponent(GlobalAudio) as GlobalAudio;
        return this._globalAudio;
    }

    init() {
        super.init();
        this.updateManager.hotUpdateUrl = Config.HOT_UPDATE_URL;
        this.updateManager.isAutoVersion = Config.USE_AUTO_VERSION;
        this.updateManager.isSkipCheckUpdate = Config.isSkipCheckUpdate;

        //初始化自定主entry代理
        this.entryManager.delegate = new CmmEntry();

        //语言包初始化
        //cc.log("language init");
        this.language.addDelegate(new CommonLanguage);
    }

    onLoad(node: cc.Node) {
        //预先加载下loading预置体
        App.uiManager.onLoad(node);
        //Service onLoad
        App.serviceManager.onLoad();
        //入口管理器
        App.entryManager.onLoad(node);
        //释放管理器
        App.releaseManger.onLoad(node);
    }

    update(node: cc.Node) {
        //Service 网络调试
        App.serviceManager.update();

        //远程资源下载任务调度
        App.asset.remote.update();
    }

    onDestroy(node: cc.Node) {
        App.serviceManager.onDestroy();
        //入口管理器
        App.entryManager.onDestroy(node);
        //释放管理器
        App.releaseManger.onDestroy(node);
    }

    onEnterBackground(): void {
        this._enterBackgroundTime = Date.timeNow();
        Log.d(`[MainController]`, `onEnterBackground ${this._enterBackgroundTime}`);
        App.globalAudio.onEnterBackground();
        App.serviceManager.onEnterBackground();
    }
    onEnterForgeground(): void {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        Log.d(`[MainController]`, `onEnterForgeground ${now} background total time : ${inBackgroundTime}`);
        App.globalAudio.onEnterForgeground(inBackgroundTime);
        App.serviceManager.onEnterForgeground(inBackgroundTime);
    }
}

let app = new Application();
app.logger.level = LogLevel.ALL;
(<any>window)["App"] = app;
app.init();