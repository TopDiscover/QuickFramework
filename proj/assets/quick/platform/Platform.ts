import { Snapshot } from "../components/Snapshot";

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
        cc.sys.openURL(url);
    }

    /**
     * @en Copy text to clipboard 
     * @zh 拷贝字符串到剪切板
     * @param text
     */
    copyText(text: string) {
        // cc.sys.native.copyTextToClipboard(text);
    }

    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`
     */
    getNetworkType() {
        return cc.sys.getNetworkType();
    }

    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel() {
        return cc.sys.getBatteryLevel();
    }

    /**
     * @description 截图
     * @param node 需要截图的节点
     * @param onCaptureComplete 截图完成回调
     */
    snapshot(node: cc.Node, onCaptureComplete?: (sp: cc.SpriteFrame, size: cc.Size) => void) {
        if (cc.isValid(node)) {
            let snapshot = node.addComponent(Snapshot);
            snapshot.onCaptureComplete = onCaptureComplete;
        }
    }

    /**
     * @description 截图文件保存路径
     */
    private _screenshotsPath : string = null;
    get screenshotsPath(){
        if ( this._screenshotsPath ){
            return this._screenshotsPath;
        }
        if ( cc.sys.isNative ){
            this._screenshotsPath = jsb.fileUtils.getWritablePath() + "Screenshots";
            if( !jsb.fileUtils.isDirectoryExist(this._screenshotsPath) ){
                jsb.fileUtils.createDirectory(this._screenshotsPath);
            }
        }
        return this._screenshotsPath;
    }
}