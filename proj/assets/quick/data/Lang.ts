import { LanguageDelegate } from "../core/language/LanguageDelegate";
import { Macro } from "../defines/Macros";

/**@description 框架内使用的语言包 */
const LangCN = {
    language: cc.sys.LANGUAGE_CHINESE,
    data : {
        bundles: {},//程序写入
        capture_save_failed: "保存图片失败",
        capture_success: "截图成功",
        capture_failed: "截图失败",
        capture_save_photo_album: "成功保存到设备相册",
        capture_save_local_success1: "成功保存在设备目录并加载成功: {0}",
        capture_save_local_success2: "成功保存在设备目录: {0}",
        warningReconnect: "{0}网络已断开，是否重新连接？",
        tryReconnect: "{0}网络:正在尝试第{1}次连接...",
        updateFaild: "更新{0}失败",
        checkingUpdate: "检测更新中...",
        mainPackVersionIsTooLow: "版本过低，请更新。",
        alreadyRemoteVersion: "{0}已升级到最新",
        loadFailed: "{0}加载失败!!",
        restartApp : "{0}更新完成，需要重启游戏",
        downloadFailed: "下载文件失败，请重试!!!",
        loading: "正在加载...",
    }
}

const LangEN = {
    language: cc.sys.LANGUAGE_ENGLISH,
    data : {
        bundles: {},//程序写入
        capture_save_failed: "Failed to save picture",
        capture_success: "Successful screenshot",
        capture_failed: "Screenshot failed",
        capture_save_photo_album: "Successfully saved to device album",
        capture_save_local_success1: "Successfully saved in the device directory {0} and loaded successfully",
        capture_save_local_success2: "Successfully saved in the device directory {0}",
        warningReconnect: "{0} network has been disconnected. Do you want to reconnect?",
        tryReconnect: "{0}Trying to connect for the {1} time...",
        updateFaild: "Update {0} Faild",
        checkingUpdate: "Checking update...",
        mainPackVersionIsTooLow: "版本过低，请更新。",
        alreadyRemoteVersion: "{0}已升级到最新",
        loadFailed: "{0}加载失败!!",
        restartApp : "{0}更新完成，需要重启游戏",
        downloadFailed: "下载文件失败，请重试!!!",
        loading: "正在加载...",
    }
}

/**@description 只是声明文件用到 */
export const Lang = LangCN;

export class LangData extends LanguageDelegate{
    init(): void {
        App.stageData.entrys.forEach(v=>{
            (<any>LangEN.data.bundles)[v.bundle] = v.name.EN;
            (<any>LangCN.data.bundles)[v.bundle] = v.name.CN;
        })
        this.add(LangCN);
        this.add(LangEN);
    }
    
    bundle = Macro.BUNDLE_RESOURCES;
}