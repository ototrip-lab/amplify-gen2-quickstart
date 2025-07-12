"use client";

import { Divider, Flex, Heading, useTheme } from "@aws-amplify/ui-react";
// STEP5 Action: コメントアウト削除
// import { FileUploader } from "@aws-amplify/ui-react-storage";
// import {
//   createAmplifyAuthAdapter,
//   createStorageBrowser,
// } from "@aws-amplify/ui-react-storage/browser";
// import "@/app/_components/ConfigureAmplify";
// const { StorageBrowser } = createStorageBrowser({
//   config: createAmplifyAuthAdapter(),
// });

const App = () => {
  const { tokens } = useTheme();

  return (
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
      <Flex justifyContent="space-between" alignItems="end">
        <Heading level={2}>Storage</Heading>
      </Flex>
      <Divider />
      {/* STEP5 Action: コメントアウト削除
      <FileUploader
        acceptedFileTypes={["application/pdf"]}
        path="public/"
        maxFileCount={1}
        isResumable
      />
      <StorageBrowser /> */}
    </Flex>
  );
};

export default App;
