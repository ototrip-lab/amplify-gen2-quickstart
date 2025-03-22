"use client";

import {
  Authenticator,
  Button,
  Flex,
  Grid,
  ScrollView,
  Text,
  useAuthenticator,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";

type Props = {
  headerTitle?: string;
  children: React.ReactNode;
};

const Layout = ({ children, headerTitle = "Amplify AI Kit" }: Props) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { tokens } = useTheme();
  const router = useRouter();

  return (
    <Grid
      templateColumns="20rem 1fr"
      templateRows="1fr 4rem"
      height="100vh"
      overflow="hidden"
    >
      <View padding={tokens.space.large}>
        <Flex
          gap={tokens.space.large}
          direction="column"
          rowGap={tokens.space.medium}
          height="100hv"
          overflow="hidden"
          paddingTop={tokens.space.xxxl}
        >
          <Button
            variation="primary"
            onClick={() => router.push("/chat")}
            isDisabled={authStatus !== "authenticated"}
          >
            New Chat
          </Button>
          <Flex gap={tokens.space.medium} alignItems="center">
            <AiFillHome />
            <Button variation="link" onClick={() => router.push("/")}>
              Home
            </Button>
          </Flex>
        </Flex>
      </View>

      <View
        backgroundColor={tokens.colors.background.secondary}
        overflow="auto"
      >
        <View textAlign="center" padding={tokens.space.large}>
          <Text
            color={tokens.colors.primary[100]}
            as="h1"
            fontSize={tokens.fontSizes.xxxl}
            fontWeight={tokens.fontWeights.bold}
          >
            {headerTitle}
          </Text>
        </View>
        {authStatus === "authenticated" ? (
          <ScrollView width="100%">{children}</ScrollView>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            paddingTop={tokens.space.xxxl}
          >
            <Authenticator />
          </Flex>
        )}
      </View>

      <View
        columnStart={2}
        columnEnd={3}
        textAlign="end"
        padding={tokens.space.large}
        backgroundColor={tokens.colors.background.secondary}
      >
        <Text color={tokens.colors.primary[100]}>
          Created With Amplify AI Kit
        </Text>
      </View>
    </Grid>
  );
};

export const BasicLayout = (props: Props) => {
  return (
    <Authenticator.Provider>
      <Layout {...props} />
    </Authenticator.Provider>
  );
};
