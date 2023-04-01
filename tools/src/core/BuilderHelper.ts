import { join } from "path";
import Config from "./Config";
import { BuilderOptions } from "./Defines";
import { Environment } from "./Environment";

export default class BuilderHelper extends Config<BuilderOptions>{

    private static _instance: BuilderHelper = null!;
    static get instance() {
        return this._instance || (this._instance = new BuilderHelper);
    }

    readonly defaultData = Environment.build;

    get path() {
        return join(this.configPath, `builder_cache.json`);
    }


}