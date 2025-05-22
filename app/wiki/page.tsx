"use client";

import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  TextAreaField,
  TextField,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Suspense, useState } from "react";
import ReactMarkdown from "react-markdown";

import { getDisplayName, getItemLevel, getPath } from "./misc";
import { useData, WikiItem } from "./useData";

type ViewMode = "list" | "detail" | "edit";

const MarkdownEditor = ({
  item,
  onSave,
  onCancel,
}: {
  item: WikiItem;
  onSave: (updatedItem: WikiItem) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(getDisplayName(item.title));
  const [path, setPath] = useState(getPath(item.title));
  const [content, setContent] = useState(item.content);
  const { tokens } = useTheme();

  const handleSave = () => {
    const newTitle = path === "/" ? `/${title}` : `${path}/${title}`;

    onSave({
      ...item,
      title: newTitle,
      content,
    });
  };

  return (
    <Flex direction="column" gap={tokens.space.medium}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>Editing</Heading>
        <Button variation="link" onClick={onCancel}>
          Cancel
        </Button>
      </Flex>
      <Divider />
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Path"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="/category/subcategory"
      />
      <TextAreaField
        label="Content (Markdown format)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />
      <Flex justifyContent="flex-end" gap={tokens.space.small}>
        <Button variation="primary" onClick={handleSave}>
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

const MarkdownPreview = ({
  item,
  onEdit,
  onDelete,
  onBack,
}: {
  item: WikiItem;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}) => {
  const { tokens } = useTheme();

  return (
    <Flex direction="column" gap={tokens.space.medium}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>{item.title}</Heading>
        <Flex gap={tokens.space.small}>
          <Button variation="link" onClick={onBack}>
            Back to List
          </Button>
          <Button variation="primary" onClick={onEdit}>
            Edit
          </Button>
          <Button colorTheme="warning" onClick={onDelete}>
            Delete
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Text color="secondary" fontSize="0.8rem">
        Path: {getPath(item.title)} | Created: {item.createdAt} | Updated:{" "}
        {item.updatedAt}
      </Text>
      <Card>
        <article className="markdown-body">
          <ReactMarkdown>{item.content}</ReactMarkdown>
        </article>
      </Card>
    </Flex>
  );
};

const WikiListComponent = () => {
  const { tokens } = useTheme();
  const {
    items,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
  } = useData();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [newPath, setNewPath] = useState("/");
  const [showNewItemInput, setShowNewItemInput] = useState(false);

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

  const handleCreate = () => {
    if (newPath.trim()) {
      createItem(newPath);
      setNewPath("/");
      setShowNewItemInput(false);
      setViewMode("edit");
    } else {
      createItem("/");
      setViewMode("edit");
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // 一覧表示モード
  if (viewMode === "list") {
    return (
      <Flex
        direction="column"
        gap={tokens.space.medium}
        padding={tokens.space.large}
      >
        <Flex justifyContent="space-between" alignItems="end">
          <Heading level={2}>Wiki</Heading>
          <Button
            variation="primary"
            onClick={() => setShowNewItemInput((prev) => !prev)}
          >
            Create New
          </Button>
        </Flex>

        {/* 新規作成フォーム */}
        {showNewItemInput && (
          <Flex gap={tokens.space.small} alignItems="end">
            <TextField
              label="Path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/category/subcategory"
            />
            <Button onClick={handleCreate} variation="primary">
              Create
            </Button>
            <Button onClick={() => setShowNewItemInput(false)} variation="link">
              Cancel
            </Button>
          </Flex>
        )}

        <Divider />

        <Table highlightOnHover variation="striped">
          <TableHead>
            <TableRow>
              <TableCell as="th">Title</TableCell>
              <TableCell as="th">Path</TableCell>
              <TableCell as="th">Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const level = getItemLevel(item);
              const indent = `${level * 20}px`;
              const displayName = getDisplayName(item.title);

              return (
                <TableRow
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Flex style={{ paddingLeft: indent }}>
                      <Text>{displayName}</Text>
                    </Flex>
                  </TableCell>
                  <TableCell>
                    <Text fontSize="12px">{getPath(item.title)}</Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize="12px">{item.updatedAt}</Text>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Flex>
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

  return <Text>Loading...</Text>;
};

const App = () => {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.large}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <WikiListComponent />
      </Suspense>
    </View>
  );
};

export default App;
