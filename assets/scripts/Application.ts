import { alertInit } from "./common/component/Alert";
import { loadingInit } from "./common/component/Loading";
import { tipsInit } from "./common/component/Tips";
import { uiLoadingInit } from "./common/component/UILoading";
import { CommonLanguage } from "./common/language/CommonLanguage";
import { bundleManagerInit } from "./common/manager/BundleManager";
import { logicManagerInit } from "./common/manager/LogicManager";
import { netManagerInit } from "./common/manager/NetManager";
import { serviceManagerInit } from "./common/manager/ServiceManager";
import { resolutionHelperInit } from "./framework/adaptor/ResolutionHelper";
import { assetManagerInit } from "./framework/assetManager/AssetManager";
import { cacheManagerInit } from "./framework/assetManager/CacheManager";
import { languageInit } from "./framework/base/Language";
import { localStorageInit } from "./framework/base/LocalStorage";
import { nodePoolManagerInit } from "./framework/base/NodePoolManager";
import { uiManagerInit } from "./framework/base/UIManager";
import { eventDispatcherInit } from "./framework/event/EventDispatcher";
import { CocosExtentionInit } from "./framework/extentions/CocosExtention";
import { extentionsInit } from "./framework/extentions/Extentions";
import { Manager } from "./framework/Framework";
import { Log, LogLevel } from "./framework/log/Log";
class Application {
    run() {
        //日志
        Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN | LogLevel.DUMP;
        logicManagerInit();
        resolutionHelperInit();
        assetManagerInit();
        cacheManagerInit();
        bundleManagerInit();
        languageInit();
        localStorageInit();
        uiManagerInit();
        eventDispatcherInit();
        //扩展
        extentionsInit();
        //引擎扩展初始化
        CocosExtentionInit();
        netManagerInit();
        serviceManagerInit();
        alertInit();
        loadingInit();
        tipsInit();
        uiLoadingInit();
        nodePoolManagerInit();
        Manager.language.addSourceDelegate(new CommonLanguage);
    }
}

const app = new Application();
app.run();


