import { readFileSync } from "fs";
import { CmdType, CustomSyncData } from "./core/Defines";
import { Environment } from "./core/Environment";
import { Helper } from "./Helper"
import FileUtils from "./core/FileUtils";

async function main() {

    let argv: string[] = [];
    for (let i = 0; i < process.argv.length; i++) {
        if (i > 1) {
            argv.push(process.argv[i]);
        }
    }

    Environment.isCommand = true;

    // 如果需要使用Gulp 请先编译代码
    // argv.push(CmdType.Gulp);
    // argv.push(CmdType.Assets);
    // argv.push(CmdType.Pngquant);
    // argv.push(CmdType.FixEngine);
    // argv.push(CmdType.Hotupdate);

    let doProcess = async (isGod = false) => {
        if (isGod) {
            await Helper.instance.gitBundles();
            await Helper.instance.gitResources();
            await Helper.instance.gitPrivate();
            await Helper.instance.symlinkSyncBundles();
            await Helper.instance.symlinkSyncResources();
            await Helper.instance.symlinkSyncPrivate();
            await Helper.instance.symlinkSyncExtensions();
        } else {
            await Helper.instance.gitBundles();
            await Helper.instance.gitResources();
            await Helper.instance.symlinkSyncBundles();
            await Helper.instance.symlinkSyncResources();
            await Helper.instance.symlinkSyncExtensions();
        }
    }

    console.log(`输入参数为 : `, argv);
    if (argv.length <= 0) {
        await doProcess();
    }
    else {

        let type = argv.shift();
        while (type) {
            if (type == CmdType.GitBundles) {
                await Helper.instance.gitBundles();
            } else if (type == CmdType.Sync) {
                await Helper.instance.symlinkSyncBundles();
                await Helper.instance.symlinkSyncResources();
            } else if (type == CmdType.Extensions) {
                await Helper.instance.symlinkSyncExtensions();
            } else if (type == CmdType.FixEngine) {
                await Helper.instance.fixEngine();
            } else if (type == CmdType.Gulp) {
                await Helper.instance.gulp();
            } else if (type == CmdType.LinkGulp) {
                await Helper.instance.linkGulp();
            } else if (type == CmdType.Assets) {
                await Helper.instance.getAssets();
            } else if (type == CmdType.Pngquant) {
                await Helper.instance.pngCompress();
            } else if (type == CmdType.Hotupdate) {
                await Helper.instance.hotupdate();
            } else if (type == CmdType.God) {
                await doProcess(true);
            } else if (type == CmdType.ProtobufJS) {
                await Helper.instance.installProtobufJS();
            } else if (type == CmdType.CustomSync) {
                let jsonPath = argv.shift();
                if (jsonPath) {
                    let syncDataStr = readFileSync(jsonPath, "utf-8");
                    let syncData : CustomSyncData = JSON.parse(syncDataStr);
                    Helper.instance.symlinkSync(syncData.data,syncData.tag);
                    FileUtils.instance.delFile(jsonPath);
                } else {
                    console.error(`自定义同步参数错误`)
                    break;
                }
            }
            type = argv.shift();
        }
    }
}
main();