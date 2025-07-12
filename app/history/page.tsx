"use client";

// STEP2 Action: コメントアウト削除
// import {
//   Button,
//   Flex,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Text,
//   useTheme,
// } from "@aws-amplify/ui-react";
// import { useRouter } from "next/navigation";
// import { useData } from "./useData";

// STEP2 Action: コメントアウト削除し、初期記述 `App` を削除
// const App = () => {
//   const router = useRouter();
//   const { tokens } = useTheme();
//   const { data, deleteItem } = useData();

//   return (
//     <Flex padding={tokens.space.large} justifyContent="center">
//       <Table highlightOnHover={true} variation="striped">
//         <TableHead>
//           <TableRow>
//             <TableCell as="th">Message</TableCell>
//             <TableCell as="th">CreatedAt</TableCell>
//             <TableCell as="th"></TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell>
//                 <Button
//                   variation="link"
//                   onClick={() => {
//                     router.push(`/chat/${item.id}`);
//                   }}
//                 >
//                   <Text fontSize="12px">{item.message}</Text>
//                 </Button>
//               </TableCell>
//               <TableCell>
//                 <Text fontSize="12px">{item.createdAt}</Text>
//               </TableCell>
//               <TableCell>
//                 <Button
//                   colorTheme="warning"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteItem(item.id);
//                   }}
//                 >
//                   delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Flex>
//   );
// };

const App = () => {
  return (
    <div>
      <h1>Chat History</h1>
    </div>
  );
};

export default App;
