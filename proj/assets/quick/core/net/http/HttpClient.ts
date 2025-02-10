
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
        if (!params || Object.keys(params).length === 0) {
            return url;
        }
    
        // 兼容性更好的参数转换方法
        const queryParams = Object.entries(params)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => 
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
            )
            .join('&');
    
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${queryParams}`;
    }

    fetch(url: string , options: FetchOptions = {}) {
        return new Promise<FetchResponse>((resolve, reject) => {
            // url为空
            if (!url) {
                reject(new Error('URL is empty'));
                return;
            }
            let xhr = new XMLHttpRequest();
            // 设置默认参数
            const defaultOptions: FetchOptions = {
                method: 'GET',
                timeout: 10000,
                async: true,
                responseType: CC_JSB ? "text" : "",
            };

            // 合并参数
            const mergedOptions: FetchOptions = {
                ...defaultOptions,
                ...options,
            };

            // 设置请求方法和 URL
            const method = mergedOptions.method;
            url = this.convertParams(url, mergedOptions.params);
            if (mergedOptions.timestamp) {
                // 附加当前时间戳
                const separator = url.includes('?') ? '&' : '?';
                url = `${url}${separator}cur_loc_t=${Date.now()}`;
            }

            xhr.responseType = mergedOptions.responseType;

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

            // 设置超时（可选)}
            xhr.timeout = mergedOptions.timeout;
            if (CC_DEBUG) Log.d(`[send] url : ${url} request type : ${method} , async : ${mergedOptions.async}`);
            xhr.open(method, url,mergedOptions.async);

            // 设置请求头
            if (mergedOptions.headers) {
                if (Array.isArray(mergedOptions.headers)) {
                    mergedOptions.headers.forEach((header) => {
                        xhr.setRequestHeader(header[0], header[1]);
                    });
                } else {
                    Object.keys(mergedOptions.headers).forEach(key => {
                        xhr.setRequestHeader(key, mergedOptions.headers[key]);
                    });
                }
            }

            // 发送请求
            if (method === 'POST' && mergedOptions.body) {
                xhr.send(mergedOptions.body);
            } else {
                xhr.send();
            }
        });
    }
}