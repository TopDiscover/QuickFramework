import { native, sys } from "cc";

/**
 * @description 平台相关代码处理
 */
export class Platform implements ISingleton {
    static module: string = "【平台管理器】";
    module: string = null!;

    /**
     * @en Try to open a url in browser, may not work in some platforms
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效
     */
    openURL(url: string) {
        sys.openURL(url);
    }

    /**
     * @en Copy text to clipboard 
     * @zh 拷贝字符串到剪切板
     * @param text
     */
    copyText(text: string) {
        native.copyTextToClipboard(text);
    }

    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`
     */
    getNetworkType(){
        return sys.getNetworkType();
    }

    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel(){
        return sys.getBatteryLevel();
    }
}