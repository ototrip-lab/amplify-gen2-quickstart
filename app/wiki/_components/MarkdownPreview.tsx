"use client";

import {
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Text,
  useTheme,
} from "@aws-amplify/ui-react";
import ReactMarkdown from "react-markdown";

import type { WikiItem } from "../types";
import { getPath } from "../utils";

type MarkdownPreviewProps = {
  item: WikiItem;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export const MarkdownPreview = ({
  item,
  onEdit,
  onDelete,
  onBack,
}: MarkdownPreviewProps) => {
  const { tokens } = useTheme();

  return (
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
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
