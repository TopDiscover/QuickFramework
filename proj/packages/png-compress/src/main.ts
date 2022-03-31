import { helper } from "./Helper";
const PACKAGE_NAME = "png-compress"
export const messages = {
    open_panel() {
        Editor.Panel.open("png-compress");
    }
}
const LOG_NAME = "[图片压缩]:";
function onBuildStart(options:BuildOptions,callback:Function){
    helper.readConfig();
    if ( helper.config.enabled ){
        helper.config.isProcessing = true;
        helper.saveConfig();
        Editor.Ipc.sendToPanel(PACKAGE_NAME,"onStartCompress");
    }else{
        helper.config.isProcessing = false;
        helper.saveConfig();
    }
    Editor.log("[图片压缩]:", `开始构建,构建平台:${options.platform}`);
    callback();
}

function onBuildFinished(options:BuildOptions,callback:Function){
    helper.readConfig();
    if ( helper.config.enabled ){
        helper.config.isProcessing = true;
        helper.saveConfig();
        Editor.Panel.open("png-compress");
    }else{
        helper.config.isProcessing = false;
        helper.saveConfig();
    }
    Editor.log(`${LOG_NAME} 构建完成,是否构建后自动压缩:${helper.config.enabled}`);
    helper.onAfterBuild({
        platform : options.platform,
        md5Cache : options.md5Cache,
        dest : options.dest,
        debug : options.debug
    }).then(()=>{
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