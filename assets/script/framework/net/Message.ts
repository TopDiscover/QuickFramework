

/**@description 与服务器交互的消息 */
export class Message {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 解析后包体数据 */
    data: any = null;
    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null;

    /**@description 数据填充 */
    protected fillData() {

    }

    /**@description 转换成Uint8Array buffer */
    protected toBuffer() {
        let obj: { mainCmd?: number, subCmd?: number, data?: any } = {};
        obj.mainCmd = this.mainCmd;
        obj.subCmd = this.subCmd;
        obj.data = this.data ? this.data : {};
        let result = JSON.stringify(obj);
        this.buffer = new Uint8Array(result.length);
        for (let i = 0; i < result.length; i++) {
            this.buffer[i] = result.charCodeAt(i);
        }
    }

    /**@description 打包数据 */
    encode(): boolean {
        try {
            this.fillData();
            this.toBuffer();
            return true;
        } catch (error) {
            cc.error(error);
            return false;
        }
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        if (data) {
            this.buffer = data;
            let result = "";
            for (let i = 0; i < data.length; i++) {
                result += String.fromCharCode(data[i]);
            }
            if (result.length > 0) {
                try {
                    this.data = JSON.parse(result);
                    this.mainCmd = this.data.mainCmd;
                    this.subCmd = this.data.subCmd;
                    this.data = this.data.data ? this.data.data : {};
                } catch (error) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}