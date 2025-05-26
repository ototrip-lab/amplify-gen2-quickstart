"use client";

import { useTheme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Suspense, useState } from "react";

import { LoadingSpinner } from "../_components/LoadingSpinner";
import { MarkdownEditor } from "./_components/MarkdownEditor";
import { MarkdownPreview } from "./_components/MarkdownPreview";
import { WikiList } from "./_components/WikiList";
import type { WikiItem } from "./types";
import { useWikiData } from "./useWikiData";

type ViewMode = "list" | "detail" | "edit";

const WikiListComponent = () => {
  const {
    items,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
  } = useWikiData();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleSelect = (item: WikiItem) => {
    setSelectedItem(item);
    setViewMode("detail");
  };

  const handleEdit = () => {
    setViewMode("edit");
  };

  const handleSave = (updatedItem: WikiItem) => {
    updateItem(updatedItem);
    setViewMode("detail");
  };

  const handleCancel = () => {
    setViewMode("detail");
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
      setViewMode("list");
    }
  };

  const handleCreate = (path: string) => {
    createItem(path);
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // 一覧表示モード
  if (viewMode === "list") {
    return (
      <WikiList items={items} onSelect={handleSelect} onCreate={handleCreate} />
    );
  }

  // 詳細表示モード
  if (viewMode === "detail" && selectedItem) {
    return (
      <MarkdownPreview
        item={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBackToList}
      />
    );
  }

  // 編集モード
  if (viewMode === "edit" && selectedItem) {
    return (
      <MarkdownEditor
        item={selectedItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return <LoadingSpinner />;
};

const App = () => {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.large}>
      <Suspense fallback={<LoadingSpinner />}>
        <WikiListComponent />
      </Suspense>
    </View>
  );
};

export default App;
