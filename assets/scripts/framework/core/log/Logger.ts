/**
 * @description 日志封装
 */
import { LogLevel } from "../../defines/Enums";

export class LoggerImpl {
    private static _instance: LoggerImpl = null!;
    public static Instance() { return this._instance || (this._instance = new LoggerImpl()); }
    private logger : Logger = console as any;
    private _level: number = LogLevel.ALL;
    constructor(){
        this.update();
    }
    /**@description 当前日志等级 */
    public get level(){
        return this._level;
    }
    public set level( level ){
        this._level = level;
        this.update();
    }

    /**
     * @description 附加日志输出类型
     * @param level 
     */
    public attach( level : LogLevel ){
        if ( this.isValid(level) ){
            return;
        }
        this.level = this.level | level;
        this.update();
    }

    /**
     * @description 分离日志输出类型
     **/
    public detach( level : LogLevel ){
        if ( this.isValid(level) ){
            this.level = this.level ^ level;
            this.update();
        }
    }

    /**@description 当前日志等级是否生效 */
    public isValid( level : LogLevel ){
        if ( this.level & level ){
            return true;
        }
        return false;
    }

    /**@description 更新日志 */
    private update(){
        if ( this.isValid(LogLevel.DUMP) ){
            if ( cc.sys.isBrowser ){
                this.logger.dump = console.log;
            }else{
                this.logger.dump = this.dump.bind(this);
            }
        }else{
            this.logger.dump = ()=>{}
        }
        if ( this.isValid(LogLevel.ERROR) ){
            this.logger.e = console.error;
        }else{
            this.logger.e = ()=>{};
        }
        if ( this.isValid(LogLevel.DEBUG) ){
            this.logger.d = console.log;
            if ( CC_EDITOR ){
                this.logger.d = cc.log;
            }
        }else{
            this.logger.d = ()=>{};
        }
        if ( this.isValid(LogLevel.WARN) ){
            this.logger.w = console.warn;
        }else{
            this.logger.w = ()=>{};
        }
    }

    private dump() {
        if (this.isValid(LogLevel.DUMP)) {
            let ret = this._dump(arguments[0], arguments[1], arguments[2], arguments[4]);
            this.logger.d(ret);
        }
    }

    private _dump(data: any, name: string = "unkown", level: number = 10, deep: number = 0): string {
        if (level < 0) {
            return "..."
        }
        deep = deep + 3;
        let self = this;
        let do_boolean = function (v: boolean) {
            return 'Boolean(1) ' + (v ? 'TRUE' : 'FALSE');
        };
        let do_number = function (v: number) {
            return v;
        };
        let do_string = function (v: string) {
            return '"' + v + '"';
        };
        let do_object = function (v: any) {
            if (v === null) {
                return "NULL(0)";
            }
            let out = '';
            let num_elem = 0;
            let indent = '';

            if (v instanceof Array) {
                num_elem = v.length;
                for (let d = 0; d < deep; ++d) {
                    indent += ' ';
                }
                out = "Array(" + num_elem + ") " + (indent.length === 0 ? '' : '') + "[";
                for (let i = 0; i < num_elem; ++i) {
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + i + "] = " + self._dump(v[i], '', level-1, deep);
                }
                out += "\n" + (indent.length === 0 ? '' : '' + indent + '') + "]";
                return out;
            } else if (v instanceof Object) {
                for (let d = 0; d < deep; ++d) {
                    indent += ' ';
                }
                out = "{";
                for (let p in v) {
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + p + "] = " + self._dump(v[p], '', level-1, deep);
                }
                out += "\n" + (indent.length === 0 ? '' : '' + indent + '') + "}";
                return out;
            } else {
                return 'Unknown Object Type!';
            }
        };
        name = typeof name === 'undefined' ? '' : name;
        let out = '';
        let v_name = '';
        switch (typeof data) {
            case "boolean":
                v_name = name.length > 0 ? name + ' = ' : '';
                out += v_name + do_boolean(data);
                break;
            case "number":
                v_name = name.length > 0 ? name + ' = ' : '';
                out += v_name + do_number(data);
                break;
            case "string":
                v_name = name.length > 0 ? name + ' = ' : '';
                out += v_name + do_string(data);
                break;
            case "object":
                v_name = name.length > 0 ? name + ' => ' : '';
                out += v_name + do_object(data);
                break;
            case "function":
                v_name = name.length > 0 ? name + ' = ' : '';
                out += v_name + "Function";
                break;
            case "undefined":
                v_name = name.length > 0 ? name + ' = ' : '';
                out += v_name + "Undefined";
                break;
            default:
                out += v_name + ' is unknown type!';
        }
        return out;
    }
}
