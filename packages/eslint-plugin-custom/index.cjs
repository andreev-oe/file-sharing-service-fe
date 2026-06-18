const noNamedMaterialIconsImportRule = require('./no-named-material-icons-import.cjs');
const restrictAbsoluteImportsRule = require('./restrict-absolute-imports.cjs');

const plugin = {
  rules: {
    'no-named-material-icons-import': noNamedMaterialIconsImportRule,
    'restrict-absolute-imports': restrictAbsoluteImportsRule,
  },
};

module.exports = plugin;
