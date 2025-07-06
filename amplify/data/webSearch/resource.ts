import { defineFunction, secret } from '@aws-amplify/backend';

export const webSearch = defineFunction({
  name: 'webSearch',
  entry: './index.ts',
  timeoutSeconds: 30,
  runtime: 22,
  environment: {
    // TAVILY_API_KEY: secret('TAVILY_API_KEY'),
  },
});
