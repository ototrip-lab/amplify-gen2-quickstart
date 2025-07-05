"use client";

import { Flex, useAuthenticator, useTheme } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import {
  AiOutlineDatabase,
  AiOutlineFolderOpen,
  AiOutlineHistory,
  AiOutlineHome,
} from "react-icons/ai";

import { NavigationItem, NavigationItemProps } from "./NavigationItem";

// ナビゲーションアイテムの設定
const navigationItems: NavigationItemProps[] = [
  {
    icon: <AiOutlineHome />,
    label: "Home",
    path: "/",
  },
  {
    icon: <AiOutlineHistory />,
    label: "History",
    path: "/history",
  },
  {
    icon: <AiOutlineFolderOpen />,
    label: "Storage",
    path: "/storage",
  },
  {
    icon: <AiOutlineDatabase />,
    label: "Wiki",
    path: "/wiki",
  },
];

export const NavigationMenu = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { tokens } = useTheme();
  const router = useRouter();

  // New Chatボタンの特別なロジック
  const handleNewChat = () => {
    const pathname = window.location.pathname;
    if (pathname === "/chat") {
      window.location.reload();
    } else {
      router.push("/chat");
    }
  };

  return (
    <Flex
      gap={tokens.space.large}
      direction="column"
      rowGap={tokens.space.medium}
      paddingTop={tokens.space.xxxl}
      paddingBottom={tokens.space.xxxl}
    >
      {/* New Chat Button */}
      <NavigationItem
        icon={<></>}
        label="New Chat"
        onClick={handleNewChat}
        variant="primary"
        isDisabled={authStatus !== "authenticated"}
      />

      {/* Regular Navigation Items */}
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          path={item.path}
          onClick={item.onClick}
        />
      ))}
    </Flex>
  );
};
