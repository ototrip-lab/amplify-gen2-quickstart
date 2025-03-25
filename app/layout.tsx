import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { BasicLayout } from "./_components/BasicLayout";
import { ConfigureAmplifyClientSide } from "./_components/ConfigureAmplify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <ConfigureAmplifyClientSide />
        <BasicLayout>{children}</BasicLayout>
      </body>
    </html>
  );
}
