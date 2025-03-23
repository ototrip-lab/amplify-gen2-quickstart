"use client";

import { Flex, useTheme } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

import { useAIConversation } from "@/app/client";

const MessageComponent = ({ id }: { id?: string }) => {
  const { tokens } = useTheme();

  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat", { id });

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

const App = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const func = async () => {
      const { id } = await params;
      setId(id);
    };
    func();
  }, []);

  return <MessageComponent id={id} key={id} />;
};

export default App;
