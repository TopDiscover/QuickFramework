import fs from "fs";
import path from "path";
import { CocosProjectConfig } from "../cosos/CocosProjectConfig";

export class TaskConfig {
    /**
     * 构建输出目录的平台路径
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link
     */
    buildOutputDirPath: string;

    /**
     * 构建输出目录的项目配置
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/.cocos-project.json
     */
    buildOutputCocosProjectJsonFilePath: string;

    /**
     * 构建输出目录的资源目录
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/res
     */
    buildOutputResDirPath: string;

    /**
     * 构建输出目录的 main.js
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/main.js
     */
    buildOutputMainJsFilePath: string;

    /**
     * 插件脚本输出路径
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/src/assets/loaderplugin.js
     */
    buildOutputLoaderPluginJsFilePath: string;

    /**
     * 插件脚本输入路径
     *
     * e.g.
     *
     * ./loaderplugin.js
     */
    inputLoaderPluginJsFilePath: string;

    /**
     * Cocos 项目配置
     */
    cocosProject: CocosProjectConfig | undefined;

    constructor() {
        // console.log("当前执行文件所在目录路径", __dirname);
        // console.log("当前执行文件绝对路径", __filename);
        console.log("当前执行node命令的目录路径", process.cwd());///Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt
        console.log("可执行文件路径", process.argv[0]);///Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/node_modules/.bin/ts-node
        console.log("将执行的脚本路径", process.argv[1]);///Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/src/index.ts
        console.log("传入参数", process.argv.slice(2));//'/Users/kevin/Downloads/xyx/lgc/build/web-mobile'

        this.buildOutputDirPath = path.join(process.argv[2], "");
        this.buildOutputCocosProjectJsonFilePath = path.join(this.buildOutputDirPath, ".cocos-project.json");//Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/build/web-mobile/.cocos-project.json
        this.buildOutputResDirPath = path.join(this.buildOutputDirPath, "assets");//Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/build/web-mobile/assets
        this.buildOutputMainJsFilePath = path.join(this.buildOutputDirPath, "main.34d4a.js");//Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/build/web-mobile/main.d0b68.js
        this.buildOutputLoaderPluginJsFilePath = path.join(this.buildOutputDirPath, "src/loaderplugin.js");//Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/build/web-mobile/src/assets/loaderplugin.js
        this.inputLoaderPluginJsFilePath = path.join(path.dirname(process.argv[1]), "loaderplugin.js");///Users/kevin/Downloads/xyx/CocosCreator-Build-Encrypt/src/loaderplugin.js


        if (fs.existsSync(this.buildOutputCocosProjectJsonFilePath)) {
            this.cocosProject = new CocosProjectConfig().fromJson(JSON.parse(fs.readFileSync(this.buildOutputCocosProjectJsonFilePath).toString()));
        }

        console.log("初始化项目配置");
        console.log(this);
    }
}
