import { Message } from "./Message";
import { Buffer } from "../../../plugin/Buffer"


type JsonMessageConstructor = typeof JsonMessage;

export function serialize(key: string, type: JsonMessageConstructor | NumberConstructor | StringConstructor | Object);
export function serialize(key: string, type: ArrayConstructor, arrayType: JsonMessageConstructor | NumberConstructor | StringConstructor);
export function serialize(key: string, type: MapConstructor, mapKeyType: NumberConstructor | StringConstructor, mapValueType: JsonMessageConstructor | NumberConstructor | StringConstructor);
export function serialize(key: string, type, arrTypeOrMapKeyType?, mapValueType?) {
    return function (target, memberName) {
        if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
            let selfSerializeInfo = {};
            if (Reflect.getPrototypeOf(target)['__serialize__']) {
                // 父类拥有序列化信息,并且自己没有序列化信息,则拷贝父类到当前类中来
                if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
                    let parentSerializeInfo = Reflect.getPrototypeOf(target)['__serialize__'];
                    let serializeKeyList = Object.keys(parentSerializeInfo);
                    for (let len = serializeKeyList.length, i = 0; i < len; i++) {
                        selfSerializeInfo[serializeKeyList[i]] = parentSerializeInfo[serializeKeyList[i]].slice(0);
                    }
                }
            }
            Reflect.defineProperty(target, '__serialize__', {
                value: selfSerializeInfo,
            });
        }
        if (target['__serialize__'][key]) {
            throw `SerializeKey has already been declared:${key}`;
        }
        target['__serialize__'][key] = [memberName, type, arrTypeOrMapKeyType, mapValueType];
    }
}

/**
 * @description JSON的序列化与序列化
 */
export abstract class JsonMessage extends Message {
    private _data = null;
    getData() { return this._data }

    encode(): boolean {
        this._data = this.serialize();
        let result = JSON.stringify(this._data);
        this._data = Buffer.from(result);
        return true;
    }

    /**@description 序列化 */
    protected serialize(): any {
        let result = {};
        let __serialize__ = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serialize__) return result;
        let serializeKeyList = Object.keys(__serialize__);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName] = __serialize__[serializeKey];
            let serializeObj = this.serializeMember(this[memberName]);
            if (null === serializeObj) {
                cc.warn("Invalid serialize member : " + memberName);
            }
            result[serializeKey] = serializeObj;
        }
        return result;
    }

    /**
     * @description 序列化成员变量
     * @param value 该成员变量的值
     * */
    private serializeMember(value: any) {
        if (typeof value == 'number') {
            return this.serializeNumber(value);
        } else if (typeof value == 'string') {
            return this.serializeString(value);
        } else if (value instanceof Array) {
            return this.serializeArray(value);
        } else if (value instanceof Map) {
            return this.serializeMap(value);
        } else if (value instanceof JsonMessage) {
            return value.serialize();
        } else if (value instanceof Object) {
            return this.serializeObject(value);
        } else {
            cc.warn("Invalid serialize value : " + value);
            return null;
        }
    }
    private serializeObject(value: Object) { return value }

    private serializeNumber(value: Number) {
        if (value === undefined || value === null) { value = 0 }
        else if (typeof value == "string") { value = Number(value) }
        if (Number.isNaN(value)) { value = 0 }
        return value;
    }

    private serializeString(value: String) {
        return (value === undefined || value === null) ? '' : value.toString();
    }

    private serializeArray(value: Array<any>) {
        let result = [];
        value.forEach(element => {
            result.push(this.serializeMember(element));
        });
        return result;
    }

    private serializeMap(value: Map<any, any>) {
        let result = [];
        let self = this;
        value.forEach((value, key) => {
            let serVal = { k: self.serializeMember(key), v: self.serializeMember(value) };
            if (null === serVal.k) {
                cc.warn("Invalid map key!");
                serVal.k = '';
            }
            if (null === serVal.v) {
                cc.warn("Invalid map value");
                serVal.v = '';
            }
            result.push(serVal);
        });
        return result;
    }

    decode(data: Uint8Array): boolean {
        if (data) {
            this._data = data;
            let result = Utf8ArrayToString(data);
            if (result.length > 0) {
                try {
                    this._data = JSON.parse(result);
                } catch (error) {
                    return false;
                }
            }
            return this.deserialize(this._data);
        }
        return false;
    }

    /**
     * @description 从json压缩对象信息 反序列化为实体类字段信息
     * @param data json压缩对象
     * */
    private deserialize(data: any) {
        let __serializeInfo = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serializeInfo) return true;
        let serializeKeyList = Object.keys(__serializeInfo);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, memberType, arrOrmapKeyType, mapValType] = __serializeInfo[serializeKey];
            let iscomplete = this.deserializeMember(memberName, memberType, arrOrmapKeyType, mapValType, data[serializeKey]);
            if (!iscomplete) {
                cc.warn("Invalid deserialize member :" + memberName);
                return false;
            }
        }
        return true;
    }

    /**
     * @description 反序列化成
     * @param memberName 成员变量名
     * @param memberType 成员变量类型
     * @param arrOrmapKeyType 数组值类型/Map的key类型
     * @param mapValType Map的值类型
     * @param value json压缩对象
     */
    private deserializeMember(memberName: any, memberType: any, arrOrmapKeyType: any, mapValType: any, value: any) {
        try {
            let originValue = this[memberName];
            if (typeof originValue === 'number') {
                this[memberName] = this.deserializeNumber(memberName, value);
            } else if (typeof originValue === 'string') {
                this[memberName] = this.deserializeString(memberName, value);
            } else if (originValue instanceof Array) {
                this.deserializeArray(memberName, arrOrmapKeyType, value);
            } else if (originValue instanceof Map) {
                this.deserializeMap(memberName, arrOrmapKeyType, mapValType, value);
            } else if (originValue instanceof JsonMessage) {
                originValue.deserialize(value);
            } else if (null === originValue) {
                switch (memberType) {
                    case Number: this[memberName] = this.deserializeNumber(memberName, value); break;
                    case String: this[memberName] = this.deserializeString(memberName, value); break;
                    case Array: this[memberName] = []; break;
                    case Map: this[memberName] = new Map; break;
                    default: {
                        this[memberName] = new memberType;
                        if (this[memberName] instanceof JsonMessage) {
                            this[memberName].deserialize(value);
                        } else {
                            cc.warn("Invalid deserialize member :" + memberName + " value:" + originValue);
                            return false;
                        }
                    } break;
                }
            } else {
                cc.warn("Invalid deserialize member : " + memberName + " value:" + originValue);
                return false;
            }
            return true;
        } catch (error) {
            cc.warn(error.message);
            this[memberName] = error.data || null;
            return false;
        }
    }

    private deserializeNumber(memberName: any, value: any) {
        if (value === null || value === undefined || value === NaN) {
            throw { message: `Invalid deserializeNumber member : ${memberName} value : ${value}`, data: 0 };
        }
        return Number(value);
    }

    private deserializeString(memberName: any, value: any) {
        if (value === null || value === undefined) {
            throw { message: `Invalid deserializeString member : ${memberName} value : ${value}`, data: '' };
        }
        return value;
    }

    private deserializeArray(memberName: any, valueType: any, value: any) {
        if (!(value instanceof Array)) {
            throw { message: `Invalid deserializeArray member : ${memberName} value : ${value}`, data: [] };
        }
        //重新解析，初始化时可能已经赋值，需要先清空对象
        this[memberName] = [];
        value.forEach((element, i) => {
            if (valueType === Number) {
                this[memberName].push(this.deserializeNumber(memberName + "[" + i + "]", element));
            } else if (valueType === String) {
                this[memberName].push(this.deserializeString(memberName + "[" + i + "]", element));
            } else if (valueType === Array) {
                throw { message: `Invalid deserializeArray member : ${memberName} array value type is Array` };
            } else if (valueType instanceof Map) {
                throw { message: `Invalid deserializeArray member : ${memberName} array value type is Map` };
            } else if (this[memberName] instanceof JsonMessage) {
                this[memberName].deserialize(element);
            } else {
                let elementObj = new valueType;
                if (elementObj instanceof JsonMessage) {
                    elementObj.deserialize(element);
                    this[memberName].push(elementObj);
                } else {
                    throw { message: `Invalid deserializeArray member : ${memberName} array value type is ` + valueType };
                }
            }
        });
    }

    private deserializeMap(memberName: any, keyType: any, valueType: any, value: any) {
        if (!(value instanceof Array)) {
            throw { message: `Invalid deserializeMap member : ${memberName} value : ${value}`, data: new Map };
        }
        //重新解析，初始化时可能已经赋值，需要先清空对象
        this[memberName].clear();
        value.forEach((element, i) => {
            if (element === null || element.k === undefined || element.k === null || element.v === undefined || element.v === null) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid element : ${element}` };
            }

            let elementKey;
            if (keyType === Number) {
                elementKey = this.deserializeNumber(memberName + "[" + i + "]:key", element.k);
            } else if (keyType === String) {
                elementKey = this.deserializeString(memberName + "[" + i + "]:key", element.k);
            } else {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid key type : ${keyType}` };
            }

            let elementValue;
            if (valueType === Number) {
                elementValue = this.deserializeNumber(memberName + "[" + i + "]:value", element.v);
            } else if (valueType === String) {
                elementValue = this.deserializeString(memberName + "[" + i + "]:value", element.v);
            } else if (valueType === Array) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : Array` };
            } else if (valueType instanceof Map) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : Map` };
            } else {
                elementValue = new valueType();
                if (elementValue instanceof JsonMessage) {
                    elementValue.deserialize(element.v);
                } else {
                    throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : ${valueType}` };
                }
            }
            this[memberName].set(elementKey, elementValue);
        });
    }
}