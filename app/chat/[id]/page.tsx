"use client";

import { useEffect, useState } from "react";

import { AIConversationLayout } from "@/app/_components/AIConversationLayout";

const App = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const func = async () => {
      const { id } = await params;
      setId(id);
    };
    func();
  }, []);

  return <AIConversationLayout id={id} key={id} />;
};

export default App;
