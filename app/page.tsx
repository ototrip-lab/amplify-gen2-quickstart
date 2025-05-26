"use client";

import { Flex, Grid, useTheme } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import {
  AiOutlineDatabase,
  AiOutlineFolderOpen,
  AiOutlineHistory,
  AiOutlineWechat,
} from "react-icons/ai";

import { FeatureCard } from "@/app/_components/FeatureCard";

const HomePage = () => {
  const { tokens } = useTheme();
  const router = useRouter();

  return (
    <Flex direction="column" padding={tokens.space.xl} gap={tokens.space.xl}>
      <Grid
        templateColumns={{ base: "1fr", medium: "1fr 1fr" }}
        gap={tokens.space.large}
      >
        <FeatureCard
          title="Chat"
          description="Interact with an AI assistant to get answers to your questions, obtain information, and receive help with various tasks. Your conversation history is automatically saved, allowing you to resume at any time."
          icon={<AiOutlineWechat />}
          onClick={() => router.push("/chat")}
        />
        <FeatureCard
          title="History"
          description="View a list of your past chat conversations and refer to them whenever needed. You can also delete any unnecessary history entries to keep your records organized."
          icon={<AiOutlineHistory />}
          onClick={() => router.push("/history")}
        />
        <FeatureCard
          title="Storage"
          description="A cloud storage solution that enables you to upload, manage, and share files. Create folders, organize files, and set access permissions to efficiently manage your data."
          icon={<AiOutlineFolderOpen />}
          onClick={() => router.push("/storage")}
        />
        <FeatureCard
          title="Wiki"
          description="Create and edit documents in Markdown format to build a comprehensive knowledge base. Organize content by categories for efficient information sharing and knowledge accumulation within your team."
          icon={<AiOutlineDatabase />}
          onClick={() => router.push("/wiki")}
        />
      </Grid>
    </Flex>
  );
};

export default HomePage;
