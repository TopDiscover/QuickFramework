import { IBuildResult, IBuildTaskOption } from "../@types/packages/builder/@types";

const PACKAGE_NAME = 'fix_engine'; 
export function load() {
    console.log(`[${PACKAGE_NAME}] Load in builder.`);
}

export function unload() {
    console.log(`[${PACKAGE_NAME}] Unload in builder.`);
}

export async function onBeforeBuild(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuild`);
    Editor.Message.send(PACKAGE_NAME,"onBeforeBuild",options);
}
export async function onBeforeInit(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeInit`);
}
export async function onAfterInit(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterInit`);
}
export async function onBeforeBuildAssets(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuildAssets`);
}
export async function onAfterBuildAssets(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuildAssets`);
}
export async function onBeforeCompressSettings(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onBeforeCompressSettings`);
}
export async function onAfterCompressSettings(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterCompressSettings`);
}
export async function onAfterBuild(options: IBuildTaskOption, result: IBuildResult) {
    console.log(`[${PACKAGE_NAME}] =====>> onAfterBuild`);
}