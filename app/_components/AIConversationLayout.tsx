"use client";

import { View, useTheme } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import Markdown from "react-markdown";

import { useAIConversation } from "@/app/client";

export const AIConversationLayout = ({ id }: { id?: string }) => {
  const { tokens } = useTheme();
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat", { id });

  return (
    <View padding={tokens.space.large}>
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
        messageRenderer={{
          text: ({ text }) => <Markdown>{text}</Markdown>,
        }}
      />
    </View>
  );
};
