// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>你是否确定执行删除不包含在原始包内的子游戏，此过程将不可逆，建议先执行完成【部署】之后在执行本操作</h2>
    <hr />
    <ui-button id="btn">确定删除</ui-button>
  `,

  // element and variable binding
  $: {
    btn: '#btn',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', () => {
      Editor.Ipc.sendToPanel("hot-update-tools", "hot-update-tools:onConfirmDelBundle");
      //关闭自己
      Editor.Panel.close('confirm_del_subgames');
    });
  },

  // register your ipc messages here
  messages: {
    
  }
});