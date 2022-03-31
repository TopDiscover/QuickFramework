export const HotUpdateDTS = {
    assetsManager : `

    /**@description 热更新地址 */
    setPackageUrl(url:string):void;
    /**@description 设置主包包含哪些bunlde,如果 main,resources */
    setMainBundles(bundles:string[]):void;
    /**
     * @description 设置 下载总数占比(即【将要下载资源文件总数】/【总下载资源文件总数】) 
     * 如 ：当为1时，删除本地缓存直接下载整个zip包进行解压
     *      当为0时，不会下载zip ,都以散列文件方式更新
     *      当 percent > 0 && percent < 1，假设为0.5,【下载总数占比】50%会删除掉本地缓存，重新下载zip包进行解压
     * 注意：在将要下载的总数 == 总下载总数 这个值无效，会直接下载zip包
     * @param percent 取值范围0~1
     */
    setDownloadAgainZip(percent:number):void;
    /**@description 重置检测状态 */
    reset():void;

    `,
    manifest :`

    constructor (content: string, manifestRoot: string,packageUrl:string);
    getMd5():string;
    
    `
}