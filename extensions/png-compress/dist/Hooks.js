"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onAfterBuildAssets = exports.onBeforeBuildAssets = exports.onAfterInit = exports.onBeforeInit = exports.onBeforeBuild = exports.unload = exports.load = void 0;
const PACKAGE_NAME = 'png-compress';
function load() {
    console.log(`[${PACKAGE_NAME}] Load in builder.`);
}
exports.load = load;
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload in builder.`);
}
exports.unload = unload;
async function onBeforeBuild(options, result) {
    Editor.Message.send(PACKAGE_NAME, "log", `开始构建,构建平台:${options.platform}`);
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuild`);
}
exports.onBeforeBuild = onBeforeBuild;
async function onBeforeInit(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeInit`);
}
exports.onBeforeInit = onBeforeInit;
async function onAfterInit(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterInit`);
}
exports.onAfterInit = onAfterInit;
async function onBeforeBuildAssets(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuildAssets`);
}
exports.onBeforeBuildAssets = onBeforeBuildAssets;
async function onAfterBuildAssets(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuildAssets`);
}
exports.onAfterBuildAssets = onAfterBuildAssets;
async function onBeforeCompressSettings(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeCompressSettings`);
}
exports.onBeforeCompressSettings = onBeforeCompressSettings;
async function onAfterCompressSettings(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterCompressSettings`);
}
exports.onAfterCompressSettings = onAfterCompressSettings;
async function onAfterBuild(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuild`);
    Editor.Message.send(PACKAGE_NAME, "onAfterBuild", result.dest, options.platform);
}
exports.onAfterBuild = onAfterBuild;
