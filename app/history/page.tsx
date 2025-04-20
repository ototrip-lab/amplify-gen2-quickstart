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

import { useData } from "./useData";

const App = () => {
  const router = useRouter();
  const { tokens } = useTheme();
  const { data, deleteItem } = useData();

  return (
    <Flex padding={tokens.space.large} justifyContent="center">
      <Table highlightOnHover={true} variation="striped">
        <TableHead>
          <TableRow>
            <TableCell as="th">Message</TableCell>
            <TableCell as="th">CreatedAt</TableCell>
            <TableCell as="th"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Button
                  variation="link"
                  onClick={() => {
                    router.push(`/chat/${item.id}`);
                  }}
                >
                  <Text fontSize="12px">{item.message}</Text>
                </Button>
              </TableCell>
              <TableCell>
                <Text fontSize="12px">{item.createdAt}</Text>
              </TableCell>
              <TableCell>
                <Button
                  colorTheme="warning"
                  onClick={() => deleteItem(item.id)}
                >
                  delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
};

export default App;
