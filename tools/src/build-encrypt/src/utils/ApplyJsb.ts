import { writeFileSync,readFileSync,unlinkSync,copyFile,existsSync} from "fs";
import path from "path";
import { Common } from "./Common";
/**原生处理源码 */
export class ApplyJsb extends Common{

    /**文件前缀 */
    private encriptSign = "";

    /**加密key */
    private encriptKey = "";

    constructor(_encriptSign : string, _encriptKey:string){
        super();
        this.encriptSign = _encriptSign
        this.encriptKey = _encriptKey
        this.insertToFileUtils();
    }

    private h_str =  `virtual void valueVectorCompact(ValueVector& valueVector);

        std::string decriptSign = "sign";
        std::string decriptKey = "key";

        public:
        void setDecriptKeyAndSign(std::string sign = "",std::string key = "");
    };

    // end of support group
    /** @} */

    NS_CC_END

    #endif    // __CC_FILEUTILS_H__`;

    private cpp_str =   `bool FileUtils::init()
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
  
    private insertToFileUtils() {
        let enginePath = Editor.url("unpack://engine")
        let cocosPlatformPath = path.join(enginePath,"../cocos2d-x/cocos/platform")
        this.log("cocosPlatformPath",cocosPlatformPath)

        let CCFileUtils_h = path.join(cocosPlatformPath,"CCFileUtils.h")
        let CCFileUtils_cpp = path.join(cocosPlatformPath,"CCFileUtils.cpp")

        do{
            let hStr = readFileSync(CCFileUtils_h,'utf8');
            if(hStr.indexOf("setDecriptKeyAndSign")>=0){
                break;
            }
            let arr_1 = hStr.split("virtual void valueVectorCompact(ValueVector& valueVector);");
            let arr_2 = hStr.split("#endif    // __CC_FILEUTILS_H__");

            let newStr = arr_1[0]+this.h_str+arr_2[1];
            if(!existsSync(CCFileUtils_h+".bak")){
                copyFile(CCFileUtils_h,CCFileUtils_h+".bak",function (err) {})
            }
            
            /**直接写会写失败，曲折一下 */
            // Fs.writeFileSync(CCFileUtils_h,newStr);
            unlinkSync(CCFileUtils_h)
            writeFileSync(CCFileUtils_h+".temp",newStr);
            copyFile(CCFileUtils_h+".temp",CCFileUtils_h,function (err) {if(err){Editor.log(err)}})
            unlinkSync(CCFileUtils_h+".temp")
        }while(false)

        do{
            let keyLine = `setDecriptKeyAndSign("${this.encriptSign}","${this.encriptKey}");`
            let cppStr = readFileSync(CCFileUtils_cpp,'utf8');
            if(cppStr.indexOf(keyLine)>=0){
                break;
            }
            let arr_1 = cppStr.split("bool FileUtils::init()")
            let arr_2 = cppStr.split("FileUtils::Status FileUtils::getContents(const std::string& filename, ResizableBuffer* buffer)")

            this.cpp_str = this.cpp_str.replace('setDecriptKeyAndSign("tempEncriptSign","tempEncriptKey");',keyLine)
            let newStr = arr_1[0]+this.cpp_str+arr_2[1];
            if(!existsSync(CCFileUtils_cpp+".bak")){
                copyFile(CCFileUtils_cpp,CCFileUtils_cpp+".bak",function (err) {})
            }

            /**直接写会写失败，曲折一下 */
            // Fs.writeFileSync(CCFileUtils_cpp,newStr);
            unlinkSync(CCFileUtils_cpp)
            writeFileSync(CCFileUtils_cpp+".temp",newStr);
            copyFile(CCFileUtils_cpp+".temp",CCFileUtils_cpp,function (err) {if(err){Editor.log(err)}})
            unlinkSync(CCFileUtils_cpp+".temp")
        }while(false)
    }
    
}