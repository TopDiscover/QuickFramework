//@ts-ignore
import { helper } from './Helper';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    open_panel() {
        Editor.Panel.open("gulp-compress");
    }
};


function onBuildStart(options:BuildOptions,callback:Function){
    helper.onBeforeBuild(options.platform);
    callback();
}

function onBuildFinished(options:BuildOptions,callback:Function){
    helper.onAfterBuild(options.dest,options.platform);
    callback();
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
