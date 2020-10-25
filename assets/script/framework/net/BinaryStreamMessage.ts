/**
 * @description 二进制数据流解析
 */

import { Message } from "./Message";

type JsonMessageConstructor       = typeof BinaryStreamMessage;
type NumberStreamValueConstructor = typeof NumberStreamValue;
type StringStreamValueConstructor = typeof StringStreamValue;

export function serialize(
    key: string, 
    type: JsonMessageConstructor | NumberStreamValueConstructor | StringStreamValueConstructor );
export function serialize(
    key: string, 
    type: ArrayConstructor, 
    arrayType: JsonMessageConstructor | NumberStreamValueConstructor | StringStreamValueConstructor );
export function serialize(
    key: string, 
    type: MapConstructor, 
    mapKeyType: NumberConstructor | StringConstructor, 
    mapValueType: JsonMessageConstructor | NumberStreamValueConstructor | StringStreamValueConstructor );
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

/**@description 数据流接口 */
interface IStreamValue{
    data : any;
    read( dataView : DataView , offset : number ) : number;
    write( dataView : DataView , offset : number ) : number;
    size( ) : number;
}

/**@description 数据流基类 */
class StreamValue<T> implements IStreamValue{
    data : T = null;
    read( dataView : DataView , offset : number) : number{
        return 0;
    }
    write( dataView : DataView , offset : number):number{
        return 0;
    }
    size(){
        return 0;
    }
}

/**@description 数值类型 */
class NumberStreamValue extends StreamValue<number>{
    data = 0;
}

/**@description 字符串类型 */
class StringStreamValue extends StreamValue<string>{
    data = "";
}

let littleEndian = true;

export class Float32Value extends NumberStreamValue{
    size(){
        return Float32Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getFloat32(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setFloat32(offset,this.data);
        return this.size();
    }
}

export class Float64Value extends NumberStreamValue{
    size(){
        return Float64Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getFloat64(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setFloat64(offset,this.data);
        return this.size();
    }
}

export class Int8Value extends NumberStreamValue{
    size(){
        return Int8Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getInt8(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setInt8(offset,this.data);
        return this.size();
    }
}

export class Int16Value extends NumberStreamValue{
    size(){
        return Int16Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getInt16(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setInt16(offset,this.data);
        return this.size();
    }
}

export class Int32Value extends NumberStreamValue{
    size(){
        return Int32Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getInt32(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setInt32(offset,this.data);
        return this.size();
    }
}

export class Uint8Value extends NumberStreamValue{
    size(){
        return Uint8Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getUint8(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setUint8(offset,this.data);
        return this.size();
    }
}

export class Uint16Value extends NumberStreamValue{
    size(){
        return Uint16Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getUint16(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setUint16(offset,this.data);
        return this.size();
    }
}

export class Uint32Value extends NumberStreamValue{
    size(){
        return Uint32Array.BYTES_PER_ELEMENT;
    }
    read( dataView : DataView , offset : number ){
        this.data = dataView.getUint32(offset)
        return this.size();
    }

    write( dataView : DataView , offset : number){
        dataView.setUint32(offset,this.data);
        return this.size();
    }
}

class BinaryStream extends Message {

    private _dataView : DataView = null;
    /**@description 读取数据的偏移量 */
    private _byteOffset = 0;
    protected fillData(){
        this.data = this.serialize();
    }

    /**@description 序列化 */
    private serialize(): any {
        let result = {};
        let __serialize__ = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serialize__) return null;
        let serializeKeyList = Object.keys(__serialize__);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName,valueType] = __serialize__[serializeKey];
            let serializeObj = this.serializeMember(this[memberName],valueType);
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
    private serializeMember(value: any,valueType: any ) {
        if (valueType == Int32Value ) {
            return this.serializeNumberStreamValue(value,valueType);
        } else if( value instanceof StringStreamValue ){
            return this.serializeStringStreamValue(value);
        } else if (value instanceof Array) {
            return this.serializeArray(value);
        } else if (value instanceof Map) {
            return this.serializeMap(value);
        } else if (value instanceof BinaryStreamMessage) {
            return value.serialize();
        } else {
            cc.warn("Invalid serialize value : " + value);
            return null;
        }
    }

    private serializeNumberStreamValue(value: number,valueType:IStreamValue) {
        return (value === undefined || value === null || value == Number.NaN ) ? '0' : value;
    }

    private serializeStringStreamValue(value: IStreamValue) {
        return (value === undefined || value === null) ? '0' : value.data;
    }

    private serializeArray(value: Array<any>) {
        let result = [];
        value.forEach(element => {
            // result.push(this.serializeMember(element));
        });
        return result;
    }

    private serializeMap(value: Map<any, any>) {
        let result = [];
        let self = this;
        value.forEach((value, key) => {
            // let serVal = { k: self.serializeMember(key), v: self.serializeMember(value) };
            // if (null === serVal.k) {
            //     cc.warn("Invalid map key!");
            //     serVal.k = '';
            // }
            // if (null === serVal.v) {
            //     cc.warn("Invalid map value");
            //     serVal.v = '';
            // }
            // result.push(serVal);
        });
        return result;
    }

    /**@description 从二进制数据中取数据 */
    decode(data: Uint8Array): boolean {
        this._dataView = new DataView(data.buffer);
        this._byteOffset = 0;
        return this.deserialize();
    }

    /**
     * @description 从json压缩对象信息 反序列化为实体类字段信息
     * @param data json压缩对象
     * */
    private deserialize() {
        let __serializeInfo = Reflect.getPrototypeOf(this)['__serialize__'];
        if (!__serializeInfo) return true;
        let serializeKeyList = Object.keys(__serializeInfo);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, memberType, arrOrmapKeyType, mapValType] = __serializeInfo[serializeKey];
            let iscomplete = this.deserializeMember(memberName, memberType, arrOrmapKeyType, mapValType);
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
    private deserializeMember(memberName: any, memberType: any, arrOrmapKeyType: any, mapValType: any) {
        try {
            let originValue = this[memberName];
            if (memberType == Int32Value ) {
                this[memberName] = this.deserializeNumberStreamValue(memberName,memberType);
            } else if ( originValue instanceof StringStreamValue ) {
                this[memberName] = this.deserializeStringStreamValue(memberName, value);
            } else if (originValue instanceof Array) {
                this.deserializeArray(memberName, arrOrmapKeyType, value);
            } else if (originValue instanceof Map) {
                this.deserializeMap(memberName, arrOrmapKeyType, mapValType, value);
            } else if (originValue instanceof BinaryStreamMessage) {
                originValue.deserialize(value);
            } else if (null === originValue) {
                switch (memberType) {
                    case Number: this[memberName] = this.deserializeNumberStreamValue(memberName, value); break;
                    case String: this[memberName] = this.deserializeStringStreamValue(memberName, value); break;
                    case Array: this[memberName] = [];break;
                    case Map: this[memberName] = new Map; break;
                    default: {
                        this[memberName] = new memberType;
                        if (this[memberName] instanceof BinaryStreamMessage) {
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

    private deserializeNumberStreamValue(memberName: any,memberType : typeof NumberStreamValue) {
        let value = new memberType();
        this._byteOffset += value.read(this._dataView,this._byteOffset);
        return value.data;
    }

    private deserializeStringStreamValue(memberName: any, value: IStreamValue) {
        if (value === null || value === undefined) {
            throw { message: `Invalid deserializeString member : ${memberName} value : ${value.data}`, data: '' };
        }
        return value;
    }

    private deserializeArray(memberName: any, valueType: any, value: IStreamValue) {
        if (!(value instanceof Array)) {
            throw { message: `Invalid deserializeArray member : ${memberName} value : ${value.data}`, data: [] };
        }
        //重新解析，初始化时可能已经赋值，需要先清空对象
        this[memberName] = [];
        value.forEach((element, i) => {
            if (valueType === Number) {
                this[memberName].push(this.deserializeNumberStreamValue(memberName + "[" + i + "]", element));
            } else if (valueType === String) {
                this[memberName].push(this.deserializeStringStreamValue(memberName + "[" + i + "]", element));
            } else if (valueType === Array) {
                throw { message: `Invalid deserializeArray member : ${memberName} array value type is Array` };
            } else if (valueType instanceof Map) {
                throw { message: `Invalid deserializeArray member : ${memberName} array value type is Map` };
            } else if (this[memberName] instanceof BinaryStreamMessage) {
                this[memberName].deserialize(element);
            } else {
                let elementObj = new valueType;
                if (elementObj instanceof BinaryStreamMessage) {
                    elementObj.deserialize(element);
                    this[memberName].push(elementObj);
                } else {
                    throw { message: `Invalid deserializeArray member : ${memberName} array value type is ` + valueType };
                }
            }
        });
    }

    private deserializeMap(memberName: any, keyType: any, valueType: any, value: IStreamValue) {
        if (!(value instanceof Array)) {
            throw { message: `Invalid deserializeMap member : ${memberName} value : ${value.data}`, data: new Map };
        }
        //重新解析，初始化时可能已经赋值，需要先清空对象
        this[memberName].clear();
        value.forEach((element, i) => {
            if (element === null || element.k === undefined || element.k === null || element.v === undefined || element.v === null) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid element : ${element}` };
            }

            let elementKey;
            if (keyType === Number) {
                elementKey = this.deserializeNumberStreamValue(memberName + "[" + i + "]:key", element.k);
            } else if (keyType === String) {
                elementKey = this.deserializeStringStreamValue(memberName + "[" + i + "]:key", element.k);
            } else {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid key type : ${keyType}` };
            }

            let elementValue;
            if (valueType === Number) {
                elementValue = this.deserializeNumberStreamValue(memberName + "[" + i + "]:value", element.v);
            } else if (valueType === String) {
                elementValue = this.deserializeStringStreamValue(memberName + "[" + i + "]:value", element.v);
            } else if (valueType === Array) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : Array` };
            } else if (valueType instanceof Map) {
                throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : Map` };
            } else {
                elementValue = new valueType();
                if (elementValue instanceof BinaryStreamMessage) {
                    elementValue.deserialize(element.v);
                } else {
                    throw { message: `Invalid deserializeMap member : ${memberName} invalid value type : ${valueType}` };
                }
            }
            this[memberName].set(elementKey, elementValue);
        });
    }
}

export class BinaryStreamMessage extends BinaryStream {
    @serialize("mainCmd",Int32Value)
    mainCmd = 0;
    @serialize("subCmd",Int32Value)
    subCmd = 0;
}