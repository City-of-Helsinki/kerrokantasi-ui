/**
 * KKUIConfigPlugin injects a script tag into html-webpack-plugin output.
 */
function KKUIConfigPlugin(/*options*/) {
  this.settings = require('./getSettings')();
}

function createScriptSegment(variables) {
  const bits = ['<script>'];
  Object.keys(variables).forEach((key) => {
    bits.push(`window.${key} = ${JSON.stringify(variables[key])};`);
  });
  bits.push('</script>');
  return bits.join('\n');
}

KKUIConfigPlugin.prototype.apply = function (compiler) {
  const settings = this.settings;
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
      const variables = {
        STATE: {},
        API_BASE_URL: settings.apiBaseUrl,
        UI_CONFIG: settings.uiConfig,
      };
      const insertionIndex = htmlPluginData.html.indexOf('<body>') + 6;
      const segment = createScriptSegment(variables);
      htmlPluginData.html = [
        htmlPluginData.html.substr(0, insertionIndex),
        segment,
        htmlPluginData.html.substr(insertionIndex),
      ].join('\n');
      callback(null, htmlPluginData);
    });
  });
};

module.exports = KKUIConfigPlugin;
