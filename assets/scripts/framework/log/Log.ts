/**
 * @description 日志封装
 */

import { js, sys } from "cc";
import { DEBUG } from "cc/env";

export enum LogLevel {
    LOG = 0X00000001,
    DUMP = 0X00000010,
    WARN = 0X00000100,
    ERROR = 0X00001000,
    ALL = LOG | DUMP | WARN | ERROR,
}

let _window: any = window;
let _cc = _window["cc"];
class _Log {
    /**@description 当前日志等级 */
    private _level: number = LogLevel.ALL;
    /**@description 是否强制开户日志,如在非debug模式下，需要显示日志 */
    private _forceShowLog: boolean = false;
    /**@description 使用系统默认日志，还是自定义日志 */
    private isUsingCustom = false;
    public get logLevel(): number {
        return this._level;
    }
    public set logLevel(value: number) {
        this._level = value;
        this.bindLogHandler();
    }

    public get forceNativeLog(): boolean {
        return this._forceShowLog;
    }
    public set forceNativeLog(value: boolean) {
        this._forceShowLog = value;
    }

    private get isDebug() {
        if (sys.isNative && this.forceNativeLog) {
            return true;
        }
        return DEBUG;
    }

    private bindLogHandler() {
        if (sys.isMobile) {
            console.log("--------isMobile-----------");
            this.isUsingCustom = true;
        }
        else {
            console.log(`--------other------os-----${sys.os}`);
            console.log(`isdebug : ${DEBUG}`);
            this.isUsingCustom = false; 
        }

        _window.dump = this.dump.bind(this);
        _window.log = this.log.bind(this);
        _window.warn = this.warn.bind(this);
        _window.error = this.error.bind(this);
    }

    private canDo(type: number) {
        //的调试状态且日志等级开放
        if ((this.logLevel & type) && this.isDebug) {
            return true;
        }
        return false;
    }

    private do(func: Function, head: string, args: any) {
        func.call(_Log, `${this.getDateString()} ${head} : ` + js.formatStr.apply(_Log, args), this.stack());
    }
    private doOrigin(func: Function, params: any) {
        let message = params[0];
        let args: any[] | null = null;
        for (let i = 1; i < params.length; i++) {
            if (args == null) {
                args = [];
            }
            args.push(params[i]);
        }
        if (args) {
            func.call(_cc, message, ...args);
        } else {
            func.call(_cc, message);
        }
    }

    private log() {
        if (this.canDo(LogLevel.LOG)) {
            if (this.isUsingCustom) {
                this.do(console.log || _cc.log, "INFO", arguments);
            } else {
                this.doOrigin(_cc.log,arguments);
            }
        }
    }

    private dump() {
        if (this.canDo(LogLevel.DUMP)) {
            let ret = this._dump(arguments[0], arguments[1], arguments[2], arguments[4]);
            this.do(console.info || _cc.log, "DUMP", [ret]);
        }
    }

    private warn() {
        if (this.canDo(LogLevel.WARN)) {
            if (this.isUsingCustom) {
                this.do(console.warn || _cc.warn, "WARN", arguments);
            } else {
                this.doOrigin(_cc.warn,arguments);
            }
        }
    }

    private error() {
        if (this.canDo(LogLevel.ERROR)) {
            if (sys.isNative) {
                try {
                    if (this.isUsingCustom) {
                        this.do(console.log || _cc.log, "ERROR", arguments);
                    } else {
                        this.doOrigin(_cc.log,arguments);
                    }
                } catch (error) {
                    console.log(`---error---`);
                    console.error(error);
                }
            } else {
                if (this.isUsingCustom) {
                    this.do(console.error || _cc.error, "ERROR", arguments);
                } else {
                    this.doOrigin(_cc.error,arguments);
                }
            }
        }
    }

    private getDateString() {
        var d = new Date();
        var str = d.getHours() + "";
        var timeStr = "";
        timeStr += (str.length === 1 ? ("0" + str) : str) + ":";

        str = d.getMinutes() + "";
        timeStr += (str.length === 1 ? ("0" + str) : str) + ":";

        str = d.getSeconds() + "";
        timeStr += (str.length === 1 ? ("0" + str) : str) + ".";

        str = d.getMilliseconds() + "";
        if (str.length === 1) str = "00" + str;
        if (str.length === 2) str = "0" + str;
        timeStr += str;

        timeStr = '[' + timeStr + ']';

        return timeStr;
    }

    private stack() {
        var e = new Error();
        var lines = e.stack?.split("\n") as string[];
        lines.shift();
        var result: any[] = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });
        if (result.length > 2) {
            let temp = "\n" + JSON.stringify(result[2]);
            return temp;
        } else {
            let temp = "";
            return temp;
        }
    }


    private _dump(var_value: any, var_name: string = "unkown_dump_name", level: number = 10, indent_by: number = 0): string {
        if (level < 0) {
            return "..."
        }
        indent_by = indent_by + 3;
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
                for (let d = 0; d < indent_by; ++d) {
                    indent += ' ';
                }
                out = "Array(" + num_elem + ") " + (indent.length === 0 ? '' : '') + "[";
                for (let i = 0; i < num_elem; ++i) {
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + i + "] = " + self._dump(v[i], '', level-1, indent_by);
                }
                out += "\n" + (indent.length === 0 ? '' : '' + indent + '') + "]";
                return out;
            } else if (v instanceof Object) {
                for (let d = 0; d < indent_by; ++d) {
                    indent += ' ';
                }
                out = "{";
                for (let p in v) {
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + p + "] = " + self._dump(v[p], '', level-1, indent_by);
                }
                out += "\n" + (indent.length === 0 ? '' : '' + indent + '') + "}";
                return out;
            } else {
                return 'Unknown Object Type!';
            }
        };
        var_name = typeof var_name === 'undefined' ? '' : var_name;
        let out = '';
        let v_name = '';
        switch (typeof var_value) {
            case "boolean":
                v_name = var_name.length > 0 ? var_name + ' = ' : '';
                out += v_name + do_boolean(var_value);
                break;
            case "number":
                v_name = var_name.length > 0 ? var_name + ' = ' : '';
                out += v_name + do_number(var_value);
                break;
            case "string":
                v_name = var_name.length > 0 ? var_name + ' = ' : '';
                out += v_name + do_string(var_value);
                break;
            case "object":
                v_name = var_name.length > 0 ? var_name + ' => ' : '';
                out += v_name + do_object(var_value);
                break;
            case "function":
                v_name = var_name.length > 0 ? var_name + ' = ' : '';
                out += v_name + "Function";
                break;
            case "undefined":
                v_name = var_name.length > 0 ? var_name + ' = ' : '';
                out += v_name + "Undefined";
                break;
            default:
                out += v_name + ' is unknown type!';
        }
        return out;
    }
}

export let Log = new _Log();
