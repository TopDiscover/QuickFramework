/**
 * @description 日志封装
 */

export enum LogLevel {
    LOG = 0X00000001,
    DUMP = 0X00000010,
    WARN = 0X00000100,
    ERROR = 0X00001000,
    ALL = LOG | DUMP | WARN | ERROR ,
}

class _Log {
    private _level: number = LogLevel.ALL;
    private _forceNativeLog: boolean = false;
    public get logLevel(): number {
        return this._level;
    }
    public set logLevel(value: number) {
        this._level = value;
        this.bindLogHandler();
    }

    public get forceNativeLog(): boolean {
        return this._forceNativeLog;
    }
    public set forceNativeLog(value: boolean) {
        this._forceNativeLog = value;
    }
    /**@description 是否使用附加控制台方式,强制*/
    private get isUsingConsole( ){
        let win : any = window;
        if ( win.vConsole ){
            return true;
        }
        return false;
    }

    public get isDebug( ){
        if ( this.isUsingConsole ){
            return true;
        }
        if (cc.sys.isNative && this.forceNativeLog){
            return true;
        }
        return CC_DEBUG;
    }

    private _bindLogHanler( usingCustom : boolean ){
        if (usingCustom) {
            console.log("--------using custom log--------");
            let backupcc = window["cc"];
            if (!backupcc.dump) {
                window["cc"].dump = this.dump.bind(this);
            }
            cc.log = this.log.bind(this);
            cc.warn = this.warn.bind(this);
            cc.error = this.error.bind(this);

            if ( (this.logLevel & LogLevel.LOG) && this.isDebug ){
                window["cc"].time = console.time;
                window["cc"].timeEnd = console.timeEnd;
            }else{
                window["cc"].time = this.doNothing.bind(this);
                window["cc"].timeEnd = this.doNothing.bind(this);
            }
        }
        else {
            console.log(`--------using default log--------`);

            if (this.logLevel & LogLevel.DUMP) {
                let backupcc = window["cc"];
                if (!backupcc.dump) {
                    window["cc"].dump = this.dump.bind(this);
                }
            } else {
                cc.dump = this.doNothing.bind(this);
            }

            if (this.logLevel & LogLevel.WARN) {

            } else {
                cc.warn = this.doNothing.bind(this);
            }

            if ( (this.logLevel & LogLevel.LOG) && this.isDebug ){
                window["cc"].time = console.time;
                window["cc"].timeEnd = console.timeEnd;
            }else{
                window["cc"].time = this.doNothing.bind(this);
                window["cc"].timeEnd = this.doNothing.bind(this);
            }
        }
    }

    private bindLogHandler() {
        if ( this.isUsingConsole ){
            this._bindLogHanler(true);
        }
        else{
            if (cc.sys.isMobile) {
                console.log("--------isMobile-----------");
                this._bindLogHanler(true);
            }
            else {
                console.log(`--------other------os-----${cc.sys.os}`);
                console.log(`isdebug : ${CC_DEBUG}`);
                this._bindLogHanler(false);
            }
        }
    }

    public log() {
        if (this.logLevel & LogLevel.LOG) {
            if (!this.isDebug) return;
            let backupLog = console.log || cc.log || window["log"];
            backupLog.call(_Log, `${this.getDateString()} INFO : ` + cc.js.formatStr.apply(cc, arguments), this.stack());
        }
    }

    public dump() {
        if (this.logLevel & LogLevel.DUMP) {
            if (!this.isDebug) return;
            let ret = this._dump(arguments[0], arguments[1], arguments[2], arguments[4]);
            let backupLog = console.info || cc.log || window["info"];
            backupLog.call(_Log, `${this.getDateString()} DUMP : ` + cc.js.formatStr.apply(cc, [ret]), this.stack());
        }
    }

    public warn() {
        if (this.logLevel & LogLevel.WARN) {
            if (!this.isDebug) return;
            let backupLog = console.warn || cc.warn || window["warn"];
            backupLog.call(_Log, `${this.getDateString()} WARN : ` + cc.js.formatStr.apply(cc, arguments), this.stack());
        }
    }

    public error() {
        if (this.logLevel & LogLevel.ERROR) {
            if (!this.isDebug) return;
            if ( cc.sys.isNative ){
                try {
                    let backupLog = console.log || cc.log || window["log"];
                    backupLog.call(_Log, `${this.getDateString()} ERROR : ` + cc.js.formatStr.apply(cc, arguments), this.stack());
                } catch (error) {
                    console.log(`---error---`);
                    console.error(error);
                }
            }else{
                let backupLog = console.error || cc.error || window["error"];
                backupLog.call(_Log, `${this.getDateString()} ERROR : ` + cc.js.formatStr.apply(cc, arguments), this.stack());
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
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });
        if ( result.length > 2 ){
            let temp = "\n" + JSON.stringify(result[2]);
            return temp;
        }else{
            let temp = "";
            return temp;
        }
    }


    private _dump(var_value: any, var_name: string = "unkown_dump_name", level: number = 2, indent_by: number = 0): string {
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
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + i + "] = " + self._dump(v[i], '', level, indent_by);
                }
                out += "\n" + (indent.length === 0 ? '' : '' + indent + '') + "]";
                return out;
            } else if (v instanceof Object) {
                for (let d = 0; d < indent_by; ++d) {
                    indent += ' ';
                }
                out = "{";
                for (let p in v) {
                    out += "\n" + (indent.length === 0 ? '' : '' + indent) + "   [" + p + "] = " + self._dump(v[p], '', level, indent_by);
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

    private doNothing() {

    }
}

export let Log = new _Log();
