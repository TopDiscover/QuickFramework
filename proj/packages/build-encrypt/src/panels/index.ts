import { readFileSync } from 'fs-extra';
import { helper } from '../Helper';

const ProjectName = Editor.Project.name;
const ENCRYPT = ProjectName + '@Encrypt-object';
// panel/index.js, this filename needs to match the one registered in package.json
module.exports = Editor.Panel.extend({

    // css style for panel
    style: readFileSync(Editor.url('packages://build-encrypt/static/style/index.css'), 'utf-8'),

    // html template for panel
    template: readFileSync(Editor.url('packages://build-encrypt/static/template/index.html'), 'utf-8'),

    // element and variable binding
    $: {
        btnSrcChoice: '#btnSrcChoice',
        srcLabel: '#srcLabel',
        // textFileName : '#text_file_name',
        encriptSign:'#input_encriptSign',
        encriptKey:'#input_encriptKey',
        checkboxRemember:'#checkboxRemember',
        btnBuild: '#btnBuild',
    },
    ready() {
        helper.config;
        let slef = this as any;
        let encryptObject = localStorage.getItem(ENCRYPT);
        if (null != encryptObject ){
            helper.config = JSON.parse(encryptObject);
        }
        // slef.$textFileName.innerText = helper.encript_ignore_extList.toString();
        slef.$encriptSign.value = helper.config.encriptSign;
        slef.$encriptKey.value = helper.config.encriptKey;
        slef.$srcLabel.value = helper.config.srcLabel;
        slef.$btnSrcChoice.addEventListener('confirm', () => {
            let res = Editor.Dialog.openFile({
                title: "选择需要加密的目录",
                defaultPath: null != slef.$srcLabel.value && '' != slef.$srcLabel.value ? slef.$srcLabel.value : Editor.Project.path+"\\"+"build\\\jsb-link\\\"",
                properties: ['openDirectory'],
            });
            if (res !== -1) {
                let dir = res[0];
                if (helper.checkBuildDir(dir) > 0) {
                    slef.$srcLabel.value = dir;
                }else{
                    slef.$srcLabel.value = "";
                }
            }
        });
        slef.$btnBuild.addEventListener('confirm', () => {
            if(slef.$srcLabel.value == ""){
                Editor.log("[资源替换]","请先选择目录!")
                return;
            }
            slef.checkRememberSettings();
            helper.replaceResources();
        });
    },
    checkRememberSettings() {
        let slef = this as any;
        if (slef.$checkboxRemember.checked) { 
            helper.config.encriptSign = slef.$encriptSign.value;
            helper.config.encriptKey = slef.$encriptKey.value;
            helper.config.srcLabel = slef.$srcLabel.value;
            localStorage.setItem(ENCRYPT,JSON.stringify(helper.config));
        } else {
            localStorage.removeItem(ENCRYPT);
        }
    }
});