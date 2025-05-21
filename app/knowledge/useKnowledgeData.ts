import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Knowledge項目の型定義
export type KnowledgeItem = {
  id: string;
  title: string; // タイトルに階層構造を含める（例: "/programming/javascript/Next.js の基本"）
  content: string;
  createdAt: string;
  updatedAt: string;
};

// 初期データ（サンプル）
const initialItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "/cloud/AWS",
    content:
      "# AWS\n\nAmazon Web Services (AWS) は、Amazonが提供するクラウドコンピューティングサービスです。",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    title: "/cloud/aws/AWS Amplify とは",
    content:
      "# AWS Amplify\n\nAWS Amplifyは、モバイルおよびフロントエンドのウェブ開発者が、AWSでフルスタックアプリケーションを構築するための開発プラットフォームです。\n\n## 主な機能\n\n- **認証**: Amazon Cognitoを使用したユーザー認証\n- **データストア**: AppSyncとDynamoDBを使用したデータ管理\n- **ストレージ**: Amazon S3を使用したファイルストレージ\n- **API**: RESTおよびGraphQL APIの作成と管理",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "/programming/javascript/frameworks/Next.js の基本",
    content:
      "# Next.js の基本\n\nNext.jsは、Reactベースのフレームワークで、サーバーサイドレンダリング、静的サイト生成、APIルートなどの機能を提供します。\n\n## 主な特徴\n\n- **ファイルベースのルーティング**: pagesディレクトリ内のファイル構造に基づいてルートが自動的に作成される\n- **サーバーサイドレンダリング (SSR)**: 初期ロード時にサーバー側でページをレンダリング\n- **静的サイト生成 (SSG)**: ビルド時に静的HTMLを生成\n- **APIルート**: サーバーレス関数としてAPIエンドポイントを作成",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "4",
    title: "/programming/javascript/JavaScript",
    content:
      "# JavaScript\n\nJavaScriptは、Webページに動的な機能を追加するためのプログラミング言語です。",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "5",
    title: "/programming/プログラミング",
    content:
      "# プログラミング\n\nプログラミングは、コンピュータに特定のタスクを実行させるための指示を書くプロセスです。",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "6",
    title: "/cloud/クラウド",
    content:
      "# クラウドコンピューティング\n\nクラウドコンピューティングは、インターネットを通じてコンピューティングサービスを提供するモデルです。",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const useKnowledgeData = () => {
  // ローカルステートでデータを管理（実際のアプリではDBと連携）
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  // タイトルからパスとディスプレイ名を分離
  const splitTitlePathAndName = (
    title: string,
  ): { path: string; displayName: string } => {
    // タイトルが/で始まらない場合はルートとして扱う
    if (!title.startsWith("/")) {
      return { path: "/", displayName: title };
    }

    // 最後の/以降をディスプレイ名とする
    const lastSlashIndex = title.lastIndexOf("/");
    if (lastSlashIndex === 0) {
      // ルート直下の場合
      return { path: "/", displayName: title.substring(1) };
    }

    const path = title.substring(0, lastSlashIndex);
    const displayName = title.substring(lastSlashIndex + 1);

    return { path, displayName };
  };

  // ディスプレイ名を取得
  const getDisplayName = (title: string): string => {
    return splitTitlePathAndName(title).displayName;
  };

  // パスを取得
  const getPath = (title: string): string => {
    return splitTitlePathAndName(title).path;
  };

  // 階層レベルを取得
  const getItemLevel = (item: KnowledgeItem): number => {
    const path = getPath(item.title);
    return path.split("/").filter(Boolean).length;
  };

  // パスが別のパスの子孫かどうかを確認
  const isDescendantOf = (childTitle: string, parentTitle: string): boolean => {
    const childPath = getPath(childTitle);
    const parentPath = getPath(parentTitle);

    if (parentPath === "/") return childPath !== "/";
    return childPath.startsWith(parentPath + "/") || childPath === parentPath;
  };

  // アイテムをツリー構造に整理
  const organizeItemsIntoTree = () => {
    // パスでソート
    return [...items].sort((a, b) => {
      const pathA = getPath(a.title);
      const pathB = getPath(b.title);

      // まずパスの階層で比較
      if (pathA !== pathB) {
        return pathA.localeCompare(pathB);
      }

      // パスが同じ場合はディスプレイ名で比較
      return getDisplayName(a.title).localeCompare(getDisplayName(b.title));
    });
  };

  // 新規作成（指定されたパスに作成）
  const createItem = (parentPath: string = "/") => {
    const newTitle =
      parentPath === "/" ? `/新しいタイトル` : `${parentPath}/新しいタイトル`;

    const newItem: KnowledgeItem = {
      id: uuidv4(),
      title: newTitle,
      content: "# 新しいコンテンツ\n\nここに内容を入力してください。",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems([newItem, ...items]);
    setSelectedItem(newItem);

    return newItem;
  };

  // 更新
  const updateItem = (updatedItem: KnowledgeItem) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id
        ? { ...updatedItem, updatedAt: new Date().toISOString() }
        : item,
    );

    setItems(updatedItems);
    setSelectedItem(updatedItem);
  };

  // 削除（子アイテムも含めて削除）
  const deleteItem = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id);
    if (!itemToDelete) return;

    // 削除対象のアイテムとその子孫を除外
    const updatedItems = items.filter(
      (item) =>
        item.id !== id && !isDescendantOf(item.title, itemToDelete.title),
    );

    setItems(updatedItems);

    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  // ツリー表示用のソート済みアイテム
  const treeItems = organizeItemsIntoTree();

  return {
    items: treeItems, // ツリー構造用にソートされたすべてのアイテム
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
    getItemLevel, // アイテムの階層レベルを取得する関数
    getDisplayName, // タイトルからディスプレイ名を取得する関数
    getPath, // タイトルからパスを取得する関数
  };
};
