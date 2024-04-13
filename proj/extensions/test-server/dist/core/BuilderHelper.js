"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Config_1 = __importDefault(require("./Config"));
const Environment_1 = require("./Environment");
class BuilderHelper extends Config_1.default {
    constructor() {
        super(...arguments);
        this.defaultData = Environment_1.Environment.build;
    }
    static get instance() {
        return this._instance || (this._instance = new BuilderHelper);
    }
    get path() {
        return (0, path_1.join)(this.configPath, `builder_cache.json`);
    }
}
BuilderHelper._instance = null;
exports.default = BuilderHelper;
