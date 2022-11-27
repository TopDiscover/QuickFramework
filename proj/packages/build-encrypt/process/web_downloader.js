
function parseParameters (options, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isCallback = typeof options === 'function';
        if (onProgress) {
            onComplete = onProgress;
            if (!isCallback) {
                onProgress = null;
            }
        }
        else if (onProgress === undefined && isCallback) {
            onComplete = options;
            options = null;
            onProgress = null;
        }
        if (onProgress !== undefined && isCallback) {
            onProgress = options;
            options = null;
        }
    }
    options = options || Object.create(null);
    return { options, onProgress, onComplete };
}

/**ArrayBuffer转字符串 */
function arrayBuffer2Text(buffer,onComplete) {
    var b = new Blob([buffer]);
    var r = new FileReader();
    r.readAsText(b, 'utf-8');
    r.onload = function (){
        onComplete&&onComplete(null,r.result)
    }
    r.onerror = function (e) {
        onComplete&&onComplete(r.error,r.result)
    }
}

function arrayBufferToBase64Img(buffer){
    const str = String.fromCharCode(...new Uint8Array(buffer));
    return window.btoa(str);
}


function downloadFile (url, options, onProgress, onComplete) {
    var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

    var xhr = new XMLHttpRequest(), errInfo = 'download failed: ' + url + ', status: ';

    xhr.open('GET', url, true);

    if (options.responseType !== undefined) xhr.responseType = options.responseType;
    if (options.withCredentials !== undefined) xhr.withCredentials = options.withCredentials;
    if (options.mimeType !== undefined && xhr.overrideMimeType ) xhr.overrideMimeType(options.mimeType);
    if (options.timeout !== undefined) xhr.timeout = options.timeout;

    if (options.header) {
        for (var header in options.header) {
            xhr.setRequestHeader(header, options.header[header]);
        }
    }

    xhr.onload = function () {
        if ( xhr.status === 200 || xhr.status === 0 ) {
            onComplete && onComplete(null, xhr.response);
        } else {
            onComplete && onComplete(new Error(errInfo + xhr.status + '(no response)'));
        }

    };

    if (onProgress) {
        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                onProgress(e.loaded, e.total);
            }
        };
    }

    xhr.onerror = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(error)'));
    };

    xhr.ontimeout = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(time out)'));
    };

    xhr.onabort = function(){
        onComplete && onComplete(new Error(errInfo + xhr.status + '(abort)'));
    };

    xhr.send(null);
    
    return xhr;
}

function _getRealPath(path) {
	let excludeChangeNameList = [".mp3",".ogg",".wav",".js",".jsc",]
	if(path.indexOf("assets")!=0){
		return path
	}
    if(!needMixFilename){//tag
        return path;
    }
	for(let ext of excludeChangeNameList){
	  if(path.endsWith(ext)){
		  return path
	  }
	}
	var ext = path.substr(path.lastIndexOf("."));
	var arr = path.split('/');
	let name = arr[arr.length-1];
	let realPath = path;

	if(name[8]=="-"&&name[13]=="-"&&name[18]=="-"&&name[23]=="-"){
		let md5 = hyz.str_to_md5(name+nameMixSign)
		let arr2 = [8,13,18,23]
		for(let i = arr2.length-1;i>=0;i--){
		  let idx = arr2[i];
		  md5 = md5.slice(0, idx) + "-" + md5.slice(idx);
		}
		md5+=ext;
	
	  realPath = path.replace(name,md5);
	  realPath = realPath.replace("/"+name.slice(0,2)+"/","/"+md5.slice(0,2)+"/");
	  realPath = realPath.replace("\\"+name.slice(0,2)+"\\","\\"+md5.slice(0,2)+"\\");
	}

	return realPath
};

function downloadArrayBuffer (url, options, onComplete) {
    options.responseType = "arraybuffer";
    url = _getRealPath(url)
    downloadFile(url, options, options.onFileProgress, function (err,data) {
        if(!err){
            ///解密
            data = _decriptTool.decodeArrayBuffer(data);
        }
        onComplete&&onComplete(err,data)
    });
};

function downloadText (url, options, onComplete) {
    downloadArrayBuffer(url,options,function (err,data) {
        if(err){
            onComplete&&onComplete(err,data)
        }else{
            ///转化成Text
            arrayBuffer2Text(data,function(err,text) {
                if(err){
                    onComplete&&onComplete(err,data)
                }else{
                    onComplete&&onComplete(null,text)
                }
            })
        }
    })
};

function downloadJson(url, options, onComplete) {
    downloadText(url,options,function (err,data) {
        if(err){
            onComplete&&onComplete(err,data)
            return;
        }
        if (!err && typeof data === 'string') {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                err = e;
            }
        }
        onComplete && onComplete(err, data);
    })
}

function downloadDomImage (url, options, onComplete) {
    var { options, onComplete } = parseParameters(options, undefined, onComplete);

    var img = new Image();

    if (window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }

    function loadCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(null, img);
    }
    
    function errorCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
    return img;
}


const imgTypes = {
    "png":"image/png",
    "jpg":"image/jpg",
    "jpeg":"image/jpeg",
}

function downloadImage(url, options, onComplete) {
    downloadArrayBuffer(url,options,function(err, data){
        if(err){
            onComplete&&onComplete(null,data);
            return;
        }
        let index = url.lastIndexOf(".");
        let suffix = url.substr(index+1);
        let typeStr = imgTypes[suffix]||imgTypes["png"]

        if(cc.sys.capabilities.imageBitmap){
            let blob = new Blob([data],{type:typeStr})
            onComplete&&onComplete(null,blob);
        }else{
            let base64code = arrayBufferToBase64Img(data);
            base64code = `data:${typeStr};base64,${base64code}`
            downloadDomImage(base64code,options,onComplete)
        }
    })
};

const downloaded = {};

function downloadScript (url, options, onComplete) {
    var { options, onComplete } = parseParameters(options, undefined, onComplete);

    // no need to load script again
    if (downloaded[url]) {
        return onComplete && onComplete(null);
    }

    var d = document, s = document.createElement('script');

    if (window.location.protocol !== 'file:') {
        s.crossOrigin = 'anonymous';
    }

    s.async = options.async;
    s.src = url;
    function loadHandler () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        downloaded[url] = true;
        onComplete && onComplete(null);
    }

    function errorHandler() {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadHandler, false);
        s.removeEventListener('error', errorHandler, false);
        onComplete && onComplete(new Error(cc.debug.getError(4928, url)));
    }
    
    s.addEventListener('load', loadHandler, false);
    s.addEventListener('error', errorHandler, false);
    d.body.appendChild(s);
}

const REGEX = /^(?:\w+:\/\/|\.+\/).+/;
var downloadBundle = function (nameOrUrl, options, onComplete) {
    let bundleName = cc.path.basename(nameOrUrl);
    let url = nameOrUrl;
    if (!REGEX.test(url)) url = 'assets/' + bundleName;
    var version = options.version ||cc.assetManager.downloader.bundleVers[bundleName];
    var count = 0;
    var config = `${url}/config.${version ? version + '.' : ''}json`;
    let out = null, error = null;
    downloadJson(config, options, function (err, response) {
        if (err) {
            error = err;
        }
        out = response;
        out && (out.base = url + '/');
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });

    var js = `${url}/index.${version ? version + '.' : ''}js`;
    downloadScript(js, options, function (err) {
        if (err) {
            error = err;
        }
        count++;
        if (count === 2) {
            onComplete(error, out);
        }
    });
};

var downloaders = {
    // Images
    '.png' : downloadImage,
    '.jpg' : downloadImage,
    '.bmp' : downloadImage,
    '.jpeg' : downloadImage,
    '.gif' : downloadImage,
    '.ico' : downloadImage,
    '.tiff' : downloadImage,
    '.webp' : downloadImage,
    '.image' : downloadImage,
    '.pvr' : downloadArrayBuffer,
    '.pkm' : downloadArrayBuffer,

    // Audio
    // '.mp3' : downloadAudio,
    // '.ogg' : downloadAudio,
    // '.wav' : downloadAudio,
    // '.m4a' : downloadAudio,

    // Txt
    '.txt' : downloadText,
    '.xml' : downloadText,
    '.vsh' : downloadText,
    '.fsh' : downloadText,
    '.atlas' : downloadText,

    '.tmx' : downloadText,
    '.tsx' : downloadText,

    '.json' : downloadJson,
    '.ExportJson' : downloadJson,
    '.plist' : downloadText,

    '.fnt' : downloadText,

    // font
    // '.font' : loadFont,
    // '.eot' : loadFont,
    // '.ttf' : loadFont,
    // '.woff' : loadFont,
    // '.svg' : loadFont,
    // '.ttc' : loadFont,

    // // Video
    // '.mp4': downloadVideo,
    // '.avi': downloadVideo,
    // '.mov': downloadVideo,
    // '.mpg': downloadVideo,
    // '.mpeg': downloadVideo,
    // '.rm': downloadVideo,
    // '.rmvb': downloadVideo,

    // Binary
    '.binary' : downloadArrayBuffer,
    '.bin': downloadArrayBuffer,
    '.dbbin': downloadArrayBuffer,
    '.skel': downloadArrayBuffer,

    'bundle': downloadBundle,

    'default': downloadText
};

/**ArrayBuffer加密解密 */
class DecriptTool{
    constructor(encriptKey,encriptSign){
        this.setKeySign(encriptKey,encriptSign);
    }

    encriptSign = "";
    encriptKey = "";
    setKeySign(encriptKey,encriptSign){
        this.encriptKey = encriptKey;
        this.encriptSign = encriptSign;
    }

    strToBytes(str){
        let size = str.length;
        let result = [];
        for(let i=0;i<size;i++){
            result.push(str.charCodeAt(i));
        }
        return result;
    }
    
    checkIsEncripted(arrbuf,sign=this.encriptSign) {
        if(!sign){
            return false;
        }
        
        let signBuf = new Uint8Array(this.strToBytes(sign));
        let buffer = new Uint8Array(arrbuf);
        for(let i=0;i<signBuf.length;i++){
            if(buffer[i]!=signBuf[i]){
                return false;
            }
        }
        return true
    }
    
    decodeArrayBuffer(arrbuf,sign=this.encriptSign,key=this.encriptKey){
        if(!this.checkIsEncripted(arrbuf,sign)){
            return arrbuf;
        }
        let signBuf = new Uint8Array(this.strToBytes(sign));
        let keyBytes = this.strToBytes(key);
        let buffer = new Uint8Array(arrbuf);
    
        let size = buffer.length-signBuf.length;
        let _outArrBuf = new ArrayBuffer(size)
        let outBuffer = new Uint8Array(_outArrBuf)
        let idx = 0;
        for(let i=0;i<size;i++){
            let b = buffer[signBuf.length+i];
            let db = b^keyBytes[idx]
            if(++idx>=keyBytes.length){
                idx = 0
            }
            outBuffer[i] = db;
        }
    
        return outBuffer;
    }
}

var _decriptTool = new DecriptTool();

var needMixFilename = false;
var nameMixSign = "";

window.hyz = window.hyz || {};
let hyz = window.hyz;

hyz.register_decripted_downloader = function register_decripted_downloader(_encriptSign,_encriptKey) {
    _decriptTool.setKeySign(_encriptKey,_encriptSign)
    for(let key in downloaders){
        cc.assetManager.downloader.register(key,downloaders[key])
    }
}