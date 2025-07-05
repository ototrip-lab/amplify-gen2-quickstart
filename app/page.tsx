"use client";

import { Flex, Text, useTheme } from "@aws-amplify/ui-react";

const HomePage = () => {
  const { tokens } = useTheme();

  return (
    <Flex
      padding={tokens.space.xl}
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
    >
      <Text
        fontSize={tokens.fontSizes.large}
        fontWeight={tokens.fontWeights.bold}
        color={tokens.colors.font.primary}
      >
        Hello, Top Page
      </Text>
    </Flex>
  );
};

export default HomePage;
