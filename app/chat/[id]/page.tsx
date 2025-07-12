"use client";

import { useEffect, useState } from "react";

// STEP2 Action: コメントアウト削除
// import { AIConversationLayout } from "@/app/_components/AIConversationLayout";

const App = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const func = async () => {
      const { id } = await params;
      setId(id);
    };
    func();
  }, []);

  // STEP2 Action: コメントアウト削除
  // return <AIConversationLayout id={id} key={id} />;

  // STEP2 Action: 以下削除
  return (
    <div>
      <h1>Chat Page</h1>
      <p>Chat ID: {id}</p>
      {/* Add your chat component here */}
    </div>
  );
};

export default App;
