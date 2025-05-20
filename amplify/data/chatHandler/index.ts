import {
  ConversationTurnEvent,
  handleConversationTurnEvent,
} from '@aws-amplify/backend-ai/conversation/runtime';

export const handler = async (event: ConversationTurnEvent) => {
  await handleConversationTurnEvent(event, {});
};
