/**
* @en 
* @zh 为扩展的主进程的注册方法
*/
export const methods = {
    fixEngine(){
        console.log("测试")
    }
};

/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
export const load = function () {
    console.log("加载fix_engine");
};

/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
export const unload = function () {
    console.log("卸载fix_engine");
};