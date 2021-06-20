
declare module Editor{

    export function log(...args):void;

    export interface Argv{
        /**@description 当前项目工程目录 */
        path : string;
        logfile:string;
        /**@description creator安装目录 */
        $0 : string;
    }

    export const argv : Argv;

    export const versions : {
        CocosCreator:string,
        "editor-framework":string,
        "asset-db":string,
        "cocos2d":string
    };
}
