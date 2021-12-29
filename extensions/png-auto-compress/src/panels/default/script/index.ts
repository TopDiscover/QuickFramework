import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';

module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: "#app"
    },
    methods: {

    },
    ready() {
        if (this.$.app) {
            const app = createApp({});
            app.component("view-content", {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        enabled: helper.config.enabled,

                        minQuality: helper.config.minQuality,
                        maxQuality: helper.config.maxQuality,
                        speed: helper.config.speed,

                        excludeFolders: helper.config.excludeFolders,
                        excludeFiles: helper.config.excludeFiles,

                        isProcessing: false,
                    }
                },
                methods:{
                    onChangeEnabled(enabled:boolean){
                        // console.log("enabled",enabled);
                        helper.config.enabled = enabled;
                    },
                    onChangeMinQuality(value:number){
                        // console.log("minQuality",value);
                        helper.config.minQuality = value;
                    },
                    onChangeMaxQuality(value:number){
                        // console.log("maxQuality",value)
                        helper.config.maxQuality = value;
                    },
                    onChangeSpeed(value:number){
                        // console.log("speed",value);
                        helper.config.speed = value;
                    },
                    onInputExcludeFoldersOver(value:string){
                        // console.log("excludeFolders",value);
                        helper.config.excludeFolders = value;
                    },
                    onInputExcludeFilesOver(value:string){
                        // console.log(`excludeFiles`,value);
                        helper.config.excludeFiles = value;
                    },
                    /**@description 保存配置 */
                    onSaveConfig(){
                        helper.saveConfig();
                    }
                }
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});
