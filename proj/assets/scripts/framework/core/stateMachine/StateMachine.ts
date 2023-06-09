type EGoToStateFunc<State> = (from: State) => State;
type EToState<State> = State | EGoToStateFunc<State>;

interface ITransitionDir<State> {
    from: State | State[] | '*';
    to: EToState<State>;
    onTransition?: (from: State, to: State) => void;
}

type ITransitions<T, State> = {
    [P in keyof T]: ITransitionDir<State> | ITransitionDir<State>[];
}

type TransitionCall<T, State> = {
    [P in keyof T]: (toState?: State) => void;
};

interface STOptions<T, State> {
    init: State;
    transitions: ITransitions<T, State>;
}

function BuildTransition<State>(from: State | State[] | '*', to: EToState<State>, onTransition?: (from: State, to: State) => void): ITransitionDir<State> {
    return {from, to, onTransition};
}

enum Code {
    NoFoundTransition,//找不到对应Transition
    Transiting,//正在执行
}

const reason = {
    [Code.NoFoundTransition] : `You can not {0} now. Current state is {1}`,
    [Code.Transiting] : `This is transiting now. You cannot transition more times at one time.`,
}

/**
 * @description 状态机
 */
export default class StateMachine<T, State> {
    static Bind = BuildTransition;
    static Code = Code;
    private _transitions: TransitionCall<T, State> = null!;
    private _curState: State;
    private _originTransitions: ITransitions<T, State> = null!;

    private _isTransiting = false;

    onBefore?: (from: State, to: State) => void;
    onAfter?: (from: State, to: State) => void;
    onError?: (code: number, reason: string) => void;

    constructor(option: STOptions<T, State>) {
        const {init, transitions} = option;

        this._curState = init;
        
        this.setupTransitions(transitions);
    }
    
    protected setupTransitions(transitions: ITransitions<T, State>) {
        this._originTransitions = transitions;
        this._transitions = {} as any;

        Object.keys(transitions).forEach(k => {
            const key = k as keyof T;

            const value: ITransitionDir<State> | ITransitionDir<State>[] = transitions[key];

            let self = this;
            this._transitions[key] = function(){
                if (!self.exist(key)) {
                    self.postError(Code.NoFoundTransition, String.format(reason[Code.NoFoundTransition],key,self._curState));
                    return;
                }

                if (self._isTransiting) {
                    self.postError(Code.Transiting,reason[Code.Transiting])
                    return;
                }

                const curState = self._curState;
                const dir = self._findDir(curState, value);

                if (dir == null) {
                    self.postError(Code.NoFoundTransition, String.format(reason[Code.NoFoundTransition],key,self._curState));
                    return;
                }
                const {to, onTransition} = dir;
                const toState = ((typeof to === 'function') ? ( Reflect.apply(to,this,arguments) /*(to as EGoToStateFunc<State>)(...arguments)*/) : to);

                self._isTransiting = true;
                self.onBefore && self.onBefore(curState, toState);
                onTransition && onTransition(curState, toState);
                self._curState = toState;
                self.onAfter && self.onAfter(curState, toState);


                self._isTransiting = false;
            };
        });
    }

    protected postError(code: number, reason: string) {
        this.onError && this.onError(code, reason);
    }

    get transition() {
        return this._transitions;
    }

    /**@description 获取当前状态机状态 */
    get state() {
        return this._curState;
    }

    /**@description 判断当前是否是该状态 */
    is(state: State) {
        return this._curState == state;
    }

    /**
     * @description 判断是否存在transition
     * @param t transition名
     */
    exist(t: keyof T) {
        const value: ITransitionDir<State> | ITransitionDir<State>[] = this._originTransitions[t];
        if (!value) {
            return false;
        }

        const dir = this._findDir(this._curState, value);
        return dir != null;
    }

    protected _findDir(from: State, dirs: ITransitionDir<State> | ITransitionDir<State>[]) {
        if (Array.isArray(dirs)) {
            return this._findDirOfArray(from, dirs);
        }

        if (this._isIncludeState(dirs.from, from)) {
            return dirs;
        }

        return null;
    }

    protected _findDirOfArray(from: State, dirs: (ITransitionDir<State>)[]) {
        for (const index in dirs) {
            const dir = dirs[index];
            if (this._isIncludeState(dir.from, from)) {
                return dir;
            }
        }

        return null;
    }

    protected _isIncludeState(state: State | State[] | '*', targetState: State) {
        if (state === '*') {
            return true;
        }

        if (targetState === state) {
            return true;
        }

        if (Array.isArray(state) && (state.indexOf(targetState) != -1)) {
            return true;
        }

        return false;
    }
}