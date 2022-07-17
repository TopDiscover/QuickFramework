import { CmdType } from "./core/Defines";
import { Environment } from "./core/Environment";
import { Helper } from "./Helper"

async function main() {

    let argv: string[] = [];
    for (let i = 0; i < process.argv.length; i++) {
        if (i > 1) {
            argv.push(process.argv[i]);
        }
    }

    Environment.isTools = true;

    // 如果需要使用Gulp 请先编译代码
    // argv.push(CmdType.Gulp);

    console.log(`输入参数为 : `,argv);
    if (argv.length <= 0) {
        await Helper.instance.gitBundles();
        await Helper.instance.symlinkSyncCode();
    }
    else{

        let type = argv.shift();
        while(type){
            if ( type == CmdType.GitBundles){
                await Helper.instance.gitBundles();
            }else if ( type == CmdType.Sync){
                await Helper.instance.symlinkSyncCode();
            }else if( type == CmdType.Extensions){
                await Helper.instance.symlinkSyncExtensions();
            }else if ( type == CmdType.FixEngine ){
                await Helper.instance.fixEngine();
            }else if ( type == CmdType.Gulp){
                await Helper.instance.gulp();
            }else if( type == CmdType.LinkGulp){
                await Helper.instance.linkGulp();
            }
            type = argv.shift();
        }
    }

}
main();