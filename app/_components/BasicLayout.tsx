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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AiOutlineDatabase,
  AiOutlineFolderOpen,
  AiOutlineHistory,
  AiOutlineHome,
} from "react-icons/ai";

type Props = {
  headerTitle?: string;
  children: React.ReactNode;
};

export const queryClient = new QueryClient();

const Layout = ({ children, headerTitle = "Amplify AI Kit" }: Props) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { tokens } = useTheme();
  const router = useRouter();

  return (
    <Grid
      templateColumns="15rem 1fr"
      templateRows="1fr"
      height="100vh"
      overflow="hidden"
    >
      <View padding={tokens.space.large}>
        <Flex
          gap={tokens.space.large}
          direction="column"
          rowGap={tokens.space.medium}
          paddingTop={tokens.space.xxxl}
          paddingBottom={tokens.space.xxxl}
        >
          <Button
            variation="primary"
            onClick={() => {
              const pathname = window.location.pathname;
              if (pathname === "/chat") {
                window.location.reload();
              } else {
                router.push("/chat");
              }
            }}
            isDisabled={authStatus !== "authenticated"}
          >
            New Chat
          </Button>

          <Flex gap={tokens.space.medium} alignItems="center">
            <AiOutlineHome />
            <Button variation="link" onClick={() => router.push("/")}>
              Home
            </Button>
          </Flex>

          <Flex gap={tokens.space.medium} alignItems="center">
            <AiOutlineHistory />
            <Button variation="link" onClick={() => router.push("/history")}>
              History
            </Button>
          </Flex>

          <Flex gap={tokens.space.medium} alignItems="center">
            <AiOutlineFolderOpen />
            <Button variation="link" onClick={() => router.push("/storage")}>
              Storage
            </Button>
          </Flex>

          <Flex gap={tokens.space.medium} alignItems="center">
            <AiOutlineDatabase />
            <Button variation="link" onClick={() => router.push("/knowledge")}>
              Knowledge
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
    </Grid>
  );
};

export const BasicLayout = (props: Props) => {
  return (
    <Authenticator.Provider>
      <QueryClientProvider client={queryClient}>
        <Layout {...props} />
      </QueryClientProvider>
    </Authenticator.Provider>
  );
};
