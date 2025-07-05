"use client";

import { Button, Flex, useTheme } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

export type NavigationItemProps = {
  icon: ReactElement;
  label: string;
  path?: string;
  onClick?: () => void;
  variant?: "primary" | "link";
  isDisabled?: boolean;
};

export const NavigationItem = ({
  icon,
  label,
  path,
  onClick,
  variant = "link",
  isDisabled = false,
}: NavigationItemProps) => {
  const { tokens } = useTheme();
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      router.push(path);
    }
  };

  if (variant === "primary") {
    return (
      <Button variation="primary" onClick={handleClick} isDisabled={isDisabled}>
        {label}
      </Button>
    );
  }

  return (
    <Flex gap={tokens.space.medium} alignItems="center">
      {icon}
      <Button variation="link" onClick={handleClick} isDisabled={isDisabled}>
        {label}
      </Button>
    </Flex>
  );
};
