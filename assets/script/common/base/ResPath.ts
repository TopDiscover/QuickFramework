export class GamePathDelegate{

    /**
     * @description 返回当前游戏的目录 即是games/xx/ 
     * @param path 相对于games/xx的路径
     * @example
     * res("audio") //若当前游戏为xx --> games/xx/audio
     * */
    res( path : string ) : string{
        return path;
    }
}

export class GamePath extends GamePathDelegate{
    private _delegate : GamePathDelegate = null;
    private _defaultDelegate  = new GamePathDelegate();
    public set delegate( value : GamePathDelegate ){
        this._delegate = value;
    }
    public get delegate( ){
        return this._delegate;
    }
    res( path : string ) : string{
        return this.delegate ? this.delegate.res(path) : this._defaultDelegate.res(path);
    }
    private static _instance: GamePath = null;
    public static get instance() { return this._instance || (this._instance = new GamePath()); }
}

export function HALL(path:string) {
    return "hall/" + path;  
};
export function GAME(path:string) {
    return GamePath.instance.res(path);
};

