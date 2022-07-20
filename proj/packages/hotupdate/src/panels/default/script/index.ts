import { readFileSync } from 'fs';
import { join } from 'path';
import { BundleInfo } from '../../../core/Defines';
import { helper } from '../../../Helper';

interface MyView {
    $logArea: HTMLTextAreaElement;
    shadowRoot: any;
}

interface MyVue {
    /**@description 各bundle的版本配置 */
    bundles: { [key: string]: BundleInfo },
    /**@description 主包版本号 */
    version: string,
    /**@description 当前服务器地址 */
    serverIP: string,
    /**@description 服务器历史地址 */
    hotupdateUrls: string[],
    /**@description 构建项目目录 */
    buildDir: string,
    /**@description 构建项目输出目录 */
    buildOutDir: string,
    /**@description 远程服务器地址 */
    remoteVersion: string,
    /**@description 远程服务器所在目录 */
    remoteDir: string,
    /**@description 远程各bundle的版本配置 */
    remoteBundles: { [key: string]: BundleInfo },
    /**@description 进度 */
    progress: number;
    /**@description 创建进度 */
    createProgress: number;
    onInputUrlOver(event: { target: HTMLInputElement } | string): void;
}
let vueView: MyVue = null!;
module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {

    },
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            helper.removeNotInApkBundle();
        },
        "hotupdate:updateDeployProgress"(sender: any, value: number) {
            vueView.progress = value;
        },
        "hotupdate:setBuildDir"(sender: any, dest: string) {
            vueView.buildDir = dest;
            vueView.buildOutDir = helper.getManifestDir(dest)
        },
        "hotupdate:updateCreateProgress"(sender: any, value: number) {
            vueView.createProgress = value;
        },
        onPngCompressComplete(sender: any, info: { dest: string, platform: string }) {
            let dest = info.dest;
            let platform = info.platform;
            helper.logger.log(`${helper.module}png图片压缩完成,构建平台:`, dest, platform);
            if ( helper.isSupportUpdate(platform) ) {
                helper.onPngCompressComplete();
            }
        }
    },
    ready() {
        helper.read(true);
        let self: MyView = this as any;
        const vm = new window.Vue({
            data() {
                return {
                    bundles: helper.data!.bundles,
                    version: helper.data!.version,
                    serverIP: helper.data!.serverIP,
                    hotupdateUrls: helper.data!.historyIps,
                    buildDir: helper.data!.buildDir,
                    buildOutDir: helper.getManifestDir(helper.data!.buildDir),
                    remoteVersion: helper.remoteVersion,
                    remoteDir: helper.data!.remoteDir,
                    remoteBundles: helper.remoteBundles,
                    includes: helper.data!.includes,
                    autoCreate: helper.data!.autoCreate,
                    autoDeploy: helper.data!.autoDeploy,
                    progress: 0,
                    createProgress: 0,
                };
            },
            methods: {
                onChangeIncludes(value: boolean, key: string) {
                    if (helper.data!.includes[key].isLock) {
                        helper.logger.warn(`${helper.module}${key}已经被锁定，修改无效`);
                        return;
                    }
                    helper.data!.includes[key].include = value;
                    helper.save();
                    helper.updateToConfigTS();
                },
                onChangeAutoCreateManifest(value: boolean) {
                    helper.data!.autoCreate = value;
                    helper.save();
                },
                onChangeAutoDeploy(value: boolean) {
                    helper.data!.autoDeploy = value;
                    helper.save();
                },
                onRefreshMainVersion() {
                    let view: MyVue = this as any;
                    view.remoteVersion = helper.getVersion();
                },
                onRefreshVersion(dir: string) {
                    let view: MyVue = this as any;
                    view.remoteBundles[dir].md5 = helper.getVersion(dir);
                },
                onDeployToRemote() {
                    helper.deployToRemote();
                },
                onRemoteDirConfirm(dir: string) {
                    if ( helper.isDoing) return;
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器路径",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        let view: MyVue = this as any;
                        helper.data!.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        helper.save();
                    }
                },
                onOpenRemoteDir() {
                    let view: MyVue = this as any;
                    helper.openDir(view.remoteDir);
                },
                onChangeBundleVersion(version: string, dir: string) {
                    helper.data!.bundles[dir].version = version;
                    helper.save();
                },
                onChangeIncludeApk(value: boolean, dir: string) {
                    helper.data!.bundles[dir].includeApk = value;
                    helper.save();
                },
                onDelBunles() {
                    helper.onDelBundles();
                },
                onCreateManifest() {
                    helper.createManifest();
                },
                onInsertHotupdate() {
                    helper.insertHotupdate(helper.data!.buildDir);
                },
                onBuildDirConfirm(url: string) {
                    if ( helper.isDoing ) return;
                    let view: MyVue = this as any;
                    let result = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        if (helper.checkBuildDir(fullPath)) {
                            helper.data!.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = helper.getManifestDir(helper.data!.buildDir);
                            helper.save();
                        }
                    }
                },
                onInputVersionOver(version: string) {
                    if (helper.isDoing) {
                        return;
                    }
                    let view: MyVue = this as any;
                    view.version = version;
                    helper.data!.version = view.version;
                    helper.save();
                },
                onInputUrlOver(inputUrl: string) {
                    if (helper.isDoing) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        helper.logger.log(helper.module + url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }

                    helper.data!.serverIP = url;
                    let view: MyVue = this as any;
                    view.serverIP = url;
                    if (helper.addHotAddress(url)) {
                        view.hotupdateUrls = helper.data!.historyIps;
                    }
                    helper.save();
                    helper.updateToConfigTS();
                },
                onChangeHotupdateUrls(url: string) {
                    let view: MyVue = this as any;
                    view.onInputUrlOver(url);
                },
                onUserLocalIP() {
                    if (helper.isDoing) return;
                    let network = require("os").networkInterfaces();
                    let url = "";
                    Object.keys(network).forEach((key) => {
                        network[key].forEach((info: any) => {
                            if (info.family == "IPv4" && !info.internal) {
                                url = info.address;
                            }
                        });
                    });
                    if (url.length > 0) {
                        url = "http://" + url + "/hotupdate";
                    }
                    let view: MyVue = this as any;
                    view.onInputUrlOver(url);
                },
                onOpenBulidDir() {
                    let view: MyVue = this as any;
                    helper.openDir(view.buildDir);
                },
                onOpenBulidOutDir() {
                    let view: MyVue = this as any;
                    helper.openDir(view.buildOutDir);
                }
            },
            created: function () {
                vueView = this as any;
            },
            mounted: function () {

            },
            el: self.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});
