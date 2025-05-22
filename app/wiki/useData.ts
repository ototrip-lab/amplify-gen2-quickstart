import { useAuthenticator } from "@aws-amplify/ui-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/api";
import { useState } from "react";

import { type Schema } from "@/amplify/data/resource";
import { queryClient } from "@/app/_components/BasicLayout";
import { getDisplayName, getItemLevel, getPath } from "./misc";

const client = generateClient<Schema>();

export type WikiItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const fetchWikiItems = async (username: string): Promise<WikiItem[]> => {
  try {
    const { data: items } = await client.models.UserWiki.list({
      filter: { username: { eq: username } },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching wiki items:", error);
    return [];
  }
};

const createWikiItem = async (item: {
  title: string;
  content: string;
  username: string;
}) => {
  try {
    const result = await client.models.UserWiki.create(item);
    if (result && result.data) {
      return {
        id: result.data.id,
        title: result.data.title,
        content: result.data.content,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      };
    }
    throw new Error("Failed to create wiki item");
  } catch (error) {
    console.error("Error creating wiki item:", error);
    throw error;
  }
};

const updateWikiItem = async (item: {
  id: string;
  title: string;
  content: string;
}) => {
  try {
    const result = await client.models.UserWiki.update(item);
    if (result && result.data) {
      return {
        id: result.data.id,
        title: result.data.title,
        content: result.data.content,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt,
      };
    }
    throw new Error("Failed to update wiki item");
  } catch (error) {
    console.error("Error updating wiki item:", error);
    throw error;
  }
};

const deleteWikiItem = async (id: string) => {
  try {
    const result = await client.models.UserWiki.delete({
      id,
    });
    if (result && result.data) {
      return result.data;
    }
    throw new Error("Failed to delete wiki item");
  } catch (error) {
    console.error("Error deleting wiki item:", error);
    throw error;
  }
};

export const useData = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const username = user?.username || "";

  const { data: items = [] } = useSuspenseQuery({
    queryKey: ["wiki", username],
    queryFn: () => fetchWikiItems(username),
  });

  const [selectedItem, setSelectedItem] = useState<WikiItem | null>(null);

  const isDescendantOf = (childTitle: string, parentTitle: string): boolean => {
    const childPath = getPath(childTitle);
    const parentPath = getPath(parentTitle);

    if (parentPath === "/") return childPath !== "/";
    return childPath.startsWith(parentPath + "/") || childPath === parentPath;
  };

  const organizeItemsIntoTree = () => {
    return [...items].sort((a, b) => {
      const pathA = getPath(a.title);
      const pathB = getPath(b.title);

      if (pathA !== pathB) {
        return pathA.localeCompare(pathB);
      }

      return getDisplayName(a.title).localeCompare(getDisplayName(b.title));
    });
  };

  const createItem = async (parentPath: string = "/") => {
    const newTitle =
      parentPath === "/" ? `/New Title` : `${parentPath}/New Title`;

    try {
      const newItem = await createWikiItem({
        title: newTitle,
        content: "# New Content\n\nEnter your content here.",
        username,
      });

      queryClient.invalidateQueries({ queryKey: ["wiki", username] });
      setSelectedItem(newItem);

      return newItem;
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };

  const updateItem = async (updatedItem: WikiItem) => {
    try {
      const result = await updateWikiItem({
        id: updatedItem.id,
        title: updatedItem.title,
        content: updatedItem.content,
      });

      queryClient.invalidateQueries({ queryKey: ["wiki", username] });
      setSelectedItem(result);

      return result;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const itemToDelete = items.find((item) => item.id === id);
      if (!itemToDelete) return;

      await deleteWikiItem(id);

      const childItems = items.filter(
        (item) =>
          isDescendantOf(item.title, itemToDelete.title) && item.id !== id,
      );

      for (const childItem of childItems) {
        await deleteWikiItem(childItem.id);
      }

      queryClient.invalidateQueries({ queryKey: ["wiki", username] });

      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  };

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki", username] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki", username] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki", username] });
    },
  });

  return {
    items: organizeItemsIntoTree(),
    selectedItem,
    setSelectedItem,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
    getItemLevel,
    getDisplayName,
    getPath,
  };
};
