"use client";

import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  ScrollView,
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
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { KnowledgeItem, useKnowledgeData } from "./useKnowledgeData";

// 表示モードの型定義
type ViewMode = "list" | "detail" | "edit";

// Markdownエディタコンポーネント
const MarkdownEditor = ({
  item,
  onSave,
  onCancel,
  getPath,
  getDisplayName,
}: {
  item: KnowledgeItem;
  onSave: (updatedItem: KnowledgeItem) => void;
  onCancel: () => void;
  getPath: (title: string) => string;
  getDisplayName: (title: string) => string;
}) => {
  const [title, setTitle] = useState(getDisplayName(item.title));
  const [path, setPath] = useState(getPath(item.title));
  const [content, setContent] = useState(item.content);
  const { tokens } = useTheme();

  const handleSave = () => {
    // パスとタイトルを結合して新しいタイトルを作成
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
        <Heading level={2}>編集中</Heading>
        <Button variation="link" onClick={onCancel}>
          キャンセル
        </Button>
      </Flex>
      <Divider />
      <TextField
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="パス"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="/category/subcategory"
      />
      <TextAreaField
        label="内容 (Markdown形式)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={15}
      />
      <Flex justifyContent="flex-end" gap={tokens.space.small}>
        <Button variation="primary" onClick={handleSave}>
          保存
        </Button>
      </Flex>
    </Flex>
  );
};

// Markdownプレビューコンポーネント
const MarkdownPreview = ({
  item,
  onEdit,
  onDelete,
  onBack,
  getPath,
}: {
  item: KnowledgeItem;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  getPath: (title: string) => string;
}) => {
  const { tokens } = useTheme();

  return (
    <Flex direction="column" gap={tokens.space.medium}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>{item.title}</Heading>
        <Flex gap={tokens.space.small}>
          <Button variation="link" onClick={onBack}>
            一覧に戻る
          </Button>
          <Button variation="primary" onClick={onEdit}>
            編集
          </Button>
          <Button colorTheme="warning" onClick={onDelete}>
            削除
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Text color="secondary" fontSize="0.8rem">
        パス: {getPath(item.title)} | 作成日:{" "}
        {new Date(item.createdAt).toLocaleString("ja-JP")} | 更新日:{" "}
        {new Date(item.updatedAt).toLocaleString("ja-JP")}
      </Text>
      <Card>
        <article className="markdown-body">
          <ReactMarkdown>{item.content}</ReactMarkdown>
        </article>
      </Card>
    </Flex>
  );
};

// Knowledge項目一覧コンポーネント（ツリー表示）
const KnowledgeList = ({
  items,
  onSelect,
  onCreate,
  getItemLevel,
  getPath,
  getDisplayName,
}: {
  items: KnowledgeItem[];
  onSelect: (item: KnowledgeItem) => void;
  onCreate: (path?: string) => void;
  getItemLevel: (item: KnowledgeItem) => number;
  getPath: (title: string) => string;
  getDisplayName: (title: string) => string;
}) => {
  const { tokens } = useTheme();
  const [newPath, setNewPath] = useState("/");
  const [showNewItemInput, setShowNewItemInput] = useState(false);

  // 新規作成処理
  const handleCreate = () => {
    if (newPath.trim()) {
      onCreate(newPath);
      setNewPath("/");
      setShowNewItemInput(false);
    } else {
      onCreate();
    }
  };

  return (
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={2}>Knowledge</Heading>
        <Button
          variation="primary"
          onClick={() => setShowNewItemInput(!showNewItemInput)}
        >
          新規作成
        </Button>
      </Flex>

      {/* 新規作成フォーム */}
      {showNewItemInput && (
        <Flex gap={tokens.space.small} alignItems="center">
          <TextField
            label="パス"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="/category/subcategory"
          />
          <Button onClick={handleCreate} variation="primary">
            作成
          </Button>
          <Button onClick={() => setShowNewItemInput(false)} variation="link">
            キャンセル
          </Button>
        </Flex>
      )}

      <Divider />

      <ScrollView height="calc(100vh - 200px)" width="100%">
        <Table highlightOnHover variation="striped">
          <TableHead>
            <TableRow>
              <TableCell as="th">タイトル</TableCell>
              <TableCell as="th">パス</TableCell>
              <TableCell as="th">更新日</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const level = getItemLevel(item);
              const indent = `${level * 20}px`; // 階層に応じたインデント
              const displayName = getDisplayName(item.title);
              const path = getPath(item.title);

              return (
                <TableRow key={item.id} onClick={() => onSelect(item)}>
                  <TableCell>
                    <Flex style={{ paddingLeft: indent }}>
                      <Text>{displayName}</Text>
                    </Flex>
                  </TableCell>
                  <TableCell>
                    <Text fontSize="12px">{path}</Text>
                  </TableCell>
                  <TableCell>
                    <Text fontSize="12px">
                      {new Date(item.updatedAt).toLocaleString("ja-JP")}
                    </Text>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollView>
    </Flex>
  );
};

const App = () => {
  const { tokens } = useTheme();
  const {
    items,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
    getItemLevel,
    getDisplayName,
    getPath,
  } = useKnowledgeData();

  // 表示モードの状態
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleSelect = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setViewMode("detail");
  };

  const handleEdit = () => {
    setViewMode("edit");
  };

  const handleSave = (updatedItem: KnowledgeItem) => {
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

  const handleCreate = (path: string = "/") => {
    const newItem = createItem(path);
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  return (
    <View padding={tokens.space.large}>
      {/* 一覧表示モード */}
      {viewMode === "list" && (
        <KnowledgeList
          items={items}
          onSelect={handleSelect}
          onCreate={handleCreate}
          getItemLevel={getItemLevel}
          getPath={getPath}
          getDisplayName={getDisplayName}
        />
      )}

      {/* 詳細表示モード */}
      {viewMode === "detail" && selectedItem && (
        <MarkdownPreview
          item={selectedItem}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBackToList}
          getPath={getPath}
        />
      )}

      {/* 編集モード */}
      {viewMode === "edit" && selectedItem && (
        <MarkdownEditor
          item={selectedItem}
          onSave={handleSave}
          onCancel={handleCancel}
          getPath={getPath}
          getDisplayName={getDisplayName}
        />
      )}
    </View>
  );
};

export default App;
