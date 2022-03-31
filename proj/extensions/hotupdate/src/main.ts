//@ts-ignore
import { Platform } from '../@types/packages/builder/@types';
import { helper } from './Helper';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    },
    onAfterBuild(dest: string, platform: Platform) {
        if (platform == "android" || platform == "ios" || platform == "mac" || platform == "windows") {
            helper.onAfterBuild(dest);
        }
    },
    onBeforeBuild(platform:Platform){
        console.log(`[热更新]开始构建，构建平台:${platform}`);
        if (platform == "android" || platform == "ios" || platform == "mac" || platform == "windows") {
            helper.onBeforeBuild();
        }
    },
    /**@description png图片压缩完成 */
    onPngCompressComplete(dest: string, platform: Platform){
        console.log(`[热更新]png图片压缩完成,构建平台:${platform}`);
        if (platform == "android" || platform == "ios" || platform == "mac" || platform == "windows") {
            helper.onPngCompressComplete();
        }
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function () { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function () { };
