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

    console.log(`输入参数为 : `, argv);

    let type = argv.shift();
    while (type) {
        if (type == CmdType.GitBundles) {
            await Helper.instance.gitBundles();
        } else if (type == CmdType.GitResources) {
            await Helper.instance.gitResources();
        } else if (type == CmdType.GitPrivate) {
            await Helper.instance.gitPrivate();
        } else if (type == CmdType.SyncPrivate) {
            await Helper.instance.symlinkSyncPrivate();
        } else if (type == CmdType.SyncBundles) {
            await Helper.instance.symlinkSyncBundles();
        } else if (type == CmdType.SyncResources) {
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
        } else if (type == CmdType.ProtobufJS) {
            await Helper.instance.installProtobufJS();
        } else if (type == CmdType.CustomSync) {
            let jsonPath = argv.shift();
            if (jsonPath) {
                let syncDataStr = readFileSync(jsonPath, "utf-8");
                let syncData: CustomSyncData = JSON.parse(syncDataStr);
                Helper.instance.symlinkSync(syncData.data, syncData.tag, syncData.fromRoot, syncData.toRoot);
                FileUtils.instance.delFile(jsonPath);
            } else {
                console.error(`自定义同步参数错误`)
                break;
            }
        }
        type = argv.shift();
    }
}
main();