const path = require('path');

module.exports = {
  meta: {
    type: 'error',
    docs: {
      description: 'Disallow absolute imports within the same feature folder; use relative imports instead.',
      category: 'Best Practices',
    },
    fixable: 'code',
    schema: [],
    messages: {
      absoluteImportNotAllowed:
        "Absolute import '{{ importPath }}' is not allowed within its own folder. Use a relative import instead.",
    },
  },

  create(context) {
    const filename = context.getFilename();
    // Root for features
    const rootDir = path.resolve(process.cwd(), 'src', 'features');

    // Only enforce within the 'features' folder
    if (!filename.startsWith(rootDir)) {
      return {};
    }

    const currentFeature = path.relative(rootDir, filename).split(path.sep)[0];

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Detect if the import is an absolute import pointing to the same feature
        if (importPath.startsWith('@/features/') && importPath.split('/')[2] === currentFeature) {
          const absoluteImport = path.resolve(rootDir, importPath.replace('@/features/', ''));
          const relativePath = path.relative(path.dirname(filename), absoluteImport);

          context.report({
            node,
            messageId: 'absoluteImportNotAllowed',
            data: { importPath },
            fix(fixer) {
              // Automatically fix the issue by replacing the import path with a relative path
              const fixedPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
              return fixer.replaceText(node.source, `'${fixedPath}'`);
            },
          });
        }
      },
    };
  },
};
