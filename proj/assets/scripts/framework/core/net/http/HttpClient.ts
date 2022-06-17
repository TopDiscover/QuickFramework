import { Http } from "./Http";

/**
 * @description http网络请求
 */

class HttpPackageData {
    data: any = null;
    url: string = null!;
    /**@description 超时设置 默认为10s*/
    timeout: number = 10000;
    /**@description 请求类型 默认为GET请求*/
    type: Http.Type = Http.Type.GET;
    /**@description 是否同步 */
    async : boolean = true;
    requestHeader: { name: string, value: string }[] | { name: string, value: string } | null = null;
    /**@description 发送接口时，默认为false 仅浏览器端生效
     * 自动附加当前时间的参数字段
     * 但如果服务器做了接口参数效验，可能会导致接口无法通过服务器验证，返回错误数据
     * @example 
     * 请求地址为http:www.baidu.com 当isAutoAttachCurrentTime 为 true为
     * 实际的请求接口为http:www.baidu.com?cur_loc_t=当前时间
     * 请求地址为http:www.baidu.com?uid=123 当isAutoAttachCurrentTime 为 true为
     * 实际的请求接口为http:www.baidu.com?uid=123&cur_loc_t=当前时间
     *  */
    isAutoAttachCurrentTime = false;
    private _responseType: XMLHttpRequestResponseType = "";
    public set responseType(type: XMLHttpRequestResponseType) {
        this._responseType = type;
    }
    public get responseType() {
        if (CC_JSB) {
            if (this._responseType == "") {
                this._responseType = "text";
            }
        }
        return this._responseType;
    }
}

/**
 * @description http 请求包
 */
export class HttpPackage {

    /**@description 跨域代理 */
    public static crossProxy: any = {};
    /**@description 当前主机地址 */
    public static location = { host: "", pathname: "", protocol: "" };

    private _data: HttpPackageData = new HttpPackageData();
    public set data(data: HttpPackageData) {
        this._data = data;
    }
    public get data(): HttpPackageData {
        return this._data;
    }

    private _params: Object = null!;
    /**
     * @description 传入的请求参数会拼在data.url 
     * @example params = { a : 10 , b : 20 }
     * 最终的url 为data.url?&a=10&b=20
     */
    public set params(value: Object) {
        this._params = value;
    }
    public get params() {
        return this._params;
    }
    /**
     * @description 发送请求包
     * @param cb 
     * @param errorcb 
     */
    public send(cb?: (data: any) => void, errorcb?: (errorData: Http.Error) => void) {
        Manager.http.request(this, cb, errorcb);
    }
}

export class HttpClient implements ISingleton{
    static module: string = "【Http管理器】";
    module: string = null!;
    protected crossProxy(url: string): string {
        //浏览器，非调试模式下
        if (cc.sys.isBrowser && !CC_PREVIEW && HttpPackage.crossProxy) {
            let config = HttpPackage.crossProxy;
            let location = HttpPackage.location;
            let keys = Object.keys(config);

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = config[key];

                if (url.indexOf(key) > -1) {
                    if (value.protocol && value.api) {
                        if (location.protocol != value.protocol) {
                            //所有跨域的都从当前服务器的代理转发，把https也得转化成http:
                            url = url.replace(value.protocol, location.protocol);
                        }
                        return url.replace(key, `${location.host}/${value.api}`);
                    }
                }
            }
            return url;
        } else {
            return url;
        }
    }

    protected convertParams(url: string, params: Object): string {
        if (params == null || params == undefined) {
            return url;
        }
        let result = "&";
        if (url.indexOf("?") < 0) {
            result = "?";
        }
        let keys = Object.keys(params)
        for (let i = 0; i < keys.length; i++) {
            if (i == 0) {
                result += `${keys[i]}=${(<any>params)[keys[i]]}`;
            } else {
                result += `&${keys[i]}=${(<any>params)[keys[i]]}`
            }
        }
        result = url + result;
        return result;
    }

    protected convertData( data : any ){
        return data;
    }

    request(httpPackage: HttpPackage, cb?: (data: any) => void, errorcb?: (errorData: Http.Error) => void) {

        let url = httpPackage.data.url;
        if (!url) {
            if ( CC_DEBUG ){
                Log.e(`reuqest url error`);
            }
            if (errorcb) errorcb({ type: Http.ErrorType.UrlError, reason: "错误的Url地址" });
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300)) {
                    if (xhr.responseType == "arraybuffer" || xhr.responseType == "blob") {
                        if (cb) cb(xhr.response);
                    } else {
                        if ( CC_DEBUG) Log.d(`htpp res(${xhr.responseText})`);
                        if (cb) cb(xhr.responseText);
                    }
                } else {
                    let reason = `请求错误,错误状态:${xhr.status}`;
                    Log.e(`request error status : ${xhr.status} url : ${url} `);
                    if (errorcb) errorcb({ type: Http.ErrorType.RequestError, reason: reason });
                }
            }
            else {
                //cc.log(`readyState ${xhr.readyState}`);
            }
        };

        xhr.responseType = httpPackage.data.responseType;

        xhr.timeout = httpPackage.data.timeout;
        xhr.ontimeout = () => {
            xhr.abort();//网络超时，断开连接
            if ( CC_DEBUG) Log.w(`request timeout : ${url}`);
            if (errorcb) errorcb({ type: Http.ErrorType.TimeOut, reason: "连接超时" });
        };

        xhr.onerror = () => {
            Log.e(`request error : ${url} `);
            if (errorcb) errorcb({ type: Http.ErrorType.RequestError, reason: "请求错误" });
        };

        if ( CC_DEBUG ) Log.d(`[send http request] url : ${url} request type : ${httpPackage.data.type} , responseType : ${xhr.responseType}`);

        url = this.crossProxy(url);
        url = this.convertParams(url,httpPackage.params);

        if ( cc.sys.isBrowser ){
            if ( httpPackage.data.isAutoAttachCurrentTime ){
                if ( url.indexOf("?") >=0 ){
                    url = `${url}&cur_loc_t=${Date.timeNow()}`;
                }else{
                    url = `${url}?cur_loc_t=${Date.timeNow()}`;
                }
            }
        }

        if (cc.sys.isBrowser && !CC_PREVIEW) {
            if ( CC_DEBUG) Log.d(`[send http request] corss prox url : ${url} request type : ${httpPackage.data.type} , responseType : ${xhr.responseType}`);
        }

        if (httpPackage.data.type === Http.Type.POST) {
            xhr.open(Http.Type.POST, url,httpPackage.data.async);
            if (httpPackage.data.requestHeader) {
                if( httpPackage.data.requestHeader instanceof Array ){
                    httpPackage.data.requestHeader.forEach((header)=>{
                        xhr.setRequestHeader(header.name, header.value);
                    });
                }else{
                    let header : { name: string, value: string } = httpPackage.data.requestHeader;
                    xhr.setRequestHeader(header.name,header.value);
                }
            }
            else {
                xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            }
            xhr.send( this.convertData(httpPackage.data.data) );
        }
        else {
            xhr.open(Http.Type.GET, url, httpPackage.data.async);
            if( httpPackage.data.requestHeader ){
                if( httpPackage.data.requestHeader instanceof Array ){
                    httpPackage.data.requestHeader.forEach((header)=>{
                        xhr.setRequestHeader(header.name, header.value);
                    });
                }else{
                    let header : { name: string, value: string } = httpPackage.data.requestHeader;
                    xhr.setRequestHeader(header.name,header.value);
                }
            }
            xhr.send();
        }
    }
}
