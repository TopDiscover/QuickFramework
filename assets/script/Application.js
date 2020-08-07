
import { Log,LogLevel } from "./framework/log/Log"
import { CocosExtentionInit } from "./framework/extentions/CocosExtention";
import { resolutionHelper } from "./framework/adaptor/ResolutionHelper";
import { extentionsInit } from "./framework/extentions/Extentions";
import { language } from "./framework/base/Language";
import { getSingleton } from "./framework/base/Singleton";
import { LanguageImpl } from "./common/language/LanguageImpl";
//日志
Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN| LogLevel.DUMP;
//适配
resolutionHelper().initBrowserAdaptor();
//扩展
extentionsInit();
//引擎扩展初始化
CocosExtentionInit();
//语言包初始化
//cc.log("language init");
language().delegate = getSingleton(LanguageImpl)
