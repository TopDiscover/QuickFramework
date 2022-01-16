/**
 * @description 二进制数据流解析
 */

import { Macro } from "../../../defines/Macros";
import { ByteArray } from "../../../plugin/ByteArray";
import { Net } from "../Net";
import { Message } from "./Message";


type BinaryStreamConstructor = typeof BinaryStream;
type NumberValueConstructor = typeof NumberValue;
type STRINGConstructor = typeof STRING;
type BOOLConstructor = typeof BOOL;

/**
 * 
 * @param key 序列化的Key
 * @param type 序列化的类型
 * @param byteSize 序列化指定字节长度，只有STRING有效
 */
export function serialize(
    key: string,
    type: BinaryStreamConstructor | NumberValueConstructor | STRINGConstructor | BOOLConstructor,
    byteSize ?: number
): Function;
export function serialize(
    key: string,
    type: ArrayConstructor,
    arrayType: BinaryStreamConstructor | NumberValueConstructor | STRINGConstructor): Function;
export function serialize(
    key: string,
    type: MapConstructor,
    mapKeyType: NumberConstructor | StringConstructor,
    mapValueType: BinaryStreamConstructor | NumberValueConstructor | STRINGConstructor): Function;
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
    read(byteArray: ByteArray): void;
    write(byteArray: ByteArray): void;
    littleEndian: string;
}

/**@description 数据流基类 */
class StreamValue<T> implements IStreamValue {
    data: T = null!;
    read(byteArray: ByteArray): void {}
    write(byteArray: ByteArray): void {}
    /**@description 网络数据全以大端方式进行处理 */
    get littleEndian() {
        return Macro.USING_LITTLE_ENDIAN;
    }
}

/**@description 数值类型 */
class NumberValue extends StreamValue<number>{
    data = 0;
}

/**@description 字符串类型 */
export class BOOL extends StreamValue<boolean>{
    data = false;
    read(byteArray: ByteArray) {
        //先读取字符串长度
        this.data = byteArray.readBoolean();
    }

    write(byteArray: ByteArray) {
        byteArray.writeBoolean(this.data);
    }
}

/**@description 字符串类型 */
export class STRING extends StreamValue<string> {
    data = "";
    /**@description 定长字节数大小,注意不是字符串的个数 */
    byteSize : number | undefined = undefined;
    read(byteArray: ByteArray) {
        //先读取字符串长度
        let size = this.byteSize;
        if ( this.byteSize == undefined ){
            //不定长处理
            size = byteArray.readUnsignedInt();
        }
        this.data = byteArray.readUTFBytes(size);
    }

    write(byteArray: ByteArray) {
        let buffer = new ByteArray();
        buffer.writeUTFBytes(this.data,this.byteSize);
        if ( this.byteSize == undefined){
            //不定长处理
            byteArray.writeUnsignedInt(buffer.length);
        }
        byteArray.writeBytes(buffer);
    }
}

export class FLOAT extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readFloat();
    }
    write(byteArray: ByteArray) {
        byteArray.writeFloat(this.data);
    }
}

export class DOUBLE extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readDouble();
    }

    write(byteArray: ByteArray) {
        byteArray.writeDouble(this.data);
    }
}

export class BYTE extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readByte();
    }

    write(byteArray: ByteArray) {
        byteArray.writeByte(this.data);
    }
}

export class SHORT extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readShort();
    }

    write(byteArray: ByteArray) {
        byteArray.writeShort(this.data);
    }
}

export class INT extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readInt();
    }

    write(byteArray: ByteArray) {
        byteArray.writeInt(this.data);
    }
}

export class UBYTE extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readUnsignedByte();
    }

    write(byteArray: ByteArray) {
        byteArray.writeByte(this.data);
    }
}

export class USHORT extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readUnsignedShort();
    }

    write(byteArray: ByteArray) {
        byteArray.writeUnsignedShort(this.data);
    }
}

export class UINT extends NumberValue {
    read(byteArray: ByteArray) {
        this.data = byteArray.readUnsignedInt();
    }

    write(byteArray: ByteArray) {
        byteArray.writeUnsignedInt(this.data);
    }
}

export abstract class BinaryStream extends Message {

    protected byteArray: ByteArray = null!;
    buffer: Uint8Array = null!;
    /**@description 将当前数据转成buffer */
    encode(): boolean {
        this.byteArray = new ByteArray(this.buffer)
        this.byteArray.endian = Macro.USING_LITTLE_ENDIAN;
        this.serialize();
        this.buffer = this.byteArray.bytes;
        return true;
    }

    /**@description 是否是数值类型 */
    private isNumberValue(valueType: any) {
        return valueType == FLOAT || valueType == DOUBLE ||
            valueType == BYTE || valueType == SHORT || valueType == INT ||
            valueType == UBYTE || valueType == USHORT || valueType == UINT;
    }

    private isBoolValue( valueType:any){
        return valueType == BOOL;
    }

    /**@description 是否是字符串类型 */
    private isStringValue(valueType: any) {
        return valueType == STRING ;
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
        } else if( this.isBoolValue(valueType) ){
            this.serializeBoolValue(value,valueType);
        } else if (this.isStringValue(valueType)) {
            this.serializeStringStreamValue(value, valueType,arrTypeOrMapKeyType);
        } else if (value instanceof Array) {
            this.serializeArray(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof Map) {
            this.serializeMap(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType);
        } else if (value instanceof BinaryStream) {
            value.byteArray = this.byteArray;
            value.serialize();
        } else {
            Log.e(`序列化成员 : ${memberName} 出错!!`);
        }
    }

    private serializeNumberStreamValue(value: number, valueType: typeof NumberValue) {
        let type = new valueType();
        type.data = (value === undefined || value === null || value == Number.NaN) ? 0 : value;
        type.write(this.byteArray);
    }

    private serializeBoolValue(value: boolean, valueType: typeof BOOL) {
        let type = new valueType();
        type.data = (value === undefined || value === null ) ? false : value;
        type.write(this.byteArray);
    }

    private serializeStringStreamValue(value: string, valueType: typeof STRING,byteSize:number|undefined) {
        let type = new valueType();
        type.byteSize = byteSize;
        type.data = (value === undefined || value === null) ? "" : value;
        type.write(this.byteArray);
    }

    private serializeArray(value: Array<any>, memberName: string, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //先写入数组的大小
        this.byteArray.writeUnsignedInt(value.length);
        for (let i = 0; i < value.length; i++) {
            this.serializeMember(value[i], `${memberName}[${i}]`, arrTypeOrMapKeyType, null, null);
        }
    }

    private serializeMap(value: Map<any, any>, memberName: string, valueType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //先写入字典的大小
        this.byteArray.writeUnsignedInt(value.size);
        value.forEach((dataValue, dataKey) => {
            //写入key
            if (arrTypeOrMapKeyType == String) {
                let keyValue = new STRING();
                keyValue.data = dataKey;
                keyValue.write(this.byteArray);
            } else {
                this.byteArray.writeUnsignedInt(dataKey);
            }
            //写值
            this.serializeMember(dataValue, `${memberName}.${dataKey}`, mapValueType, null, null);
        });
    }

    /**@description 从二进制数据中取数据 */
    decode(data: Uint8Array): boolean {
        this.buffer = data;
        this.byteArray = new ByteArray(data);
        this.byteArray.endian = Macro.USING_LITTLE_ENDIAN;
        this.deserialize();
        return true;
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
            } else if (this.isBoolValue(memberType)){
                (<any>this)[memberName] = this.deserializeBoolValue(memberName, memberType);
            } else if (this.isStringValue(memberType)) {
                (<any>this)[memberName] = this.deserializeStringStreamValue(memberName, memberType, arrTypeOrMapKeyType);
            } else if (originValue instanceof Array) {
                this.deserializeArray(memberName, memberType, arrTypeOrMapKeyType, mapValueType);
            } else if (originValue instanceof Map) {
                this.deserializeMap(memberName, memberType, arrTypeOrMapKeyType, mapValueType);
            } else if (originValue instanceof BinaryStream) {
                originValue.byteArray = this.byteArray;
                originValue.deserialize();
            } else {
                Log.e(`deserializeMember ${memberName} error!!!`);
            }
        } catch (err:any) {
            Log.w(err.message);
            Log.e(`deserializeMember ${memberName} error!!!`);
        }
    }

    private deserializeNumberStreamValue(memberName: any, memberType: typeof NumberValue) {
        let value = new memberType();
        value.read(this.byteArray);
        return value.data;
    }

    private deserializeBoolValue(memberName: any, memberType: typeof BOOL) {
        let value = new memberType();
        value.read(this.byteArray);
        return value.data;
    }

    private deserializeStringStreamValue(memberName: any, memberType: typeof STRING, arrTypeOrMapKeyType: number) {
        let value = new memberType();
        value.byteSize = arrTypeOrMapKeyType;
        value.read(this.byteArray);
        return value.data;
    }

    private deserializeArray(memberName: any, memberType: any, arrTypeOrMapKeyType: any, mapValueType: any) {
        //重新解析，初始化时可能已经赋值，需要先清空对象
        (<any>this)[memberName] = [];
        //先读数组大小
        let size = this.byteArray.readUnsignedInt();
        for (let i = 0; i < size; i++) {
            let type = new arrTypeOrMapKeyType();
            if (type instanceof BinaryStream) {
                type.byteArray = this.byteArray;
                (<any>this)[memberName][i] = type.deserialize();
            } else {
                type.read(this.byteArray);
                (<any>this)[memberName][i] = type.data;
            }
        }
    }

    private deserializeMap(memberName: any, memberType: any, arrTypeOrMapKeyType: any, mapValueType: any) {

        (<any>this)[memberName] = new Map;
        //先读入数组大小
        let size = this.byteArray.readUnsignedInt();
        for (let i = 0; i < size; i++) {
            let key = null;
            //写入key
            if (arrTypeOrMapKeyType == String) {
                let keyValue = new STRING();
                keyValue.read(this.byteArray);
                key = keyValue.data;
            } else {
                key = this.byteArray.readUnsignedInt();
            }
            //写值
            let data = new mapValueType();
            if (mapValueType instanceof BinaryStream) {
                (data as BinaryStream).byteArray = this.byteArray;
                data.deserialize();
            } else {
                data.read(this.byteArray);
                data = data.data;
            }
            (<any>this)[memberName].set(key, data);
        }
    }
}

export abstract class BinaryStreamHeartbeat extends BinaryStream{
    static type = Net.ServiceType.BinaryStream;
}