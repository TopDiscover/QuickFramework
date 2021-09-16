"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotUpdateDTS = void 0;
exports.HotUpdateDTS = {
    assetsManager: `

    setHotUpdateUrl(url:string):void;

    `,
    manifest: `

    constructor (content: string, manifestRoot: string,hotUpdateUrl:string);
    
    `
};
