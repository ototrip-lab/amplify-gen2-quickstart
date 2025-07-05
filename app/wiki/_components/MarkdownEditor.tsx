"use client";

import {
  Button,
  Divider,
  Flex,
  Heading,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { useState } from "react";

import type { WikiItem } from "../types";
import { getDisplayName, getPath } from "../utils";

type MarkdownEditorProps = {
  item: WikiItem;
  onSave: (updatedItem: WikiItem) => void;
  onCancel: () => void;
};

export const MarkdownEditor = ({
  item,
  onSave,
  onCancel,
}: MarkdownEditorProps) => {
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
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
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
