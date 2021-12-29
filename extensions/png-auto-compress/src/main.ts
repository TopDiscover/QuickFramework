//@ts-ignore
import { IBuildResult, IBuildTaskOption } from '../@types/packages/builder/@types';
import { helper } from './Helper';
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    open_panel() {
        Editor.Panel.open("png-auto-compress");
    },
    /**@description 开始构建 */
    onBeforeBuild(options: IBuildTaskOption, result: IBuildResult) {
        console.log(`=====onBeforeBuild=====>>${helper.config.enabled}`)
        if (helper.config.enabled) {
            console.log(`将在构建完成后自动压缩 PNG 资源`);
        }
    },
    onAfterBuild(options: IBuildTaskOption, result: IBuildResult) {
        console.log(`=====onAfterBuild=====>>${helper.config.enabled}`)
        if ( helper.config.enabled ){
            console.warn("开始压缩 PNG 资源，请勿进行其他操作！");
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
