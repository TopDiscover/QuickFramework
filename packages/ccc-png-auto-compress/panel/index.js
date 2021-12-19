const Fs = require('fs');

Editor.Panel.extend({

  style: Fs.readFileSync(Editor.url('packages://ccc-png-auto-compress/panel/index.css'), 'utf8'),

  template: Fs.readFileSync(Editor.url('packages://ccc-png-auto-compress/panel/index.html'), 'utf8'),

  ready() {
    const app = new window.Vue({
      el: this.shadowRoot,

      data() {
        return {
          enabled: false,

          minQuality: 40,
          maxQuality: 80,
          colors: 256,
          speed: 3,

          excludeFolders: '',
          excludeFiles: '',

          isProcessing: false,
        }
      },

      methods: {

        /**
         * 保存配置
         */
        saveConfig() {
          if (this.isProcessing) return;
          this.isProcessing = true;

          const excludeFolders = this.excludeFolders.split(',').map(value => value.trim());
          const excludeFiles = this.excludeFiles.split(',').map(value => value.trim());

          const config = {
            excludeFolders,
            excludeFiles,

            enabled: this.enabled,

            minQuality: this.minQuality,
            maxQuality: this.maxQuality,
            colors: this.colors,
            speed: this.speed,
          };
          Editor.Ipc.sendToMain('ccc-png-auto-compress:save-config', config, () => {
            this.isProcessing = false;
          });
        },

        /**
         * 读取配置
         */
        readConfig() {
          Editor.Ipc.sendToMain('ccc-png-auto-compress:read-config', (err, config) => {
            if (err || !config) return;
            for (const key in config) {
              if (Array.isArray(config[key])) {
                this[key] = config[key].join(',').replace(/,/g, ',\n');
              } else {
                this[key] = config[key];
              }
            }
          });
        }

      }
    });

    app.readConfig();

  }

});
