"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotUpdateDTS = void 0;
exports.HotUpdateDTS = {
    assetsManager: `

    setPackageUrl(url:string):void;
    reset():void;

    `,
    manifest: `

    constructor (content: string, manifestRoot: string,packageUrl:string);
    getMd5():string;
    
    `
};
