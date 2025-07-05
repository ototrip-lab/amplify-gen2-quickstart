import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';

import { CROSS_REGION_BEDROCK_MODEL_PATH } from '../../constants';

export const chatHandler = defineConversationHandlerFunction({
  entry: './index.ts',
  name: 'customChatHandler',
  models: [
    {
      modelId: {
        resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
      },
    },
  ],
  timeoutSeconds: 60 * 10, // 10 minutes
});
