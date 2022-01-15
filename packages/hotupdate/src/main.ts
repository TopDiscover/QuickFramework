//@ts-ignore
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
import { helper } from "./Helper";

export const messages = {
    showPanel() {
        Editor.Panel.open("hotupdate");
    }
}


function onBuildStart(options:BuildOptions,callback:Function){
    helper.onBuildStart(options,callback);
}

function onBuildFinished(options:BuildOptions,callback:Function){
    helper.onBuildFinished(options,callback);
}

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function() { 
    Editor.Builder.on('build-start', onBuildStart);
    Editor.Builder.on('build-finished', onBuildFinished);
};

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function() { 
    Editor.Builder.removeListener('build-start', onBuildStart);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
};
