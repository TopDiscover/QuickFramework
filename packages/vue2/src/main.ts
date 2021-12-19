//@ts-ignore
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */

export const messages = {
    open_panel() {
        Editor.log("sssssssssssssssss");
        Editor.Panel.open("vue2");
    },
}

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
