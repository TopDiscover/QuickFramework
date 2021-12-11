export const HotUpdateDTS = {
    assetsManager : `

    /**@description 热更新地址 */
    setPackageUrl(url:string):void;
    /**@description 设置主包包含哪些bunlde,如果 main,resources */
    setMainBundles(bundles:string[]):void;
    /**@description 重置检测状态 */
    reset():void;

    `,
    manifest :`

    constructor (content: string, manifestRoot: string,packageUrl:string);
    getMd5():string;
    
    `
}