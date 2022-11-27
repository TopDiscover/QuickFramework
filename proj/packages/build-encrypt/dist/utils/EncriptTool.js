"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncriptTool = void 0;
/**ArrayBuffer加密解密 */
class EncriptTool {
    constructor() {
        this.encriptSign = "";
        this.encriptKey = "";
    }
    setKeySign(encriptKey, encriptSign) {
        this.encriptKey = encriptKey;
        this.encriptSign = encriptSign;
    }
    strToBytes(str) {
        let size = str.length;
        let result = [];
        for (let i = 0; i < size; i++) {
            result.push(str.charCodeAt(i));
        }
        return result;
    }
    checkIsEncripted(arrbuf, sign = this.encriptSign) {
        if (!sign) {
            return false;
        }
        let signBuf = new Uint8Array(this.strToBytes(sign));
        let buffer = new Uint8Array(arrbuf);
        for (let i = 0; i < signBuf.length; i++) {
            if (buffer[i] != signBuf[i]) {
                return false;
            }
        }
        return true;
    }
    encodeArrayBuffer(arrbuf, sign = this.encriptSign, key = this.encriptKey) {
        let signBuf = new Uint8Array(this.strToBytes(sign));
        let keyBytes = this.strToBytes(key);
        let buffer = new Uint8Array(arrbuf);
        let _outArrBuf = new ArrayBuffer(signBuf.length + buffer.length);
        let outBuffer = new Uint8Array(_outArrBuf);
        for (let i = 0; i < signBuf.length; i++) {
            outBuffer[i] = signBuf[i];
        }
        let idx = 0;
        for (let i = 0; i < buffer.length; i++) {
            let b = buffer[i];
            let eb = b ^ keyBytes[idx];
            if (++idx >= keyBytes.length) {
                idx = 0;
            }
            outBuffer[signBuf.length + i] = eb;
        }
        return outBuffer;
    }
    decodeArrayBuffer(arrbuf, sign = this.encriptSign, key = this.encriptKey) {
        if (!this.checkIsEncripted(arrbuf, sign)) {
            return arrbuf;
        }
        let signBuf = new Uint8Array(this.strToBytes(sign));
        let keyBytes = this.strToBytes(key);
        let buffer = new Uint8Array(arrbuf);
        let size = buffer.length - signBuf.length;
        let _outArrBuf = new ArrayBuffer(size);
        let outBuffer = new Uint8Array(_outArrBuf);
        let idx = 0;
        for (let i = 0; i < size; i++) {
            let b = buffer[signBuf.length + i];
            let db = b ^ keyBytes[idx];
            if (++idx >= keyBytes.length) {
                idx = 0;
            }
            outBuffer[i] = db;
        }
        return outBuffer;
    }
}
exports.EncriptTool = EncriptTool;
