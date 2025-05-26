"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
} from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

type ChatHistoryItem = {
  id: string;
  message: string;
  createdAt: string;
};

type HistoryTableProps = {
  data: ChatHistoryItem[];
  onDelete: (id: string) => void;
};

export const HistoryTable = ({ data, onDelete }: HistoryTableProps) => {
  const router = useRouter();

  return (
    <Table highlightOnHover={true} variation="striped">
      <TableHead>
        <TableRow>
          <TableCell as="th">Message</TableCell>
          <TableCell as="th">CreatedAt</TableCell>
          <TableCell as="th"></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {data?.map((item) => (
          <TableRow
            key={item.id}
            onClick={() => {
              router.push(`/chat/${item.id}`);
            }}
            style={{ cursor: "pointer" }}
          >
            <TableCell>
              <Text fontSize="12px">{item.message}</Text>
            </TableCell>
            <TableCell>
              <Text fontSize="12px">{item.createdAt}</Text>
            </TableCell>
            <TableCell>
              <Button
                colorTheme="warning"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
