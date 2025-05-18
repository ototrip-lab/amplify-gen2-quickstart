import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";

import { type Schema } from "@/amplify/data/resource";
import { queryClient } from "@/app/_components/BasicLayout";

const client = generateClient<Schema>();

type Data = {
  id: string;
  message: string;
  createdAt: string;
};

const fetchHistory = async () => {
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
      await deleteHistory(item.id);
    }),
  );

  return filteredList;
};

const deleteHistory = async (id: string) => {
  const result = await client.conversations.chat.delete({ id });
  return result;
};

export const useData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data: deletedProperty } = await deleteHistory(id);
      return deletedProperty;
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["history", id],
      });

      await queryClient.cancelQueries({
        queryKey: ["history"],
      });

      // Snapshot the previous value
      const previousProperty = queryClient.getQueryData(["history", id]);

      // Optimistically update to the new value
      if (previousProperty) {
        queryClient.setQueryData(["history", id], { id });
      }

      return { previousProperty, newProperty: { id } };
    },

    onSettled: (newProperty) => {
      if (newProperty) {
        queryClient.invalidateQueries({
          queryKey: ["history", newProperty.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["history"],
        });
      }
    },
  });

  return {
    data,
    deleteMutation,
  };
};
