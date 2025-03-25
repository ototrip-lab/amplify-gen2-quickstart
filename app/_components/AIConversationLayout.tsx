"use client";

import { AIConversation } from "@aws-amplify/ui-react-ai";
import Markdown from "react-markdown";

import { useAIConversation } from "@/app/client";

export const AIConversationLayout = ({ id }: { id?: string }) => {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat", { id });

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
      messageRenderer={{
        text: ({ text }) => <Markdown>{text}</Markdown>,
      }}
    />
  );
};
