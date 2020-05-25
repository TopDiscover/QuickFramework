
import { Log,LogLevel } from "./framework/log/Log"
import { CocosExtentionInit } from "./framework/extentions/CocosExtention";
import { resolutionHelper } from "./framework/adaptor/ResolutionHelper";

Log.logLevel = LogLevel.ERROR | LogLevel.LOG | LogLevel.WARN| LogLevel.DUMP;
resolutionHelper().initBrowserAdaptor();
CocosExtentionInit();