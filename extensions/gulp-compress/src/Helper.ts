import { exec } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";

const LOG_NAME = "[Gulp压缩]:";

interface Config {
    nodejs: string;
    enabled: boolean;
    buildDir: string;
}

class Helper {

    private defaultConfig: Config = {
        enabled: false,
        buildDir: "",
        nodejs : ""
    };

    private _config: Config = null!;
    get config() {
        if (!this._config) {
            this.readConfig();
        }
        return this._config;
    }

    /**@description 配置存储路径 */
    private get configPath() {
        let savePath = `${path.join(Editor.Project.path, "/local/gulp-compress.json")}`;
        savePath = normalize(savePath);
        return savePath;
    }

    private readConfig() {
        let tempPath = this.configPath;
        if (existsSync(tempPath)) {
            this._config = JSON.parse(readFileSync(tempPath, { encoding: "utf-8" }));
        } else {
            this._config = this.defaultConfig;
        }
    }

    saveConfig() {
        let savePath = this.configPath;
        console.log("保存配置如下：")
        console.log(this.config);
        writeFileSync(savePath, JSON.stringify(this.config), { encoding: "utf-8" });
    }

    onBeforeBuild(platform: string) {
        this.readConfig();
        console.log(LOG_NAME, `是否启用自动压缩:${this.config.enabled},开始构建,构建平台:${platform}`);
    }

    onAfterBuild(dest: string, platform: string) {
        this.readConfig();
        console.log(LOG_NAME, `是否启用自动压缩:${this.config.enabled},构建完成,构建目录:${dest},构建平台:${platform}`);
        if (this.config.enabled) {

        }
    }

    /**@description 手动压缩 */
    onStartCompress() {
        let nodeJs = this.config.nodejs;
        let gulpPath = join(__dirname,"../node_modules/gulp/bin/gulp.js");
        gulpPath = normalize(gulpPath)
        let command = `${nodeJs} ${gulpPath} copy`;
        command  = command.replace(/\\/g,"/")
        console.log(command);
        
        exec(command,(err,stdout,stderr)=>{
            console.log("err",err);
            console.log("stdout",stdout);
            console.log("stderr",stderr);
        });
    }
}

export const helper = new Helper();