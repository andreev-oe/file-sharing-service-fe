module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow named imports from @mui/icons-material and enforce direct imports.',
    },
    fixable: 'code',
    messages: {
      useDirectImport: "Use direct import for '{{importName}}' from '@mui/icons-material/{{importName}}'.",
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@mui/icons-material') {
          const specifiers = node.specifiers.filter(
            (specifier) => specifier.type === 'ImportSpecifier'
          );

          if (specifiers.length > 0) {
            context.report({
              node,
              message: 'Use direct imports instead of named imports from @mui/icons-material.',
              fix(fixer) {
                const fixes = [];
                for (const specifier of specifiers) {
                  const importName = specifier.imported.name;
                  const newImport = `import ${importName} from '@mui/icons-material/${importName}';\n`;
                  fixes.push(fixer.insertTextBefore(node, newImport));
                }

                fixes.push(fixer.remove(node));

                return fixes;
              },
            });
          }
        }
      },
    };
  },
};
