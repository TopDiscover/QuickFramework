export interface INetHelper{
    sendProtoMessage( hello : string):void;
    sendJsonMessage( hello : string):void;
    sendBinaryMessage( hello : string):void;
}
