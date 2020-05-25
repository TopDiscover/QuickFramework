
let TAG = {
    NetEvent : "NetEvent_",
};

export let EventApi = {
    NetEvent : {
        ON_OPEN : TAG.NetEvent + "ON_OPEN",
        ON_CLOSE : TAG.NetEvent + "ON_CLOSE",
        ON_ERROR : TAG.NetEvent + "ON_ERROR",
    },
    AdaptScreenEvent : "AdaptScreenEvent",
} 

export enum CustomNetEventType{
    /**@description 应用层主动调用网络层close */
    CLOSE  = "CustomClose",
}