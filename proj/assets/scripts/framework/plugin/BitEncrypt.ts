
/**
 * @description 位加密,不增加数据本身大小进行位置加密
 */

import { DEBUG } from "cc/env";

class _BitEncrypt {

    private readonly logTag = `[BitEncrypt]:`;
    private _encryptKey: string = "EskKbMvzZBILhcTv";
    public set encryptKey( value : string ){
        this._encryptKey = value;
    }
    /**@description 加密解密 密钥 */
    public get encryptKey( ){
        return this._encryptKey;
    }
    /**
     * @description 解密
     * @param content 加密的内容
     * @param key 解密的key 加密/解密的key保持一致，如果不传可通过设置encryptKey
     */
    public decode(content: string, key?: string): string {
        return this._code(content, key);
    }

    /**
     * @description 加密
     * @param content 未加密内容
     * @param key 加密的key 加密/解密的key保持一致 如果不传可通过设置encryptKey
     */
    public encode(content: string, key?: string): string {
        return this._code(content, key);
    }

    private _code(content: string, key?: string): string {
        let result = this._check(content, key);
        if (result.isOK) {

            let contentCharCode: number[] = [];
            for (let i = 0; i < content.length; i++) {
                contentCharCode.push(content.charCodeAt(i));
            }

            let index = 0;
            let ch = "";
            //对中文，及以下的其它字符串进行位加密
            let regex = /[\w\d_-`~#!$%^&*(){}=+;:'"<,>,/?|\\\u4e00-\u9fa5]/g;
            for (let i = 0; i < contentCharCode.length; i++) {

                //只有子母，数字，
                let matchs = content[i].match(regex);
                if (matchs && matchs.length > 0) {
                    //替换字符
                    contentCharCode[i] ^= result.key.charCodeAt(index);
                    ch = String.fromCharCode(contentCharCode[i]);
                    matchs = ch.match(regex);
                    if (matchs && matchs.length) {
                        //转换后仍然是可显示字符
                    } else {
                        //转成了不能显示的字符，把它恢复原样
                        contentCharCode[i] ^= result.key.charCodeAt(index);
                    }

                    index++;
                    if (index >= result.key.length) {
                        index = 0;
                    }
                } else {
                    //不替换字符
                }
            }

            let newContent = "";
            for (let i = 0; i < contentCharCode.length; i++) {
                newContent += String.fromCharCode(contentCharCode[i]);
            }
            return newContent;

        } else {
            if (DEBUG) Log.e(BitEncrypt.logTag, `encode/decode error content : ${content} key : ${key}`);
            return content;
        }
    }

    private _check(content: string, key?: string): { isOK: boolean, key: string } {
        if (content && content.length > 0) {
            if (key && key.length > 0) {
                //使用传的key进行加解密
                return { isOK: true, key: key };
            } else {
                if (this.encryptKey && this.encryptKey.length > 0) {
                    return { isOK: true, key: this.encryptKey };
                } else {
                    return { isOK: false, key: "" };
                }
            }
        } else {
            return { isOK: false, key: "" };
        }
    }
}

export let BitEncrypt = new _BitEncrypt();
//window[`BitEncrypt`] = BitEncrypt;