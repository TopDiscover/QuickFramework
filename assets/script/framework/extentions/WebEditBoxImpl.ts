import { resolutionHelper } from "../adaptor/ResolutionHelper";

class WebEditBoxHelper {
    private static _instance: WebEditBoxHelper = null;
    public static get instance() { return this._instance || (this._instance = new WebEditBoxHelper()); }
    private input: HTMLInputElement = null;
    private textarea: HTMLTextAreaElement = null;
    private div: HTMLDivElement = null;
    init() {
        if (this.div == null) {
            //创建一个全黑色的半透明背景
            let div = window.document.createElement("div");
            div.style.width = "100%";
            div.style.height = "100%";
            div.style.margin = "0px";
            div.style.position = "absolute";
            div.style.zIndex = "1000";
            div.style.bottom = "0px";
            div.style.left = "0px";
            div.style.backgroundColor = "#000";
            div.style.opacity = "0.5";
            div.style.visibility = "hidden";
            div.id = "input_background";

            cc.game.container.appendChild(div);
            this.div = div;
        }

        if (this.input == null) {
            let input = window.document.createElement("input");
            input.style.zIndex = "1001"
            input.id = "EditBox_Input";
            input.style.visibility = "hidden";
            input.style.width = "98%";
            input.style.height = "30px";
            input.style.border = "2px";
            input.style.borderColor = "blue";
            input.style.position = "absolute";
            input.style.top = "5px";
            input.style.left = "1%";
            input.style.borderRadius = "5px";
            input.style.fontSize = "25px";
            (<any>input.style).type = "text";
            input.style['-moz-appearance'] = "textfield";

            cc.game.container.appendChild(input);
            this.input = input;
        }

        if (this.textarea == null) {
            let textarea = window.document.createElement("textarea");
            textarea.style.zIndex = "1001";
            textarea.id = "EditBox_Textarea";
            textarea.style.visibility = "hidden"
            textarea.style.width = "98%";
            textarea.style.height = "50px";
            textarea.style.border = "2px";
            textarea.style.borderColor = "blue";
            textarea.style.position = "absolute";
            textarea.style.top = "5px";
            textarea.style.left = "1%";
            textarea.style.borderRadius = "5px";
            textarea.style.resize = "none";
            textarea.style.fontSize = "25px";
            (<any>textarea.style).overflow_y = "scroll";
            textarea.style.overflowY = "scroll";
            cc.game.container.appendChild(textarea);
            this.textarea = textarea;
        }

        window.addEventListener("orientationchange", this.onOrientationChange.bind(this), false);

        this.hideDom();
    }


    private onOrientationChange(){
        if ( this.input ) this.input.blur();
        if ( this.textarea ) this.textarea.blur();
    }

    private adjust(rotate: number | string) {
        if (rotate == 0 || rotate == 180) {
            let height = parseInt(cc.game.container.style.height);
            let rate = 0.90;
            let width = height * rate;
            if (this.input) {
                this.input.style.width = `${width}px`;
                this.input.style.top = `${width / 2}px`;
                this.input.style.transform = "rotate(-90deg)";
                this.input.style.left = `-${width / 2 - 30}px`;
            }
            if (this.textarea) {
                this.textarea.style.width = `${width}px`;
                this.textarea.style.top = `${width / 2}px`;
                this.textarea.style.transform = "rotate(-90deg)";
                this.textarea.style.left = `-${width - 50}px`;
            }
        } else {
            if (this.input) {
                this.input.style.width = "98%";
                this.input.style.top = "5px";
                this.input.style.transform = "rotate(0deg)";
                this.input.style.left = "1%";
            }
            if (this.textarea) {
                this.textarea.style.width = "98%";
                this.textarea.style.top = "5px";
                this.textarea.style.transform = "rotate(0deg)";
                this.textarea.style.left = "1%";
            }
        }
    }

    createTextArea() {
        return this.textarea;
    }

    createInput() {
        return this.input;
    }

    hideDom() {
        if (this.div) { this.div.style.visibility = "hidden"; }
        if (this.input) { this.input.style.visibility = "hidden"; }
        if (this.textarea) { this.textarea.style.visibility = "hidden"; }
    }

    showDom(isTextArea: boolean) {
        if (this.input && this.textarea) {
            if (this.div) { this.div.style.visibility = "visible"; }
            this.input.style.visibility = isTextArea ? "hidden" : "visible";
            this.textarea.style.visibility = isTextArea ? "visible" : "hidden";
            this.adjust(window.orientation);
        }
    }
}

export default class WebEditBoxImpl {

    private _delegate = null;
    private _elem: HTMLElement = null;
    private _isTextArea = false;
    // event listeners
    private _eventListeners: any = {};
    private _isFocus = false;

    init(delegate) {
        if (!delegate) {
            return;
        }
        this._delegate = delegate;
        WebEditBoxHelper.instance.init();

        if (delegate.inputMode === cc.EditBox.InputMode.ANY) {
            this._createTextArea();
        } else {
            this._createInput();
        }
    }

    enable() {
        //do nothing
    }

    disable() {
        if (this._isFocus) {
            this._elem.blur();
        }
    }

    clear() {
        if (this._isFocus) {
            this._removeEventListeners();
            WebEditBoxHelper.instance.hideDom();
        }
    }

    update() {

    }

    setTabIndex(index) {
        // Only support on Web platform  
    }

    setSize(width, height) {
        // Only support on Web platform
    }

    setFocus(value) {
        if (value) {
            this.beginEditing();
        } else {
            this._isFocus = false;
        }
    }

    isFocused() {
        return this._isFocus;
    }

    beginEditing() {
        this._isFocus = true;
        resolutionHelper().isShowKeyboard = true;
        this._showDom();
        this._registerEventListeners();
        this._elem.focus();

        this._delegate.editBoxEditingDidBegan();
    }

    endEditing() {

    }

    private _createTextArea() {
        this._isTextArea = true;
        this._elem = WebEditBoxHelper.instance.createTextArea();
    }

    private _createInput() {
        this._isTextArea = false;
        this._elem = WebEditBoxHelper.instance.createInput();
    }

    private _showDom() {
        WebEditBoxHelper.instance.showDom(this._isTextArea);
        this._updateMaxLength();
        this._updateInputType();
        this._updateStyleSheet();
        //this._delegate._hideLabels();
    }

    private _hideDom() {
        if (this._isFocus) {
            WebEditBoxHelper.instance.hideDom();
            //this._delegate._showLabels();
        }
    }

    private _updateInputType() {
        let delegate = this._delegate,
            inputMode = delegate.inputMode,
            inputFlag = delegate.inputFlag,
            returnType = delegate.returnType,
            elem = this._elem;

        // FIX ME: TextArea actually dose not support password type.
        if (this._isTextArea) {
            // input flag
            let textTransform = 'none';
            if (inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
                textTransform = 'uppercase';
            }
            else if (inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_WORD) {
                textTransform = 'capitalize';
            }
            elem.style.textTransform = textTransform;
            return;
        }

        // begin to updateInputType
        if (inputFlag === cc.EditBox.InputFlag.PASSWORD) {
            (<any>elem).type = 'password';
            return;
        }

        // input mode
        let type = (<any>elem).type;
        if (inputMode === cc.EditBox.InputMode.EMAIL_ADDR) {
            type = 'email';
        } else if (inputMode === cc.EditBox.InputMode.NUMERIC || inputMode === cc.EditBox.InputMode.DECIMAL) {
            type = 'number';
        } else if (inputMode === cc.EditBox.InputMode.PHONE_NUMBER) {
            type = 'number';
            (<any>elem).pattern = '[0-9]*';
        } else if (inputMode === cc.EditBox.InputMode.URL) {
            type = 'url';
        } else {
            type = 'text';

            if (returnType === cc.EditBox.KeyboardReturnType.SEARCH) {
                type = 'search';
            }
        }
        (<any>elem).type = type;

        // input flag
        let textTransform = 'none';
        if (inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            textTransform = 'uppercase';
        }
        else if (inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_WORD) {
            textTransform = 'capitalize';
        }
        elem.style.textTransform = textTransform;
    }

    private _updateMaxLength() {
        let maxLength = this._delegate.maxLength;
        if (maxLength < 0) {
            //we can't set Number.MAX_VALUE to input's maxLength property
            //so we use a magic number here, it should works at most use cases.
            maxLength = 65535;
        }
        (<any>this)._elem.maxLength = maxLength;
    }

    private _updateStyleSheet() {
        let delegate = this._delegate,
            elem = this._elem;
        (<any>elem).value = delegate.string;
        (<any>elem).placeholder = delegate.placeholder;
    }


    private _registerEventListeners() {
        let impl = this,
            elem = this._elem,
            inputLock = false,
            cbs = this._eventListeners;

        cbs.compositionStart = function () {
            inputLock = true;
        };

        cbs.compositionEnd = function () {
            inputLock = false;
            impl._delegate.editBoxTextChanged((<any>elem).value);
        };

        cbs.onInput = function () {
            if (inputLock) {
                return;
            }

            let _elem: any = elem;

            if (_elem.value.length > _elem.maxLength) _elem.value = _elem.value.slice(0, _elem.maxLength);

            impl._delegate.editBoxTextChanged((<any>elem).value);
        };

        cbs.onKeydown = function (e) {
            if (e.keyCode === cc.macro.KEY.enter) {
                e.stopPropagation();
                impl._delegate.editBoxEditingReturn();

                if (!impl._isTextArea) {
                    elem.blur();
                }
            }
            else if (e.keyCode === cc.macro.KEY.tab) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        cbs.onBlur = function () {
            impl._hideDom();
            impl._isFocus = false;
            resolutionHelper().isShowKeyboard = false;
            //删除注册事件
            impl._removeEventListeners();
            impl._delegate.editBoxEditingDidEnded();
        };

        elem.addEventListener('compositionstart', cbs.compositionStart);
        elem.addEventListener('compositionend', cbs.compositionEnd);
        elem.addEventListener('input', cbs.onInput);
        elem.addEventListener('keydown', cbs.onKeydown);
        elem.addEventListener('blur', cbs.onBlur);
        elem.addEventListener('touchstart', cbs.onClick);
    }

    private _removeEventListeners() {
        let elem = this._elem,
            cbs = this._eventListeners;

        let len = Object.keys(cbs).length;
        if (len > 0) {
            elem.removeEventListener('compositionstart', cbs.compositionStart);
            elem.removeEventListener('compositionend', cbs.compositionEnd);
            elem.removeEventListener('input', cbs.onInput);
            elem.removeEventListener('keydown', cbs.onKeydown);
            elem.removeEventListener('blur', cbs.onBlur);
            elem.removeEventListener('touchstart', cbs.onClick);

            cbs.compositionStart = null;
            cbs.compositionEnd = null;
            cbs.onInput = null;
            cbs.onKeydown = null;
            cbs.onBlur = null;
            cbs.onClick = null;
            this._eventListeners = {};
        }
    }

}