"use client";

import {
  Card,
  Flex,
  Heading,
  Text,
  useTheme,
  View,
} from "@aws-amplify/ui-react";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export const FeatureCard = ({ title, description, icon, onClick }: Props) => {
  const { tokens } = useTheme();

  return (
    <Card
      variation="elevated"
      padding={tokens.space.large}
      borderRadius={tokens.radii.medium}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Flex direction="column" gap={tokens.space.medium}>
        <Flex alignItems="center" gap={tokens.space.small}>
          <View fontSize="2rem" color={tokens.colors.primary[80]}>
            {icon}
          </View>
          <Heading level={3}>{title}</Heading>
        </Flex>
        <Text>{description}</Text>
      </Flex>
    </Card>
  );
};
