import { exec } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { chdir } from "process";
import { Logger, ResultCmd } from "./Defines";
import { Environment } from "./Environment";

export class Handler {

    module = "Handler";

    /**@description 日志 */
    private _logger: Logger = null!
    get logger() {
        if (!this._logger) {
            this._logger = console;
        }
        return this._logger;
    }
    set logger(v) {
        this._logger = v;
    }

    /**@description 保存bundles的名称 */
    readonly bundleName = "bundles";

    /**@description 当前项目路径 */
    get projPath() {
        if (Environment.isCommand) {
            return join(__dirname, "../../../");
        } else {
            return join(__dirname, "../../../../../");
        }
    }

    /**@description bundles保存路径 */
    readonly bundlesPath = join(this.projPath, this.bundleName);

    /**@description 链接代码路径 */
    readonly syncBundlesPath = join(this.projPath, `proj/assets/${this.bundleName}`);

    /**@description 插件路径 */
    readonly extensionsPath = join(this.projPath, `proj/${Environment.extensionsName}`);

    /**@description 需要安装依赖的目录 */
    readonly extensions = Environment.extensions;

    /**@description 扩展插件配置保存路径 */
    readonly configPath = join(this.projPath, `proj/config`);

    /**@description 依赖库 */
    readonly node_modules = join(this.projPath, "tools/node_modules");

    /**@description 构建目录 */
    readonly buildPath = join(this.projPath, "proj/build");

    /**@description local目录 */
    readonly localPath = join(this.projPath, "proj/local");

    /**@description 当前插件路径 */
    get curExtensionPath() {
        return "";
    }

    /**@description 获取当前的日期 */
    get date(){
        let date = new Date();
        let localeDate = date.toLocaleDateString();
        let replace = function(){
            let monthStr : string = arguments[2];
            let month = parseInt(monthStr.substring(1));
            monthStr = month < 10 ? `0${month.toString()}` : month.toString();
            
            let dayStr = arguments[3];
            let day = parseInt(dayStr.substring(1));
            dayStr = day < 10 ? `0${day.toString()}` : day.toString();
            return arguments[1] + monthStr + dayStr;
        }
        localeDate = localeDate.replace(/(\d+)(\/\d+)(\/\d+)/g,replace);
        let time = date.toLocaleTimeString();
        time = time.replace(/(\d+)(\:\d+)(\:\d+)/g,replace);
        let result = `${localeDate}${time}`;
        return result;
    }

    /**@description 执行命令 */
    exec(cmd: string, isLog = true) {
        return new Promise<ResultCmd>((resolve, reject) => {
            isLog && this.logger.log(`执行命令 : ${cmd}`);
            let result = exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    isLog && this.logger.error(`执行命令 : ${cmd}失败`);
                    isLog && this.logger.error(err);
                    resolve({ isSuccess: false, data: err });
                } else {
                    resolve({ isSuccess: true, data: stdout });
                }
            });
            result.stdout?.on("data", (data) => {
                isLog && this.logger.log(data)
            });
            result.stderr?.on("error", (data) => {
                isLog && this.logger.error(data);
            })
        })
    }

    chdir(dir: string) {
        this.logger.log(`切换工作目录到 : ${dir}`);
        if (existsSync(dir)) {
            chdir(dir);
        } else {
            this.logger.error(`切换工作目录失败，找不到 : ${dir}`);
        }

        this.logger.log(`当前工作目录 : ${process.cwd()}`);
    }

    log(name: string, isEnd: boolean) {
        let start = "/****************** 【";
        let end = "】******************/"
        if (isEnd) {
            this.logger.log(`${start}${name} 完成 ${end}`)
        } else {
            this.logger.log(`${start}${name} 开始 ${end}`)
        }
    }

    /**@description 当前插件支持的Creator版本号 */
    get supportVersions() {
        return Environment.supportVersions;
    }

    /**
     * @description 是否支持
     * @param version 
     * @returns 
     */
    isSupport(version: string) {
        if (this.supportVersions.indexOf(version) >= 0) {
            return true;
        }
        return false;
    }

}