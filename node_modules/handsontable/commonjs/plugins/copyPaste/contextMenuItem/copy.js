'use strict';

exports.__esModule = true;
exports.default = copyItem;
function copyItem(copyPastePlugin) {
  return {
    key: 'copy',
    name: 'Copy',
    callback: function callback() {
      copyPastePlugin.setCopyableText();
      copyPastePlugin.copy(true);
    },
    disabled: function disabled() {
      return !copyPastePlugin.hot.getSelected();
    },

    hidden: false
  };
}