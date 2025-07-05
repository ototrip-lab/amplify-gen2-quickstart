import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useCallback, useEffect, useState } from "react";

import { type Schema } from "@/amplify/data/resource";

import type { WikiItem } from "./types";
import {
  getDisplayName,
  getItemLevel,
  getPath,
  isDescendantOf,
  organizeItemsIntoTree,
} from "./utils";

const client = generateClient<Schema>();

const fetchWikiItems = async (username: string) => {
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
    const result = await client.models.UserWiki.delete({ id });
    if (result && result.data) {
      return result.data;
    }
    throw new Error("Failed to delete wiki item");
  } catch (error) {
    console.error("Error deleting wiki item:", error);
    throw error;
  }
};

export const useWikiData = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const username = user?.username || "";

  // State management
  const [items, setItems] = useState<WikiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WikiItem | null>(null);

  // Fetch items function
  const fetchItems = useCallback(async () => {
    if (!username) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedItems = await fetchWikiItems(username);
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Initial data fetch and refetch when username changes
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Create item function
  const createItem = async (parentPath: string = "/") => {
    const newTitle =
      parentPath === "/" ? `/New Title` : `${parentPath}/New Title`;

    try {
      setError(null);
      const newItem = await createWikiItem({
        title: newTitle,
        content: "# New Content\n\nEnter your content here.",
        username,
      });

      // Update local state
      setItems((prevItems) => [...prevItems, newItem]);
      setSelectedItem(newItem);

      return newItem;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create item";
      setError(errorMessage);
      console.error("Error creating item:", error);
      throw error;
    }
  };

  // Update item function
  const updateItem = async (updatedItem: WikiItem) => {
    try {
      setError(null);
      const result = await updateWikiItem({
        id: updatedItem.id,
        title: updatedItem.title,
        content: updatedItem.content,
      });

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === result.id ? result : item)),
      );
      setSelectedItem(result);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update item";
      setError(errorMessage);
      console.error("Error updating item:", error);
      throw error;
    }
  };

  // Delete item function
  const deleteItem = async (id: string) => {
    try {
      setError(null);
      const itemToDelete = items.find((item) => item.id === id);
      if (!itemToDelete) return;

      await deleteWikiItem(id);

      // Find and delete child items
      const childItems = items.filter(
        (item) =>
          isDescendantOf(item.title, itemToDelete.title) && item.id !== id,
      );

      for (const childItem of childItems) {
        await deleteWikiItem(childItem.id);
      }

      // Update local state
      const itemsToDelete = [id, ...childItems.map((child) => child.id)];
      setItems((prevItems) =>
        prevItems.filter((item) => !itemsToDelete.includes(item.id)),
      );

      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete item";
      setError(errorMessage);
      console.error("Error deleting item:", error);
      throw error;
    }
  };

  return {
    items: organizeItemsIntoTree(items),
    loading,
    error,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
    getItemLevel,
    getDisplayName,
    getPath,
  };
};
