import { readFileSync } from "fs";
import { normalize } from "path";

export interface ShowInfo {
    name: string;
    dir: string;
    db: string;
}

/**@description bundle信息 */
export interface BundleInfo {
    /**@description bundle名，如大厅 */
    name: string;
    /**@description bundle对应目录 */
    dir: string;
    /**@description bundle版本号 */
    version: string;
    /**@description 是否包含在主包内 */
    includeApk: boolean;
}

class Helper {


    bundles: { [key: string]: ShowInfo } = {};

    get root(){
        let ret = `${Editor.Project.path}/assets/bundles`;
        return normalize(ret);
    }

    init() {
        let bundleConfigPath = `${Editor.Project.path}/config/bundles.json`;
        let config = readFileSync(bundleConfigPath, { encoding: "utf-8" });
        let configObj = JSON.parse(config);
        let bundles: BundleInfo[] = configObj.bundles;
        for (let i = 0; i < bundles.length; i++) {
            let info = bundles[i];
            if (info.dir == "hall") {
                console.log(`${info.name}(${info.dir})不参考检测`)
            } else {
                this.bundles[info.dir] = { name: info.name, dir: info.dir, db: `db://assets/bundles/${info.dir}` };
            }
        }
    }

    onCheckSubGame(dir: string) {
        console.log(dir);
    }
}

export const helper = new Helper();