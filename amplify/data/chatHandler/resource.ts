import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';

import { BEDROCK_MODEL_PATH } from '../constants';

export const chatHandler = defineConversationHandlerFunction({
  entry: './index.ts',
  name: 'customChatHandler',
  models: [
    {
      modelId: {
        resourcePath: BEDROCK_MODEL_PATH,
      },
    },
  ],
  timeoutSeconds: 60 * 10, // 10 minutes
});
