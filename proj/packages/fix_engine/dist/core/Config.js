"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Handler_1 = require("./Handler");
class Config extends Handler_1.Handler {
    get data() {
        return this._data;
    }
    set data(v) {
        this._data = v;
    }
    /**@description 配置文件路径 */
    get path() {
        return "";
    }
    constructor() {
        super();
        /**@description 配置数据 */
        this._data = null;
        /**@description 默认配置 */
        this.defaultData = null;
    }
    /**
     * @description 读取数据
     * @param isReload 是否重新加载数据，默认为 false
     */
    read(isReload = false) {
        if (this.path) {
            if (!isReload && this._data) {
                return;
            }
            if ((0, fs_1.existsSync)(this.path)) {
                let data = (0, fs_1.readFileSync)(this.path, "utf-8");
                let source = JSON.parse(data);
                this._data = source;
            }
            else {
                if (this.defaultData) {
                    this._data = this.defaultData;
                    this.save();
                }
            }
        }
    }
    /**
     * @description 保存配置数据
     */
    save() {
        if (this.path && this.data) {
            let data = JSON.stringify(this.data);
            (0, fs_1.writeFileSync)(this.path, data, "utf-8");
            this.logger.log(`${this.module}保存【${this.path}】配置数据 : ${data}`);
        }
        else {
            this.logger.error(`${this.module}配置的路径为空`);
        }
    }
}
exports.default = Config;
