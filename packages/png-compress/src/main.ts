import { helper } from "./Helper";

export const messages = {
    open_panel() {
        Editor.Panel.open("png-compress");
    }
}
const LOG_NAME = "[图片压缩]:";
function onBuildStart(options:BuildOptions,callback:Function){
    Editor.log(`${LOG_NAME} 开始构建`);
    if ( helper.config.enabled ){
        Editor.log(LOG_NAME,"将在构建完成后自动压缩 PNG 资源");
    }
    callback();
}

function onBuildFinished(options:BuildOptions,callback:Function){
    Editor.log(`${LOG_NAME} 构建完成`);
    helper.onAfterBuild(options.dest).then(()=>{
        callback();
    })
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