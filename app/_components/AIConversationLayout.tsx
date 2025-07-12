// STEP2 Action: コメントアウト削除
// import { View, useTheme } from "@aws-amplify/ui-react";
// import { AIConversation } from "@aws-amplify/ui-react-ai";
// import Markdown from "react-markdown";
// import rehypeSanitize from "rehype-sanitize";
// import { useAIConversation } from "@/app/client";

export const AIConversationLayout = ({ id }: { id?: string }) => {
  // STEP2 Action: 全ての実装のコメントアウトを外してください
  //   const { tokens } = useTheme();
  //   const [
  //     {
  //       data: { messages },
  //       isLoading,
  //     },
  //     handleSendMessage,
  //   ] = useAIConversation("chat", { id });
  //   return (
  //     <View padding={tokens.space.large}>
  //       <AIConversation
  //         messages={messages}
  //         isLoading={isLoading}
  //         handleSendMessage={handleSendMessage}
  //         messageRenderer={{
  //           text: ({ text }) => (
  //             <Markdown
  //               rehypePlugins={[rehypeSanitize]}
  //               components={{
  //                 // 危険なタグを無効化
  //                 script: () => null,
  //                 iframe: () => null,
  //                 object: () => null,
  //                 embed: () => null,
  //               }}
  //             >
  //               {text}
  //             </Markdown>
  //           ),
  //         }}
  //         allowAttachments
  //       />
  //     </View>
  //   );
};
