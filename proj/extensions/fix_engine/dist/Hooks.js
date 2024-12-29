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
const PACKAGE_NAME = 'fix_engine';
function load() {
    console.log(`[${PACKAGE_NAME}] Load in builder.`);
}
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload in builder.`);
}
async function onBeforeBuild(options, result) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuild`);
    Editor.Message.send(PACKAGE_NAME, "onBeforeBuild", options);
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
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuild`);
}
