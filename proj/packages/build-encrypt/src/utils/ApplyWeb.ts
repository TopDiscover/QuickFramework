import { writeFileSync,readFileSync,unlinkSync,copyFile,existsSync,readdirSync,statSync} from "fs";
import path from "path";
import { Common } from "./Common";

/**web代码处理 */
export class ApplyWeb extends Common{
    /**文件前缀 */
    private encriptSign = "";

    /**加密key */
    private encriptKey = "";

    /**构建路径 */
    private buildFloderPath = "";

    constructor(_encriptSign : string, _encriptKey:string,_buildFloderPath : string){
        super();
        this.encriptSign = _encriptSign
        this.encriptKey = _encriptKey
        this.buildFloderPath = _buildFloderPath
        this.copyHelper();
        this.copyHtml();
    }

    private copyHelper() {
        let fromPath = Editor.url("packages://build-encrypt/process/web_downloader.js","utf-8");
        let toPath = path.join(this.buildFloderPath,"assets","web_downloader.js");
        copyFile(fromPath,toPath,function (err) {
            if(err){
                Editor.error("复制web_downloader.js出错")
            }
        });
    }

    private searthDir(dirName:string,callback:any){
        if (!existsSync(dirName)) {
            Editor.log(`${dirName} 目录不存在`)
            return
        }
        let files = readdirSync(dirName);
        files.forEach((fileName) => {
            let filePath = path.join(dirName, fileName.toString());
            let stat = statSync(filePath);
            if (stat.isDirectory()) {
                this.searthDir(filePath,callback);
            } else {
                callback(fileName,filePath)
            }
        });
    }

    /**修改index.html */
    private copyHtml() {
        let mainJsName = "main.js"
        let settingJsName = "settings.js"
        let physicsJsName = "physics-min.js"
        let cocos2dJsName = "cocos2d-js-min.js"
        let styleDesktopName = "style-desktop.css"
        let styleMobileName = "style-mobile.css"
        let splashName = "splash.png"
        let icoName = "favicon.ico"
        this.searthDir(this.buildFloderPath,function (fileName : string,path: string) {
            if(/main\.([0-9 a-z]|\.)*js/.test(fileName)){
                mainJsName = fileName;
            }else if(/physics(-min)?\.([0-9 a-z]|\.)*js/.test(fileName)){
                physicsJsName = fileName;
            }else if(/settings\.([0-9 a-z]|\.)*js/.test(fileName)){
                settingJsName = fileName;
            }else if(/cocos2d-js(-min)?\.([0-9 a-z]|\.)*js/.test(fileName)){
                cocos2dJsName = fileName;
            }else if(/style-desktop\.([0-9 a-z]|\.)*css/.test(fileName)){
                styleDesktopName = fileName;
            }else if(/style-mobile\.([0-9 a-z]|\.)*css/.test(fileName)){
                styleMobileName = fileName;
            }else if(/favicon\.([0-9 a-z]|\.)*ico/.test(fileName)){
                icoName = fileName;
            }else if(/splash\.([0-9 a-z]|\.)*png/.test(fileName)){
                splashName = fileName;
            }
        })

        let fromPath = Editor.url("packages://build-encrypt/process/template_web_index.html","utf-8");
        let toPath = path.join(this.buildFloderPath,"index.html");

        let htmlStr = readFileSync(fromPath,"utf-8");
        htmlStr = htmlStr.replace('hyz.register_decripted_downloader(tmp_encriptSign,tmp_encriptKey);',`hyz.register_decripted_downloader('${this.encriptSign}','${this.encriptKey}');`)
        htmlStr = htmlStr.replace("main.js",mainJsName)
        htmlStr = htmlStr.replace("settings.js",settingJsName)
        if(physicsJsName.includes("min")){
            htmlStr = htmlStr.replace("physics-min.js",physicsJsName)
        }else{
            htmlStr = htmlStr.replace("physics.js",physicsJsName)
        }
        if(cocos2dJsName.includes("min")){
            htmlStr = htmlStr.replace("cocos2d-js-min.js",cocos2dJsName)
        }else{
            htmlStr = htmlStr.replace("cocos2d-js.js",cocos2dJsName)
        }
        
        
        htmlStr = htmlStr.replace("style-desktop.css",styleDesktopName)
        htmlStr = htmlStr.replace("favicon.ico",icoName)
        htmlStr = htmlStr.replace("style-mobile.css",styleMobileName)
        htmlStr = htmlStr.replace("splash.png",splashName)
        // Editor.log(htmlStr)
        writeFileSync(toPath,htmlStr)
    }
}