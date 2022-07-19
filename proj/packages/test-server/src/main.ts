import Helper from "./impl/Helper";

export function load(){
    
}

export function unload(){

}

export const messages = {
    startServer :()=>{
        const helper = new Helper();
        helper.logger = Editor;
        helper.start();
    }
}