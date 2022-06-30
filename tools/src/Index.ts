import { Helper } from "./Helper";

async function main(){
    await Helper.instance.installDepends();
    await Helper.instance.gitBundles();
    await Helper.instance.symlinkSyncCode();
}
main();