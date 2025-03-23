"use client";

import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

type Data = {
  id: string;
  message: string;
  createdAt: string;
};

export const useData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data[]>([]);

  const deleteItem = async (id: string) => {
    await client.conversations.chat.delete({ id });
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: conversations } = await client.conversations.chat.list();

      const tmpList: Data[] = await Promise.all(
        conversations.map(async (conversation) => {
          const detail = await conversation.listMessages();
          const message = detail.data[0]?.content[0].text || "";
          return {
            id: conversation.id,
            createdAt: conversation.createdAt,
            message,
          };
        }),
      );
      const filteredList = tmpList.filter((item) => item.message !== "");

      const noMessageList = tmpList.filter((item) => item.message === "");
      await Promise.all(
        noMessageList.map(async (item) => {
          await deleteItem(item.id);
        }),
      );

      setData(filteredList);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    deleteItem,
  };
};
