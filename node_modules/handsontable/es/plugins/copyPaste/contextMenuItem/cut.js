export default function cutItem(copyPastePlugin) {
  return {
    key: 'cut',
    name: 'Cut',
    callback: function callback() {
      copyPastePlugin.setCopyableText();
      copyPastePlugin.cut(true);
    },
    disabled: function disabled() {
      return !copyPastePlugin.hot.getSelected();
    },

    hidden: false
  };
}