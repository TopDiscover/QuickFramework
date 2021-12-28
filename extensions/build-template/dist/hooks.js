"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onAfterBuildAssets = exports.onBeforeBuildAssets = exports.onAfterInit = exports.onBeforeInit = exports.onBeforeBuild = exports.unload = exports.load = void 0;
const PACKAGE_NAME = 'build-template';
function load() {
    console.log(`[${PACKAGE_NAME}] Load in builder.`);
}
exports.load = load;
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload in builder.`);
}
exports.unload = unload;
function onBeforeBuild(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuild`);
    });
}
exports.onBeforeBuild = onBeforeBuild;
function onBeforeInit(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onBeforeInit`);
    });
}
exports.onBeforeInit = onBeforeInit;
function onAfterInit(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onAfterInit`);
    });
}
exports.onAfterInit = onAfterInit;
function onBeforeBuildAssets(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onBeforeBuildAssets`);
    });
}
exports.onBeforeBuildAssets = onBeforeBuildAssets;
function onAfterBuildAssets(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onAfterBuildAssets`);
    });
}
exports.onAfterBuildAssets = onAfterBuildAssets;
function onBeforeCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onBeforeCompressSettings`);
    });
}
exports.onBeforeCompressSettings = onBeforeCompressSettings;
function onAfterCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] =====>> onAfterCompressSettings`);
    });
}
exports.onAfterCompressSettings = onAfterCompressSettings;
function onAfterBuild(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.platform == "android" || options.platform == "ios" || options.platform == "mac" || options.platform == "windows") {
            Editor.Message.send("hotupdate", "insertHotupdateCode", result.dest);
        }
        console.log(`[${PACKAGE_NAME}] =====>> onAfterBuild`);
    });
}
exports.onAfterBuild = onAfterBuild;
