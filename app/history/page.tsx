"use client";

import "@aws-amplify/ui-react/styles.css";
import { Suspense } from "react";

import { LoadingSpinner } from "../_components/LoadingSpinner";
import { HistoryTable } from "./_components/HistoryTable";
import { useHistoryData } from "./useHistoryData";

const HistoryComponent = () => {
  const { data, deleteMutation } = useHistoryData();

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  return <HistoryTable data={data} onDelete={handleDelete} />;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HistoryComponent />
    </Suspense>
  );
};

export default App;
