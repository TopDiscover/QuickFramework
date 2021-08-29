/**
 * @description 二进制数据流解析
 */

import { Message } from "./Message";


type BinaryStreamConstructor = typeof BinaryStream;
type NumberStreamValueConstructor = typeof NumberStreamValue;
type StringStreamValueConstructor = typeof StringStreamValue;

export function serialize(
    key: string,
    type: BinaryStreamConstructor | NumberStreamValueConstructor | StringStreamValueConstructor
): Function;
export function serialize(
    key: string,
    type: ArrayConstructor,
    arrayType: BinaryStreamConstructor | NumberStreamValueConstructor | StringStreamValueConstructor): Function;
export function serialize(
    key: string,
    type: MapConstructor,
    mapKeyType: NumberConstructor | StringConstructor,
    mapValueType: BinaryStreamConstructor | NumberStreamValueConstructor | StringStreamValueConstructor): Function;
export function serialize(key: string, type: any, arrTypeOrMapKeyType?: any, mapValueType?: any) {
    return function (target: any, memberName: any) {
        if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
            let selfSerializeInfo: any = {};
            if ((<any>Reflect.getPrototypeOf(target))['__serialize__']) {
                // 父类拥有序列化信息,并且自己没有序列化信息,则拷贝父类到当前类中来
                if (Reflect.getOwnPropertyDescriptor(target, '__serialize__') === undefined) {
                    let parentSerializeInfo = (<any>Reflect.getPrototypeOf(target))['__serialize__'];
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
interface IStreamValue {
    data: any;
    read(dataView: DataView, offset: number): number;
    write(dataView: DataView, offset: number): number;
    size(): number;
    littleEndian: boolean;
}

/**@description 数据流基类 */
class StreamValue<T> implements IStreamValue {
    data: T = null!;
    read(dataView: DataView, offset: number): number {
        return 0;
    }
    write(dataView: DataView, offset: number): number {
        return 0;
    }
    size() {
        return 0;
    }
    /**@description 网络数据全以大端方式进行处理 */
    get littleEndian() {
        return td.Macro.USING_LITTLE_ENDIAN;
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

/**@description 字符串类型 */
export class StringValue extends StringStreamValue {
    size() {
        //先写入数据大小长度
        let byteSize = Uint32Array.BYTES_PER_ELEMENT;
        //加上当前字符串数量长度
        let buffer = StringToUtf8Array(this.data);
        byteSize += buffer.length;
        return byteSize;
    }
    read(dataView: DataView, offset: number) {
        //先读取字符串长度
        let readLen = 0;
        let length = dataView.getUint32(offset, this.littleEndian);
        readLen = Uint32Array.BYTES_PER_ELEMENT;
        offset = offset + readLen;

        //可变长字符串
        let arr = new Uint8Array(length)
        for (let i = 0; i < length; i++) {
            arr[i] = dataView.getUint8(offset);
            offset += Uint8Array.BYTES_PER_ELEMENT;
            readLen += Uint8Array.BYTES_PER_ELEMENT;
        }

        this.data = Utf8ArrayToString(arr);
        return readLen;
    }

    write(dataView: DataView, offset: number) {
        //先写入字符串长度
        let writeLen = 0;
        let buffer: Uint8Array = StringToUtf8Array(this.data);
        let byteLenght = buffer.length;
        //可变长字符串
        dataView.setUint32(offset, byteLenght, this.littleEndian);
        writeLen += Uint32Array.BYTES_PER_ELEMENT;
        offset += writeLen;
        //写入字符串内容
        for (let i = 0; i < buffer.length; i++) {
            dataView.setUint8(offset, buffer[i]);
            offset += Uint8Array.BYTES_PER_ELEMENT;
            writeLen += Uint8Array.BYTES_PER_ELEMENT;
        }
        return writeLen;
    }
}

/**@description 固定长度 */
export class StringArrayValue extends StringValue {
    dataLength = 0;
}

export class Float32Value extends NumberStreamValue {
    size() {
        return Float32Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getFloat32(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setFloat32(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export class Float64Value extends NumberStreamValue {
    size() {
        return Float64Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getFloat64(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setFloat64(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export class Int8Value extends NumberStreamValue {
    size() {
        return Int8Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getInt8(offset)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setInt8(offset, this.data);
        return this.size();
    }
}

export class Int16Value extends NumberStreamValue {
    size() {
        return Int16Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getInt16(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setInt16(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export class Int32Value extends NumberStreamValue {
    size() {
        return Int32Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getInt32(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setInt32(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export class Uint8Value extends NumberStreamValue {
    size() {
        return Uint8Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getUint8(offset)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setUint8(offset, this.data);
        return this.size();
    }
}

export class Uint16Value extends NumberStreamValue {
    size() {
        return Uint16Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getUint16(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setUint16(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export class Uint32Value extends NumberStreamValue {
    size() {
        return Uint32Array.BYTES_PER_ELEMENT;
    }
    read(dataView: DataView, offset: number) {
        this.data = dataView.getUint32(offset, this.littleEndian)
        return this.size();
    }

    write(dataView: DataView, offset: number) {
        dataView.setUint32(offset, this.data, this.littleEndian);
        return this.size();
    }
}

export abstract class BinaryStream extends Message {

    protected _dataView: DataView = null!;
    /**@description 读取数据的偏移量 */
    protected _byteOffset = 0;
    buffer: Uint8Array;
    get Data(): any { return this.buffer }
    /**@description 将当前数据转成buffer */
    Encode(): boolean {
        let size = this.size()
        let buffer = new ArrayBuffer(size)
        this._dataView = new DataView(buffer)
        this._byteOffset = 0;
        this.serialize();
        this.buffer = new Uint8Array(this._dataView.buffer);
        let success = this._byteOffset == this._dataView.byteLength;
        if (!success) {
            cc.error(`encode 当前读取大小为 : ${this._byteOffset} 数据大小为 : ${this._dataView.byteLength}`);
        }
        return success;
    }

    /**@description 是否是数值类型 */
    private isNumberValue(valueType: any) {
        return valueType == Float32Value || valueType == Float64Value ||
            valueType == Int8Value || valueType == Int16Value || valueType == Int32Value ||
            valueType == Uint8Value || valueType == Uint16Value || valueType == Uint32Value;
    }

    /**@description 是否是字符串类型 */
    private isStringValue(valueType: any) {
        return valueType == StringValue || valueType == StringArrayValue;
    }

    /**@description 计算当前需要序列化的实际大小 */
    protected size(): number {
        let byteSize = 0;
        let __serialize__ = (<any>Reflect.getPrototypeOf(this))['__serialize__'];
        if (!__serialize__) return 0;
        let serializeKeyList = Object.keys(__serialize__);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, type, arrTypeOrMapKeyType, mapValueType] = __serialize__[serializeKey];
            let memberSize = this.memberSize((<any>this)[memberName], type, arrTypeOrMapKeyType, mapValueType);
            if (null === memberSize) {
                cc.warn("Invalid serialize member size : " + memberName);
            }
            byteSize += memberSize;
        }
        return byteSize;
    }

    /**@description 计算成员变量数据大小 */
    protected memberSize(value: any, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any): number {
        if (this.isNumberValue(valueType)) {
            return this.memberNumberSize(value, valueType);
        } else if (this.isStringValue(valueType)) {
            return this.memberStringSize(value, valueType);
        } else if (value instanceof Array) {
            return this.memberArraySize(value, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof Map) {
            return this.memberMapSize(value, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof BinaryStream) {
            return value.size();
        } else if (valueType == Number) {//Map的key
            return this.memberNumberSize(value, Uint32Value)
        } else if (valueType == String) {//Map的key
            return this.memberStringSize(value, StringValue)
        } else {
            cc.warn("Invalid serialize value : " + value);
            return 0;
        }
    }

    protected memberNumberSize(value: any, valueType: typeof NumberStreamValue): number {
        let type = new valueType();
        return type.size();
    }

    protected memberStringSize(value: any, valueType: typeof StringStreamValue): number {
        let type = new valueType();
        type.data = value;
        return type.size();
    }

    private memberArraySize(value: any[], valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //数组的大小
        let typeSize = Uint32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < value.length; i++) {
            typeSize += this.memberSize(value[i], arrTypeOrMapKeyType, null, null);
        }
        return typeSize;
    }

    private memberMapSize(value: Map<any, any>, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //数组大小
        let typeSize = Uint32Array.BYTES_PER_ELEMENT;
        value.forEach((dataValue, key) => {
            //Key的大小
            typeSize += this.memberSize(key, arrTypeOrMapKeyType, null, null);
            //数据的大小
            typeSize += this.memberSize(dataValue, mapValueType, null, null);
        });
        return typeSize;
    }

    /**@description 序列化 */
    private serialize() {
        let __serialize__ = (<any>Reflect.getPrototypeOf(this))['__serialize__'];
        if (!__serialize__) return null;
        let serializeKeyList = Object.keys(__serialize__);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, type, arrTypeOrMapKeyType, mapValueType] = __serialize__[serializeKey];
            this.serializeMember((<any>this)[memberName], memberName, type, arrTypeOrMapKeyType, mapValueType);
        }
    }

    /**
     * @description 序列化成员变量
     * @param value 该成员变量的值
     * */
    private serializeMember(value: any, memberName: string, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        if (this.isNumberValue(valueType)) {
            this.serializeNumberStreamValue(value, valueType);
        } else if (this.isStringValue(valueType)) {
            this.serializeStringStreamValue(value, valueType, arrTypeOrMapKeyType);
        } else if (value instanceof Array) {
            this.serializeArray(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof Map) {
            this.serializeMap(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof BinaryStream) {
            value._dataView = this._dataView;
            value._byteOffset = this._byteOffset;
            value.serialize();
            this._byteOffset = value._byteOffset;
        } else {
            cc.error(`序列化成员 : ${memberName} 出错!!`);
        }
    }

    private serializeNumberStreamValue(value: number, valueType: typeof NumberStreamValue) {
        let type = new valueType();
        type.data = (value === undefined || value === null || value == Number.NaN) ? 0 : value;
        this._byteOffset += type.write(this._dataView, this._byteOffset);
    }

    private serializeStringStreamValue(value: string, valueType: typeof StringStreamValue, size: number) {
        let type = new valueType();
        type.data = (value === undefined || value === null) ? "" : value;
        this._byteOffset += type.write(this._dataView, this._byteOffset);
    }

    private serializeArray(value: Array<any>, memberName: string, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //先写入数组的大小
        this._dataView.setUint32(this._byteOffset, value.length, td.Macro.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < value.length; i++) {
            this.serializeMember(value[i], `${memberName}[${i}]`, arrTypeOrMapKeyType, null, null);
        }
    }

    private serializeMap(value: Map<any, any>, memberName: string, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //先写入字典的大小
        this._dataView.setUint32(this._byteOffset, value.size, td.Macro.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        value.forEach((dataValue, dataKey) => {
            //写入key
            if (arrTypeOrMapKeyType == String) {
                let keyValue = new StringValue();
                keyValue.data = dataKey;
                this._byteOffset += keyValue.write(this._dataView, this._byteOffset);
            } else {
                this._dataView.setUint32(this._byteOffset, dataKey, td.Macro.USING_LITTLE_ENDIAN)
                this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
            }
            //写值
            this.serializeMember(dataValue, `${memberName}.${dataKey}`, mapValueType, null, null);
        });
    }

    /**@description 从二进制数据中取数据 */
    Decode(data: Uint8Array): boolean {
        this.buffer = data;
        this._dataView = new DataView(data.buffer);
        this._byteOffset = 0;
        this.deserialize();
        let success = this._dataView.byteLength == this._byteOffset;
        if (!success) {
            cc.error(`decode 当前读取大小为 : ${this._byteOffset} 数据大小为 : ${this._dataView.byteLength}`);
        }

        return success;
    }

    /**
     * @description 从json压缩对象信息 反序列化为实体类字段信息
     * @param data json压缩对象
     * */
    protected deserialize() {
        let __serializeInfo = (<any>Reflect.getPrototypeOf(this))['__serialize__'];
        if (!__serializeInfo) return true;
        let serializeKeyList = Object.keys(__serializeInfo);
        for (let len = serializeKeyList.length, i = 0; i < len; i++) {
            let serializeKey = serializeKeyList[i];
            let [memberName, type, arrTypeOrMapKeyType, mapValueType] = __serializeInfo[serializeKey];
            this.deserializeMember(memberName, type, arrTypeOrMapKeyType, mapValueType);
        }
    }

    /**
     * @description 反序列化成
     * @param memberName 成员变量名
     * @param memberType 成员变量类型
     * @param arrTypeOrMapKeyType 数组值类型/Map的key类型
     * @param mapValueType Map的值类型
     * @param value json压缩对象
     */
    private deserializeMember(memberName: any, memberType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        try {
            let originValue = (<any>this)[memberName];
            if (this.isNumberValue(memberType)) {
                (<any>this)[memberName] = this.deserializeNumberStreamValue(memberName, memberType);
            } else if (this.isStringValue(memberType)) {
                (<any>this)[memberName] = this.deserializeStringStreamValue(memberName, memberType, arrTypeOrMapKeyType);
            } else if (originValue instanceof Array) {
                this.deserializeArray(memberName, memberType, arrTypeOrMapKeyType, mapValueType);
            } else if (originValue instanceof Map) {
                this.deserializeMap(memberName, memberType, arrTypeOrMapKeyType, mapValueType);
            } else if (originValue instanceof BinaryStream) {
                originValue._dataView = this._dataView;
                originValue._byteOffset = this._byteOffset;
                originValue.deserialize();
                this._byteOffset = originValue._byteOffset;
            } else {
                cc.error(`deserializeMember ${memberName} error!!!`);
            }
        } catch (error) {
            cc.warn(error.message);
            error(`deserializeMember ${memberName} error!!!`);
        }
    }

    private deserializeNumberStreamValue(memberName: any, memberType: typeof NumberStreamValue) {
        let value = new memberType();
        this._byteOffset += value.read(this._dataView, this._byteOffset);
        return value.data;
    }

    private deserializeStringStreamValue(memberName: any, memberType: typeof StringStreamValue, arrTypeOrMapKeyType: number) {
        let value = new memberType();
        this._byteOffset += value.read(this._dataView, this._byteOffset);
        return value.data;
    }

    private deserializeArray(memberName: any, memberType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //重新解析，初始化时可能已经赋值，需要先清空对象
        (<any>this)[memberName] = [];
        //先读数组大小
        let size = this._dataView.getUint32(this._byteOffset, td.Macro.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < size; i++) {
            let type = new arrTypeOrMapKeyType();
            if (type instanceof BinaryStream) {
                (<any>this)[memberName][i] = type.deserialize();
            } else {
                this._byteOffset += type.read(this._dataView, this._byteOffset);
                (<any>this)[memberName][i] = type.data;
            }
        }
    }

    private deserializeMap(memberName: any, memberType: any, arrTypeOrMapKeyType: any, mapValueType: any) {

        (<any>this)[memberName] = new Map;
        //先读入数组大小
        let size = this._dataView.getUint32(this._byteOffset, td.Macro.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < size; i++) {
            let key = null;
            //写入key
            if (arrTypeOrMapKeyType == String) {
                let keyValue = new StringValue();
                this._byteOffset += keyValue.read(this._dataView, this._byteOffset)
                key = keyValue.data;
            } else {
                key = this._dataView.getUint32(this._byteOffset, td.Macro.USING_LITTLE_ENDIAN)
                this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
            }
            //写值
            let data = new mapValueType();
            if (mapValueType instanceof BinaryStream) {
                data.deserialize();
            } else {
                this._byteOffset += data.read(this._dataView, this._byteOffset);
                data = data.data;
            }
            (<any>this)[memberName].set(key, data);
        }
    }

}