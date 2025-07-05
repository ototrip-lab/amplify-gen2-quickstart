"use client";

import {
  Button,
  Divider,
  Flex,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { useState } from "react";

import type { WikiItem } from "../types";
import { getDisplayName, getItemLevel, getPath } from "../utils";

type WikiListProps = {
  items: WikiItem[];
  onSelect: (item: WikiItem) => void;
  onCreate: (path: string) => void;
};

export const WikiList = ({ items, onSelect, onCreate }: WikiListProps) => {
  const { tokens } = useTheme();
  const [newPath, setNewPath] = useState("/");
  const [showNewItemInput, setShowNewItemInput] = useState(false);

  const handleCreate = () => {
    if (newPath.trim()) {
      onCreate(newPath);
      setNewPath("/");
      setShowNewItemInput(false);
    } else {
      onCreate("/");
    }
  };

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
                onClick={() => onSelect(item)}
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
};
