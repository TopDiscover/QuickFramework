import { exec, ExecException } from "child_process";
import { existsSync, symlinkSync, unlinkSync } from "fs";
import { join } from "path";
import { chdir, resourceUsage, stderr, stdout } from "process";

interface ResultCmd {
    data: any;
    isSuccess: boolean;
}

/**
 * @description 辅助类
 */
export class Helper {

    private static _instance: Helper = null!;
    static get instance() {
        return this._instance || (this._instance = new Helper);
    }

    /**@description Bunldes 地址 */
    private readonly bundlesUrl = "https://gitee.com/top-discover/QuickFrameworkBundles.git";

    /**@description 保存bundles的名称 */
    private readonly bundleName = "bundles";

    /**@description 当前项目路径 */
    private readonly projPath = join(__dirname, "../../")

    /**@description bundles保存路径 */
    private readonly bundlesPath = join(__dirname, `../../${this.bundleName}`);

    /**@description 链接代码路径 */
    private readonly syncBundlesPath = join(__dirname, `../../proj/assets/${this.bundleName}`);

    /**@description 需要安装依赖的目录 */
    private readonly extensions = [
        "check_resources",
        "fix_engine",
        // "gulp-compress",
        "hotupdate",
        "png-compress",
        "test-server",
    ];

    /**@description 插件路径 */
    private readonly extensionsPath = join(__dirname, `../../proj/packages/`);

    /**@description 执行命令 */
    private exec(cmd: string) {
        return new Promise<ResultCmd>((resolve, reject) => {
            console.log(`执行命令 : ${cmd}`);
            let result = exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    resolve({ isSuccess: false, data: stderr });
                } else {
                    resolve({ isSuccess: true, data: stdout });
                }
            });
            result.stdout?.on("data", (data) => {
                console.log(data)
            });
            result.stderr?.on("data", (data) => {
                console.error(data);
            })
        })
    }

    private chdir(dir: string) {
        console.log(`切换工作目录到 : ${dir}`);
        chdir(dir);
        console.log(`当前工作目录 : ${process.cwd()}`);
    }

    /**@description 获取当前分支信息 */
    private async gitCurBranch() {
        this.chdir(this.projPath);
        let result = await this.exec("git branch");
        if (result.isSuccess) {
            let data: string = result.data;
            let arr = data.split("\n");
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (element.startsWith("*")) {
                    let branch = element.match(/\d+\.\d+\.\d+/g);
                    if (branch) {
                        return branch[0];
                    }
                }
            }
        }
        return null;
    }

    /**@description 摘取远程bundles */
    async gitBundles() {
        this.log("摘取远程bundles",false);
        let branch = await this.gitCurBranch();

        if (existsSync(this.bundlesPath)) {
            console.log(`已经存在 : ${this.bundlesPath}`);
            this.chdir(this.bundlesPath);
            let result = await this.exec("git pull");
            console.log(`正在更新 : ${this.bundleName}`)
            if (!result.isSuccess) {
                return;
            }
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                console.log(`切换分支${branch}成功 : ${this.bundleName}`)
            }
        } else {
            console.log(`不存在 : ${this.bundlesPath}`);
            this.chdir(this.projPath);
            console.log(`拉取远程 : ${this.bundleName}`)
            let result = await this.exec(`git clone ${this.bundlesUrl} ${this.bundleName}`);
            if (!result.isSuccess) {
                return;
            }
            console.log(`摘取成功 : ${this.bundleName}`);
            this.chdir(this.bundlesPath);
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                console.log(`切换分支${branch}成功 : ${this.bundleName}`)
            }
        }
        this.log("摘取远程bundles",true);
    }

    /**@description 链接代码 */
    symlinkSyncCode() {
        this.log("链接代码",false);
        if (existsSync(this.syncBundlesPath)) {
            unlinkSync(this.syncBundlesPath);
        }
        symlinkSync(this.bundlesPath, this.syncBundlesPath);
        console.log(`创建 ${this.bundlesPath} -> ${this.syncBundlesPath}`);
        this.log("链接代码",true);
    }

    private log( name : string , isEnd : boolean ){
        let start = "/****************** 【";
        let end   = "】******************/"
        if ( isEnd ){
            console.log(`${start}${name} 完成 ${end}`)
        }else{
            console.log(`${start}${name} 开始 ${end}`)
        }
    }

    /**@description 安装依赖 */
    async installDepends() {

        this.log("安装插件依赖",false);

        for (let index = 0; index < this.extensions.length; index++) {
            const element = this.extensions[index];
            let path = join(this.extensionsPath, element);
            this.chdir(path);
            console.log(`正在更新插件依赖 : ${element}`);
            await this.exec("npm install");
        }

        this.log("安装插件依赖",true)
    }

}