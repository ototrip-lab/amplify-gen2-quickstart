"use client";

import {
  Button,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  useTheme,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { useData } from "./useData";

const TableComponent = () => {
  const router = useRouter();
  const { data, deleteMutation } = useData();

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
                onClick={() => {
                  deleteMutation.mutate({ id: item.id });
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

const App = () => {
  const { tokens } = useTheme();

  return (
    <Flex padding={tokens.space.large} justifyContent="center">
      <Suspense fallback={<Text>Loading...</Text>}>
        <TableComponent />
      </Suspense>
    </Flex>
  );
};

export default App;
