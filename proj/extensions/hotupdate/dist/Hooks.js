"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = load;
exports.unload = unload;
exports.onBeforeBuild = onBeforeBuild;
exports.onBeforeInit = onBeforeInit;
exports.onAfterInit = onAfterInit;
exports.onBeforeBuildAssets = onBeforeBuildAssets;
exports.onAfterBuildAssets = onAfterBuildAssets;
exports.onBeforeCompressSettings = onBeforeCompressSettings;
exports.onAfterCompressSettings = onAfterCompressSettings;
exports.onAfterBuild = onAfterBuild;
const PACKAGE_NAME = 'hotupdate';
function load() {
    console.log(`[${PACKAGE_NAME}] Load in builder.`);
}
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload in builder.`);
}
async function onBeforeBuild(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuild`);
    const platform = options.platform;
    if (platform == "android" || platform == "ios" || platform == "mac" || platform == "windows") {
        if (options.md5Cache) {
            throw new Error("md5Cache 不能为 true,否则热更新无法正常运行");
        }
    }
    Editor.Message.send(PACKAGE_NAME, "onBeforeBuild", platform);
}
async function onBeforeInit(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeInit`);
}
async function onAfterInit(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterInit`);
}
async function onBeforeBuildAssets(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuildAssets`);
}
async function onAfterBuildAssets(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuildAssets`);
}
async function onBeforeCompressSettings(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeCompressSettings`);
}
async function onAfterCompressSettings(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterCompressSettings`);
}
async function onAfterBuild(options, result) {
    Editor.Message.send(PACKAGE_NAME, "onAfterBuild", result.dest, options.platform);
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuild`);
}
