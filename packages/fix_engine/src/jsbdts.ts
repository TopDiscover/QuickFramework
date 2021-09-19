export const HotUpdateDTS = {
    assetsManager : `

    setHotUpdateUrl(url:string):void;

    `,
    manifest :`

    constructor (content: string, manifestRoot: string,hotUpdateUrl:string);
    
    `
}