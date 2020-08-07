
/**@description 与服务器交互的消息 */
export class Message {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 解析后的消息对象 */
    data: { mainCmd ?: number , subCmd ?: number , data ?: any } = {};
    /**@description 源消息进制流 */
    buffer : Uint8Array = null;

    /**@description 数据填充 */
    fillData(){
        this.data.mainCmd = this.mainCmd;
        this.data.subCmd = this.subCmd;
    }

    /**@description 转换成Uint8Array buffer */
    toBuffer(){
        let result = JSON.stringify(this.data);
        this.buffer = new Uint8Array(result.length);
        for( let i = 0 ; i < result.length ; i++){
            this.buffer[i] = result.charCodeAt(i);
        }
    }

    /**@description 打包数据 */
    encode(): boolean {
        this.fillData();
        this.toBuffer();
        return true;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        if ( data ){
            this.buffer = data;
            let result = "";
            for( let i = 0 ; i < data.length ; i++ ){
                result += String.fromCharCode(data[i]);
            }
            if ( result.length > 0 ){ 
                try {
                    this.data = JSON.parse(result);
                    this.mainCmd = this.data.mainCmd;
                    this.subCmd = this.data.subCmd;
                } catch (error) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}