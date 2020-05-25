'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'start' () {
      Editor.Panel.open('check_resources',Editor.argv);
    }
  },
};