import { DEBUG, JSB } from "cc/env";

export class FetchResponse {
    /**@description 请求是否成功 */
    ok: boolean = false;
    /**@description 请求状态码 */
    status: number = 0;
    /**@description 请求状态文本 */
    statusText: string = "";
    /**@description 请求url */
    url: string = "";
    /**@description 解析json */
    json() {
        return Promise.resolve(JSON.parse(this.responseText));
    }
    /**@description 解析文本 */
    text() {
        return Promise.resolve(this.responseText);
    }
    /**@description 解析arrayBuffer */
    arrayBuffer() {
        return Promise.resolve(this.response);
    }
    /**@description 解析blob */
    blob() {
        return Promise.resolve(this.response);
    }
    /**@description 解析formData */
    formData() {
        return Promise.resolve(this.response);
    }
    /**@description 响应文本 */
    responseText: any;
    /**@description 响应数据 */
    response: any;
}

export interface FetchOptions {
    /**@description 请求方法 默认为GET */
    method?: "POST" | "GET",
    /**@description 请求头 */
    headers?: [string, string][] | Record<string, string>,
    /**@description 超时时间 默认为10s*/
    timeout?: number,
    /**@description 请求体 */
    body?: Document | XMLHttpRequestBodyInit | null,
    /**@description 请求参数 */
    params?: Object,
    /**@description 是否自动附加当前时间戳 */
    timestamp?: boolean,
    /**@description 是否同步 */
    async?: boolean;
    /**@description 响应类型 */
    responseType?: XMLHttpRequestResponseType;

    /**@description 是否启用缓存  默认为false*/
    cache?: boolean;
    /**@description 缓存时间（毫秒）默认为5分钟 */
    cacheTime?: number;
    /**@description 重试次数 默认为3 */
    retries?: number;
    /**@description 重试间隔（毫秒） 默认为2s */
    retryDelay?: number;
    /**@description 取消请求的信号 */
    signal?: AbortSignal;
}

interface CacheData {
    /**@description 缓存时间(毫秒) */
    cacheTime: number;
    /**@description 缓存时间戳 */
    timestamp: number;
    /**@description 缓存数据 */
    data: FetchResponse;
}

export class HttpClient implements ISingleton {
    static module: string = "【Http管理器】";
    module: string = null!;

    // 缓存存储
    private _cache: Map<string, CacheData> = new Map();

    // 清理过期缓存的方法
    clear() {
        const now = Date.now();
        this._cache.forEach((value, key) => {
            if (now - value.timestamp > value.cacheTime) {
                this._cache.delete(key);
            }
        });
    }

    protected convertParams(url: string, params?: Object): string {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        const temp = params as any;
        // More compatible method for converting object entries
        const queryParams = Object.keys(temp)
            .filter(key => temp[key] !== null && temp[key] !== undefined)
            .map(key => {
                const value = temp[key];
                return value instanceof Object
                    ? `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
                    : `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            .join('&');

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${queryParams}`;
    }

    private getCacheKey(url: string, options: FetchOptions): string {
        // 生成包含URL和关键请求参数的唯一缓存键
        const paramString = options.params ? JSON.stringify(options.params) : '';
        return `${url}:${paramString}:${options.method || 'GET'}`;
    }

    fetch(url: string, options: FetchOptions = {}) {
        return new Promise<FetchResponse>((resolve, reject) => {
            // url为空
            if (!url) {
                reject(new Error('URL is empty'));
                return;
            }
            // 设置默认参数
            const defaultOptions: FetchOptions = {
                method: 'GET',
                timeout: 10000,
                async: true,
                responseType: JSB ? "text" : "",
                cache: false,
                cacheTime: 5 * 60 * 1000,
                retries: 3,
                retryDelay: 2000
            };
            // 合并参数
            const mergedOptions: FetchOptions = {
                ...defaultOptions,
                ...options,
            };

            // 缓存处理
            if (mergedOptions.cache) {
                this.clear();
                const cacheKey = this.getCacheKey(url, mergedOptions);
                const cachedData = this._cache.get(cacheKey);
                if (cachedData) {
                    DEBUG && Log.d(`${this.module} url : ${this.convertParams(url, options.params)} 从缓存中获取数据`);
                    return resolve(cachedData.data);
                }
            }

            // 重试处理
            let retryCount = 0;

            let isAborted = false;
            let onAbort = () => {
                isAborted = true;
            };

            const retry = () => {
                this.execute(url, mergedOptions,onAbort)
                    .then(resolve)
                    .catch((error) => {
                        if (isAborted) {
                            DEBUG && Log.d(`${this.module} url : ${this.convertParams(url, options.params)} 取消请求`);
                            reject(new Error('Request aborted'));
                            return;
                        }
                        if (retryCount < mergedOptions.retries!) {
                            retryCount++;
                            DEBUG && Log.d(`${this.module} url : ${this.convertParams(url, options.params)} 重试次数 : ${retryCount}`);
                            setTimeout(() => {
                                retry();
                            }, mergedOptions.retryDelay);
                        } else {
                            reject(error);
                        }
                    });
            };

            // 执行请求
            retry();

        });
    }

    private execute(url: string, options: FetchOptions = {},onAbort : () => void = () => {}) {
        return new Promise<FetchResponse>((resolve, reject) => {

            const oringinalUrl = url;
            // 设置请求方法和 URL
            const method = options.method!;
            url = this.convertParams(url, options.params);
            if (options.timestamp) {
                // 附加当前时间戳
                const separator = url.includes('?') ? '&' : '?';
                url = `${url}${separator}cur_loc_t=${Date.now()}`;
            }

            let xhr = new XMLHttpRequest();
            xhr.responseType = options.responseType!;

            // 处理取消请求
            if (options.signal) {
                options.signal.addEventListener('abort', () => {
                    onAbort();
                    xhr.abort();
                    reject(new Error('Request aborted'));
                });
            }

            const self = this;
            // 处理响应
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 解析响应数据
                        let resp = new FetchResponse();
                        resp.ok = true;
                        resp.status = xhr.status;
                        resp.statusText = xhr.statusText;
                        resp.url = xhr.responseURL;
                        resp.responseText = xhr.responseText;
                        resp.response = xhr.response;
                        // 缓存处理
                        if (options.cache) {
                            const cacheKey = self.getCacheKey(oringinalUrl, options);
                            const now = Date.now();
                            const cacheData: CacheData = {
                                cacheTime: options.cacheTime!,
                                timestamp: now,
                                data: resp,
                            };
                            self._cache.set(cacheKey, cacheData);
                        }
                        resolve(resp);
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
            xhr.timeout = options.timeout!;
            if (DEBUG) Log.d(`[send] url : ${url} request type : ${method} , async : ${options.async}`);
            xhr.open(method, url, options.async!);

            // 设置请求头
            if (options.headers) {
                if (Array.isArray(options.headers)) {
                    options.headers.forEach((header) => {
                        xhr.setRequestHeader(header[0], header[1]);
                    });
                } else {
                    const headers = options.headers as Record<string, string>;
                    Object.keys(headers).forEach(key => {
                        xhr.setRequestHeader(key, headers[key]);
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