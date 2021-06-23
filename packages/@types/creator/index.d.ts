
declare module Editor {

    export function log(...args): void;

    export interface Argv {
        /**@description 当前项目工程目录 */
        path: string;
        logfile: string;
        /**@description creator安装目录 */
        $0: string;
    }

    export interface BuildOptions {
        actualPlatform: {
            REMOTE_SERVER_ROOT: string;
            packageName: string;
        }
        "android-instant": {
            REMOTE_SERVER_ROOT: string;
            host: string;
            packageName: string;
        }
        apiLevel: string;
        appABIs: any[];
        buildPath: string;
        debug: boolean;
        dest: string;
        embedWebDebugger: boolean;
        md5Cache: boolean;
        packageName: string;
        platform: string;
    }

    export const argv: Argv;

    export const versions: {
        CocosCreator: string,
        "editor-framework": string,
        "asset-db": string,
        "cocos2d": string
    };

    export namespace Ipc {
        export function sendToPanel(packageName: string, message: string, params: any);
    }

    export namespace Panel {
        export function open(packageName: string, params?: any);
        export function extend(options:{style:string,template:string,$,ready:()=>void,messages:{}});
    }

    export class CocosProject{
        path : string;
    }

    export const Project : CocosProject;
    
    export namespace Dialog{
        export function openFile(options : { title : string , defaultPath : string , properties:string[]}):any;
    }

}
