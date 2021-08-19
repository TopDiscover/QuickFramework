import { BitEncrypt } from "../extentions/BitEncrypt";

/**
 * @description 本地数据存储，为了后面可能需要对数据进入加密保存等，把cocos的封闭一层
 */

type StorageVauleType = "number" | "string" | "boolean" | "object";
interface StorageData {
    type: StorageVauleType,
    value: string | number | boolean | object;
}

export class LocalStorage {

    private static _instance: LocalStorage = null;
    public static Instance() { return this._instance || (this._instance = new LocalStorage()); }

    public key = "VuxiAKihQ0VR9WRe";
    //public iv = "Zqk3jEvujfeRIY9j";

    //aes加密 
    private encrypt(obj : {}) {
        //些加载出来的数据太过庞大,可能造成浏览器无法缓存太多数据，
        //使用新的加密方法,不会增加数据本身的大小
        return BitEncrypt.encode(JSON.stringify(obj),this.key);
        // let _CryptoJS: any = CryptoJS;
        // let word = JSON.stringify(obj);
        // let key = _CryptoJS.enc.Utf8.parse(this.key);
        // let iv = _CryptoJS.enc.Utf8.parse(this.iv);
        // let srcs = _CryptoJS.enc.Utf8.parse(word);
        // let encrypted = _CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: _CryptoJS.mode.CBC, padding: _CryptoJS.pad.Pkcs7 });
        // return encrypted.ciphertext.toString();
    }

    private decryption(word) {
        return BitEncrypt.decode(word,this.key);
        // let _CryptoJS: any = CryptoJS;
        // let key = _CryptoJS.enc.Utf8.parse(this.key);
        // let iv = _CryptoJS.enc.Utf8.parse(this.iv);
        // let encryptedHexStr = _CryptoJS.enc.Hex.parse(word);
        // let srcs = _CryptoJS.enc.Base64.stringify(encryptedHexStr);
        // let decrypt = _CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: _CryptoJS.mode.CBC, padding: _CryptoJS.pad.Pkcs7 });
        // let decryptedStr = decrypt.toString(_CryptoJS.enc.Utf8);
        // return decryptedStr.toString();
    }

    public getItem(key: string, defaultValue: any = null) {
        let value = cc.sys.localStorage.getItem(key);
        if (value) {
            //解析
            try {
                let data = this.decryption(value);
                let result: StorageData = JSON.parse(data);
                if ( result.type ){
                    return result.value;
                }else{
                    return value;
                }
            } catch (error) {
                return value;   
            }
        }
        else {
            return defaultValue;
        }
    }

    public setItem(key: string, value: string | number | boolean | object) {

        let type = typeof value;
        if (type == "number" || type == "string" || type == "boolean" || type == "object") {
            let saveObj: StorageData = { type: type, value: value };
            //加密
            try {
                let data = this.encrypt(saveObj);
                cc.sys.localStorage.setItem(key, data);
            } catch (error) {
                if ( CC_DEBUG ) cc.error(error);
            }
        } else {
            if (CC_DEBUG) cc.error(`存储数据类型不支持 当前的存储类型: ${type}`);
        }
    }

    public removeItem(key: string) {
        cc.sys.localStorage.removeItem(key);
    }
}