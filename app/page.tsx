"use client";

import { Flex, useTheme } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import "@aws-amplify/ui-react/styles.css";
import Markdown from "react-markdown";

import { useAIConversation } from "./client";

const App = () => {
  const { tokens } = useTheme();

  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");

  return (
    <Flex padding={tokens.space.large} justifyContent="center">
      <AIConversation
        messages={messages}
        isLoading={isLoading}
        handleSendMessage={handleSendMessage}
        messageRenderer={{
          text: ({ text }) => <Markdown>{text}</Markdown>,
        }}
      />
    </Flex>
  );
};

export default App;
