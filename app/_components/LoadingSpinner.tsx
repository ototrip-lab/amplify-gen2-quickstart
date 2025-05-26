"use client";

import { Flex, Text, useTheme } from "@aws-amplify/ui-react";

type Props = {
  message?: string;
  subMessage?: string;
};

export const LoadingSpinner = ({
  message = "Loading...",
  subMessage,
}: Props) => {
  const { tokens } = useTheme();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      padding={tokens.space.xl}
      direction="column"
      gap={tokens.space.medium}
    >
      <Text fontSize="large">{message}</Text>
      {subMessage && <Text color="tertiary">{subMessage}</Text>}
    </Flex>
  );
};
