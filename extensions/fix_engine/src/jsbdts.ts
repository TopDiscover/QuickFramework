export const HotUpdateDTS = {
    assetsManager : `

    setPackageUrl(url:string):void;
    reset():void;

    `,
    manifest :`

    constructor (content: string, manifestRoot: string,packageUrl:string);
    getMd5():string;
    
    `
}