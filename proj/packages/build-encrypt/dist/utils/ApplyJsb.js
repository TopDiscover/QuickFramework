"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyJsb = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Common_1 = require("./Common");
/**原生处理源码 */
class ApplyJsb extends Common_1.Common {
    constructor(_encriptSign, _encriptKey) {
        super();
        /**文件前缀 */
        this.encriptSign = "";
        /**加密key */
        this.encriptKey = "";
        this.h_str = `virtual void valueVectorCompact(ValueVector& valueVector);

        std::string decriptSign = "sign";
        std::string decriptKey = "key";

        public:
        void setDecriptKeyAndSign(std::string sign = "",std::string key = "");
    };

    // end of support group
    /** @} */

    NS_CC_END

    #endif    // __CC_FILEUTILS_H__`;
        this.cpp_str = `bool FileUtils::init()
    {
        _searchPathArray.push_back(_defaultResRootPath);
        _searchResolutionsOrderArray.push_back("");
        setDecriptKeyAndSign("tempEncriptSign","tempEncriptKey");
        return true;
    }
    
    void FileUtils::setDecriptKeyAndSign(std::string sign, std::string key)
    {
        this->decriptSign = sign;
        this->decriptKey = key;
    }
    
    void FileUtils::purgeCachedEntries()
    {
        _fullPathCache.clear();
    }
    
    std::string FileUtils::getStringFromFile(const std::string& filename)
    {
        std::string s;
        getContents(filename, &s);
        if (s.length() > decriptSign.size() && s.find(decriptSign.c_str()) == 0) {
            s.erase(0, decriptSign.size());
            int kindex = 0;
            for (int i = 0; i < s.length(); i++) {
                if (kindex >= decriptKey.size()) kindex = 0;
                s[i] ^= decriptKey[kindex];
                kindex++;
            }
        }
        return s;
    }
    
    Data FileUtils::getDataFromFile(const std::string& filename)
    {
        Data d;
        getContents(filename, &d);
        if (d.getSize() > 4) {
            unsigned char* bytes = d.getBytes();
            if (memcmp(bytes, decriptSign.c_str(), decriptSign.size()) == 0) {
                ssize_t realSize = d.getSize() - decriptSign.size();
                unsigned char* data = (unsigned char*)calloc(1, realSize);
                memcpy(data, bytes + decriptSign.size(), realSize);
                int kindex = 0;
                for (int i = 0; i < realSize; i++) {
                    if (kindex >= decriptKey.size()) kindex = 0;
                    data[i] ^= decriptKey[kindex];
                    kindex++;
                }
                d.fastSet(data, realSize);
            }
        }
        return d;
    }
    
    
    FileUtils::Status FileUtils::getContents(const std::string& filename, ResizableBuffer* buffer)`;
        this.encriptSign = _encriptSign;
        this.encriptKey = _encriptKey;
        this.insertToFileUtils();
    }
    insertToFileUtils() {
        let enginePath = Editor.url("unpack://engine");
        let cocosPlatformPath = path_1.default.join(enginePath, "../cocos2d-x/cocos/platform");
        this.log("cocosPlatformPath", cocosPlatformPath);
        let CCFileUtils_h = path_1.default.join(cocosPlatformPath, "CCFileUtils.h");
        let CCFileUtils_cpp = path_1.default.join(cocosPlatformPath, "CCFileUtils.cpp");
        do {
            let hStr = (0, fs_1.readFileSync)(CCFileUtils_h, 'utf8');
            if (hStr.indexOf("setDecriptKeyAndSign") >= 0) {
                break;
            }
            let arr_1 = hStr.split("virtual void valueVectorCompact(ValueVector& valueVector);");
            let arr_2 = hStr.split("#endif    // __CC_FILEUTILS_H__");
            let newStr = arr_1[0] + this.h_str + arr_2[1];
            if (!(0, fs_1.existsSync)(CCFileUtils_h + ".bak")) {
                (0, fs_1.copyFile)(CCFileUtils_h, CCFileUtils_h + ".bak", function (err) { });
            }
            /**直接写会写失败，曲折一下 */
            // Fs.writeFileSync(CCFileUtils_h,newStr);
            (0, fs_1.unlinkSync)(CCFileUtils_h);
            (0, fs_1.writeFileSync)(CCFileUtils_h + ".temp", newStr);
            (0, fs_1.copyFile)(CCFileUtils_h + ".temp", CCFileUtils_h, function (err) { if (err) {
                Editor.log(err);
            } });
            (0, fs_1.unlinkSync)(CCFileUtils_h + ".temp");
        } while (false);
        do {
            let keyLine = `setDecriptKeyAndSign("${this.encriptSign}","${this.encriptKey}");`;
            let cppStr = (0, fs_1.readFileSync)(CCFileUtils_cpp, 'utf8');
            if (cppStr.indexOf(keyLine) >= 0) {
                break;
            }
            let arr_1 = cppStr.split("bool FileUtils::init()");
            let arr_2 = cppStr.split("FileUtils::Status FileUtils::getContents(const std::string& filename, ResizableBuffer* buffer)");
            this.cpp_str = this.cpp_str.replace('setDecriptKeyAndSign("tempEncriptSign","tempEncriptKey");', keyLine);
            let newStr = arr_1[0] + this.cpp_str + arr_2[1];
            if (!(0, fs_1.existsSync)(CCFileUtils_cpp + ".bak")) {
                (0, fs_1.copyFile)(CCFileUtils_cpp, CCFileUtils_cpp + ".bak", function (err) { });
            }
            /**直接写会写失败，曲折一下 */
            // Fs.writeFileSync(CCFileUtils_cpp,newStr);
            (0, fs_1.unlinkSync)(CCFileUtils_cpp);
            (0, fs_1.writeFileSync)(CCFileUtils_cpp + ".temp", newStr);
            (0, fs_1.copyFile)(CCFileUtils_cpp + ".temp", CCFileUtils_cpp, function (err) { if (err) {
                Editor.log(err);
            } });
            (0, fs_1.unlinkSync)(CCFileUtils_cpp + ".temp");
        } while (false);
    }
}
exports.ApplyJsb = ApplyJsb;
