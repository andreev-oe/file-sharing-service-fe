import { defineConfig } from 'orval';

export default defineConfig({
  gfk: {
    input: {
      target: './src/api/api.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/endpoints',
      schemas: './src/api/generated/types',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: './src/lib/custom-axios-instance.ts',
          name: 'customAxiosInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'eslint --fix ./src/api/generated',
    },
  },
});
