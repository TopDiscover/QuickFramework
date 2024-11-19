
export interface FetchResponse {
    /**@description 请求是否成功 */
    ok: boolean,
    /**@description 请求状态码 */
    status: number,
    /**@description 请求状态文本 */
    statusText: string,
    /**@description 请求url */
    url: string,
    /**@description 解析json */
    json: () => Promise<any>,
    /**@description 解析文本 */
    text: () => Promise<string>,
    /**@description 解析arrayBuffer */
    arrayBuffer: () => Promise<ArrayBuffer>,
    /**@description 解析blob */
    blob: () => Promise<Blob>,
    /**@description 解析formData */
    formData: () => Promise<FormData>,
}

export interface FetchOptions {
    /**@description 请求方法 默认为GET */
    method?: "POST" | "GET",
    /**@description 请求头 */
    headers?:  [string, string][] | Record<string, string>,
    /**@description 超时时间 默认为10s*/
    timeout?: number,
    /**@description 请求体 */
    body?: Document | XMLHttpRequestBodyInit | null,
    /**@description 请求参数 */
    params?: Object,
    /**@description 是否自动附加当前时间戳 */
    timestamp?: boolean,
    /**@description 是否同步 */
    async?:boolean;
    /**@description 响应类型 */
    responseType?: XMLHttpRequestResponseType;
}

export class HttpClient implements ISingleton {
    static module: string = "【Http管理器】";
    module: string = null!;
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

    fetch(url: string , options: FetchOptions = {}) {
        return new Promise<FetchResponse>((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            // 设置请求方法和 URL
            const method = options.method || 'GET';
            url = this.convertParams(url, options.params);
            if (options.timestamp) {
                if (url.indexOf("?") >= 0) {
                    url = `${url}&cur_loc_t=${Date.now()}`;
                } else {
                    url = `${url}?cur_loc_t=${Date.now()}`;
                }
            }

            if ( options.async == undefined ) {
                options.async = true;
            }

            if ( options.responseType == undefined ) {
                options.responseType = "";
                if ( CC_JSB ) {
                    options.responseType = "text";
                }
            }

            xhr.responseType = options.responseType;

            // 处理响应
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 解析响应数据
                        const response: FetchResponse = {
                            ok: true,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            url: xhr.responseURL,
                            json: () => Promise.resolve(JSON.parse(xhr.responseText)),
                            text: () => Promise.resolve(xhr.responseText),
                            arrayBuffer: () => Promise.resolve(xhr.response),
                            blob: () => Promise.resolve(xhr.response),
                            formData: () => Promise.resolve(xhr.response),
                        };
                        resolve(response);
                    } else {
                        reject(new Error(`HTTP error status: ${xhr.status}`));
                    }
                } else {
                    // Log.d(`readyState ${xhr.readyState}`);
                }
            };

            // 处理错误
            xhr.onerror = () => {
                reject(new Error('Network error'));
            };

            // 处理超时
            xhr.ontimeout = () => {
                reject(new Error('Request timed out'));
            };

            // 设置超时（可选）
            xhr.timeout = options.timeout || 10000;
            if (CC_DEBUG) Log.d(`[send] url : ${url} request type : ${method} , async : ${options.async}`);
            xhr.open(method, url,options.async);

            // 设置请求头
            if (options.headers) {
                if (Array.isArray(options.headers)) {
                    options.headers.forEach((header) => {
                        xhr.setRequestHeader(header[0], header[1]);
                    });
                } else {
                    Object.keys(options.headers).forEach(key => {
                        xhr.setRequestHeader(key, options.headers[key]);
                    });
                }
            }

            // 发送请求
            if (method === 'POST' && options.body) {
                xhr.send(options.body);
            } else {
                xhr.send();
            }
        });
    }
}