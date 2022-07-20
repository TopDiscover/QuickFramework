import { helper } from "./Helper";
const PACKAGE_NAME = "png-compress"
export const messages = {
    open_panel() {
        Editor.Panel.open("png-compress");
    }
}
function onBuildStart(options:BuildOptions,callback:Function){
    helper.read(true);
    if ( helper.data && helper.data.enabled ){
        helper.data.isProcessing = true;
        helper.save();
        Editor.Ipc.sendToPanel(PACKAGE_NAME,"onStartCompress");
    }else{
        helper.data!.isProcessing = false;
        helper.save();
    }
    helper.logger.log(`${helper.module}开始构建,构建平台:${options.platform}`);
    callback();
}

function onBuildFinished(options:BuildOptions,callback:Function){
    helper.read(true);
    if ( helper.data!.enabled ){
        helper.data!.isProcessing = true;
        helper.save();
        Editor.Panel.open("png-compress");
    }else{
        helper.data!.isProcessing = false;
        helper.save();
    }
    helper.logger.log(`${helper.module} 构建完成,是否构建后自动压缩:${helper.data!.enabled}`);
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