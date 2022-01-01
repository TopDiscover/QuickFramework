//@ts-ignore
import { Platform } from '../@types/packages/builder/@types';
import { helper } from './Helper';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    open_panel() {
        Editor.Panel.open("gulp-compress");
    },
    onBeforeBuild(platform:Platform) {
        helper.onBeforeBuild(platform);
    },
    onAfterBuild(dest:string,platform:Platform){
        helper.onAfterBuild(dest,platform);
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function() { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function() { };
