"use client";

import {
  Authenticator,
  Flex,
  Grid,
  Heading,
  ScrollView,
  useAuthenticator,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { NavigationMenu } from "./NavigationMenu";

type Props = {
  headerTitle?: string;
  children: React.ReactNode;
};

const Layout = ({
  children,
  headerTitle = "Welcome to Amplify AI Kit",
}: Props) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { tokens } = useTheme();

  return (
    <Grid
      templateColumns="15rem 1fr"
      templateRows="1fr"
      height="100vh"
      overflow="hidden"
    >
      <View padding={tokens.space.large}>
        <NavigationMenu />
      </View>

      <View
        backgroundColor={tokens.colors.background.secondary}
        overflow="auto"
      >
        <View textAlign="center" padding={tokens.space.large}>
          <View textAlign="center">
            <Heading level={2}>{headerTitle}</Heading>
          </View>
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
      <Layout {...props} />
    </Authenticator.Provider>
  );
};
