# AWS Amplify Gen2 ワークショップ - Amplify AI Kit のツール拡張で学ぶ、Amplify Gen2開発体験

## ワークショップ概要

このワークショップでは、コメントアウト解除によってAWS Amplify Gen2の機能を段階的に学習します。

学習方式: コメントアウトを外すだけで機能を有効化  
所要時間: 約2時間
学習内容: Authentication → Chat Handler → Web Search → Data → Storage → Custom Lambda

### このワークショップについて

このワークショップは、以下のZenn記事をベースに作成されています

[Amplify AI Kit 解説：ゼロから作るAIチャットアプリ](https://zenn.dev/ototrip/articles/tech-nextjs-amplify-6)

セットアップ方法などの詳細が未記載であって、不明な点があれば上記の記事をご覧ください。

### Amplify AI Kit とは

Amplify AI Kit は、AWS Amplify が提供する機能の一つで、Amazon Bedrock の大規模言語モデル（LLM）を簡単にアプリケーションに統合できるツールです。

### このワークショップで構築するアプリケーション

このワークショップでは、以下の機能を持つ AI チャットアプリケーションを段階的に構築します

1. ユーザー認証機能（サインアップ、ログイン）
2. AI アシスタントとのチャット機能
3. Web検索機能を使った高度なAI回答
4. Wiki形式でのデータ管理機能
5. ファイルアップロード・ストレージ機能
6. カスタムLambda関数による自動化処理

---

## 事前準備

### ローカル環境の設定

公式ドキュメントを参考に、AWS Amplify の関連リソースにアクセス可能な状態にしてください。

https://docs.amplify.aws/react/start/account-setup/

### Amazon Bedrock のモデル利用申請

Amplify AI Kit を使用するには Amazon Bedrock のモデルアクセス権が必要です。

1. AWS マネジメントコンソールにログイン
   AWS アカウントにログインし、Amazon Bedrock のコンソールに移動します。

2. モデルアクセスページに移動
   左側のナビゲーションから「モデルアクセス」を選択します。

3. モデルアクセスの管理
   「モデルアクセスを変更」ボタンをクリックし、使用したいモデル（Claude Sonnet v4）のチェックボックスをオンにします。

4. アクセス承認の待機
   通常、モデルアクセスの承認は数分以内に完了します。承認されると、ステータスが「アクセスが付与されました」に変わります。

Amazon Bedrock の使用には料金が発生するため、料金体系を確認してください。

### 環境セットアップ

```bash
# git clone
$ git clone https://github.com/ototrip-lab/amplify-gen2-quickstart.git -b event/cdk-conference-2025-start
$ cd amplify-gen2-quickstart

# 依存関係インストール
$ npm install

# Amplifyサンドボックス起動
$ npx ampx sandbox

# フロントエンド起動（別ターミナル）
$ npm run dev
```

http://localhost:3000 にアクセスして、各ページにシンプルなタイトルのみ表示される状態を確認してください。

---

## Step 1: Authentication

### 目標

Email認証機能を有効化し、ユーザー管理システムを構築します。

### 実装手順

#### Backend設定有効化

ファイル: amplify/backend.ts

以下のコメントアウトを外します

```ts
// コメントアウトを外す
import { auth } from './auth/resource';

const backend = defineBackend({
  auth, // この行のコメントアウトを外す
  // data,
  // storage,
  // chatHandler,
  // webSearch,
});
```

#### 認証UI有効化

ファイル: app/_components/BasicLayout/index.tsx

以下のコメントアウトを外します

```ts
// 以下のコメントアウトを外す
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

const MainSection = ({ children, headerTitle }: Props) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]); // この行のコメントアウトを外す
  const { tokens } = useTheme();

  return (
    <>
      <View textAlign="center" padding={tokens.space.large}>
        <View textAlign="center">
          <Heading level={2}>{headerTitle}</Heading>
        </View>
      </View>
      {/* 以下のブロック全体のコメントアウトを外す */}
      {authStatus === 'authenticated' ? (
        <ScrollView width='100%'>{children}</ScrollView>
      ) : (
        <Flex
          justifyContent='center'
          alignItems='center'
          paddingTop={tokens.space.xxxl}
        >
          <Authenticator />
        </Flex>
      )}
    </>
  );
};
```

### 動作確認

Amplifyサンドボックスで変更が自動デプロイされます。ブラウザでログイン画面が表示され、新規ユーザー登録とログインができることを確認してください。ログイン後、ページ内容が表示されます。

---

## Step 2: Chat Handler

### 目標

Amazon Bedrock統合とAI会話機能の基本部分を実装します。

### 実装手順

#### Data設定有効化

ファイル: amplify/data/resource.ts

以下の変更を行います：

```ts
// コメントアウトを外す
import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../constants";
import { chatHandler } from "./chatHandler/resource";

// Todoモデルを削除
// Todo: a
//   .model({
//     title: a.string().required(),
//     description: a.string(),
//   })
//   .authorization((allow) => allow.owner()),

// chatの定義のコメントアウトを外す
chat: a
  .conversation({
    aiModel: {
      resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
    },
    systemPrompt: DETAILED_SYSTEM_PROMPT,
    handler: chatHandler,
    tools: [
      // 別ステップでツールを有効化
    ],
  })
  .authorization((allow) => allow.owner()),
```

#### Backend設定有効化

ファイル: amplify/backend.ts

以下のコメントアウトを外します

```ts
// 以下のコメントアウトを外す
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { chatHandler } from './data/chatHandler/resource';

// 以下のコメントアウトを外す
import { chatHandler } from './data/chatHandler/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data, // この行のコメントアウトを外す
  // storage,
  chatHandler, // この行のコメントアウトを外す
  // webSearch,
});

// 以下のBedrock権限設定も有効化
backend.chatHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
    resources: ['*'],
  })
);
```

#### AI Conversation機能有効化

ファイル: app/_components/AIConversationLayout.tsx

全てのコメントアウトを外します

```ts
import { View, useTheme } from '@aws-amplify/ui-react';
import { AIConversation } from '@aws-amplify/ui-react-ai';
import Markdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import { useAIConversation } from '@/app/client';

export const AIConversationLayout = ({ id }: { id?: string }) => {
  // 全ての実装のコメントアウトを外してください
};
```

#### Chat機能有効化

ファイル: app/chat/page.tsx

```ts
import { AIConversationLayout } from '@/app/_components/AIConversationLayout';

export default AIConversationLayout;
```

#### History機能有効化

ファイル: app/history/page.tsx

全てのコメントアウトを外します。

### 動作確認

New Chat ボタンまたは /chat でAI会話ができることを確認してください。基本的なAI会話機能が動作します。

---

## Step 3: Web Search

### 目標

Web検索機能を追加してAI会話を拡張します。

### 実装手順

#### 外部サービス API Key設定

```bash
# Tavily Web検索API設定
npx ampx sandbox secret set TAVILY_API_KEY
# APIキー取得: https://tavily.com/
```

#### Backend設定有効化

ファイル: amplify/backend.ts

以下のコメントアウトを外します

```ts
// 以下のコメントアウトを外す
import { webSearch } from './data/webSearch/resource';

const backend = defineBackend({
  auth,
  chatHandler,
  data,
  // storage,
  webSearch, // この行のコメントアウトを外す
});

// 以下のBedrock権限設定も有効化
backend.webSearch.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*'],
  })
);
```

#### Data設定有効化

ファイル: amplify/data/resource.ts

以下のコメントアウトを外します

```ts
// webSearchハンドラーのインポートを有効化
import { webSearch } from "./webSearch/resource";

// webSearch関数の定義を有効化
webSearch: a
  .query()
  .arguments({
    message: a.string(),
  })
  .returns(
    a.customType({
      value: a.string(),
    }),
  )
  .handler(a.handler.function(webSearch))
  .authorization((allow) => allow.authenticated()),

// chatのtoolsにwebSearchツールを追加
chat: a
  .conversation({
    aiModel: {
      resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
    },
    systemPrompt: DETAILED_SYSTEM_PROMPT,
    handler: chatHandler,
    tools: [
      a.ai.dataTool({
        name: "SearchTool",
        description: "Searches the web for information",
        query: a.ref("webSearch"),
      }),
    ],
  })
  .authorization((allow) => allow.owner()),
```

#### WebSearch実装修正

ファイル: amplify/data/webSearch/index.ts

以下のコメントアウトを外します

```ts
// Schema型のインポートを有効化
import type { Schema } from '../resource';

// メインのhandler関数を有効化
export const handler: Schema['webSearch']['functionHandler'] = async (
  event
) => {
  try {
    // 認証・認可の検証
    const { username, sub } = validateAuthentication(
      event as AuthenticatedEvent
    );

    // 入力値の事前チェック
    const message = event.arguments.message;
    if (!message) {
      throw new Error('メッセージが必要です');
    }

    // 入力値の検証
    validateInput(message);

    console.log(`Web search request from user: ${username} (${sub})`);

    // エージェントの実行
    const answer = await toolChain.invoke(message);
    console.log({ answer });

    return {
      value: answer.content,
    };
  } catch (error) {
    console.error('Web search error:', error);

    // セキュアなエラーメッセージの返却
    if (error instanceof Error) {
      throw new Error(`検索処理でエラーが発生しました: ${error.message}`);
    } else {
      throw new Error('検索処理で予期しないエラーが発生しました');
    }
  }
};

// 仮のhandler（152-154行目）を削除
// export const handler = async (event: AuthenticatedEvent) => {
//   // 何もしない場合のデフォルトレスポンス
// };
```

### 動作確認

AI Chatで外部情報を検索して回答する機能が動作することを確認してください。

---

## Step 4: Data Models

### 目標

GraphQL APIとDynamoDBを有効化し、Wiki CRUD機能を実装します。

### 実装手順

#### Data設定修正

ファイル: amplify/data/resource.ts

以下のコメントアウトを外します

```ts
// UserWikiモデルを有効化
UserWiki: a
  .model({
    title: a.string().required(),
    content: a.string().required(),
    username: a.id().required(),
  })
  .secondaryIndexes((index) => [index("username")])
  .authorization((allow) => allow.ownerDefinedIn("username")),

// chatのtoolsにWikiQueryツールを追加
chat: a
  .conversation({
    aiModel: {
      resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
    },
    systemPrompt: DETAILED_SYSTEM_PROMPT,
    handler: chatHandler,
    tools: [
      a.ai.dataTool({
        name: "WikiQuery",
        description: "Searches for Wiki records",
        model: a.ref("UserWiki"),
        modelOperation: "list",
      }),
      a.ai.dataTool({
        name: 'SearchTool',
        description: 'Searches the web for information',
        query: a.ref('webSearch'),
      }),
    ],
  })
  .authorization((allow) => allow.owner()),
```

#### Wiki機能有効化

ファイル: app/wiki/page.tsx

全てのコメントアウトを外して、元の機能を有効化します：

```ts
import { useState } from "react";

import { MarkdownEditor } from "./_components/MarkdownEditor";
import { MarkdownPreview } from "./_components/MarkdownPreview";
import { WikiList } from "./_components/WikiList";
import type { WikiItem } from "./types";
import { useWikiData } from "./useWikiData";

type ViewMode = "list" | "detail" | "edit";

const App = () => {
  const {
    items,
    selectedItem,
    setSelectedItem,
    createItem,
    updateItem,
    deleteItem,
  } = useWikiData();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // 以下全ての関数とreturn文のコメントアウトを外してください
```

### 動作確認

/wiki ページでWiki一覧が表示され、新しいWiki記事の作成、編集、削除ができることを確認してください。所有者のみが編集可能な認可機能も動作します。AI ChatでWikiデータを参照した回答も可能になります。

---

## Step 5: Storage

### 目標

S3バケットを有効化し、ファイルアップロード・管理機能を実装します。

### 実装手順

#### Backend設定有効化

ファイル: amplify/backend.ts

以下のコメントアウトを外します

```ts
// 以下のコメントアウトを外す
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  chatHandler,
  webSearch,
  data,
  storage, // この行のコメントアウトを外す
});
```

#### Storage機能有効化

ファイル: app/storage/page.tsx

全てのコメントアウトを外して、元の機能を有効化します：

```ts
import { Divider, Flex, Heading, useTheme } from "@aws-amplify/ui-react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import {
  createAmplifyAuthAdapter,
  createStorageBrowser,
} from "@aws-amplify/ui-react-storage/browser";

import "@/app/_components/ConfigureAmplify";

const { StorageBrowser } = createStorageBrowser({
  config: createAmplifyAuthAdapter(),
});

const App = () => {
  const { tokens } = useTheme();

  return (
    <Flex
      direction="column"
      gap={tokens.space.medium}
      padding={tokens.space.large}
    >
      <Flex justifyContent="space-between" alignItems="end">
        <Heading level={2}>Storage</Heading>
      </Flex>
      <Divider />
      <FileUploader
        acceptedFileTypes={["application/pdf"]}
        path="public/"
        maxFileCount={1}
        isResumable
      />
      <StorageBrowser />
    </Flex>
  );
};
```

### 動作確認

/storage ページでファイルアップロード機能が表示され、PDFファイルをアップロードできることを確認してください。アップロードしたファイル一覧が表示され、ファイルをダウンロードできます。AI Chatでストレージファイルを参照した回答も可能になります。

---

## Step 6: Custom Lambda

### 目標

カスタムLambda関数によるS3イベント処理の自動化を実装します。

### 実装手順

#### Data設定有効化

ファイル: amplify/data/resource.ts

以下のコメントアウトを外します

```ts
// PublicStorageモデルを有効化
PublicStorage: a
  .model({
    filePath: a.string().required(),
    description: a.string(),
  })
  .identifier(["filePath"])
  .authorization((allow) => allow.authenticated()),

// chatのtoolsにStorageQueryツールを追加
chat: a
  .conversation({
    aiModel: {
      resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
    },
    systemPrompt: DETAILED_SYSTEM_PROMPT,
    handler: chatHandler,
    tools: [
      a.ai.dataTool({
        name: "WikiQuery",
        description: "Searches for Wiki records",
        model: a.ref("UserWiki"),
        modelOperation: "list",
      }),
      a.ai.dataTool({
        name: "StorageQuery",
        description: "Searches for PublicStorage records",
        model: a.ref("PublicStorage"),
        modelOperation: "list",
      }),
      a.ai.dataTool({
        name: 'SearchTool',
        description: 'Searches the web for information',
        query: a.ref('webSearch'),
      }),
    ],
  })
  .authorization((allow) => allow.owner()),
```

#### Backend設定有効化

ファイル: amplify/backend.ts

以下のコメントアウトを外します

```ts
// 以下のコメントアウトを外す
import { OnUploaded } from './custom/onUploaded/resource';

// 最後に以下のカスタムリソースを有効化
const onUploaded = new OnUploaded(
  backend.createStack('OnUploaded'),
  'OnUploaded',
  {
    bucketName: backend.storage.resources.bucket.bucketName,
    dynamoDbTableName: backend.data.resources.tables['PublicStorage'].tableName,
  }
);
```

### 動作確認

New Chat ボタンまたは /chat でAI会話ができることを確認してください。Wikiデータを参照した回答が得られ、ストレージファイルを参照した回答も可能です。/history でチャット履歴が確認でき、Web検索機能も動作します（Tavily設定済みの場合）。

---

---

## ワークショップ完了

### 構築したアーキテクチャ

Frontend (Next.js)

- React UI Components
- Authentication
- Wiki CRUD
- File Upload
- AI Chat

AWS Amplify Gen2

- GraphQL API
- DynamoDB
- S3 Storage
- Custom Lambda

AI Services

- Amazon Bedrock
- Web Search

### 習得したスキル

Authentication: Cognito認証、認可制御
Data: GraphQL、DynamoDB、リアルタイム同期
Storage: S3、ファイル管理、権限制御
AI Integration: Bedrock、RAG、Function Calling
Custom Lambda: イベント処理、CDK統合

### 次のステップ

本番環境へのデプロイ、追加機能の実装、パフォーマンス最適化、セキュリティ強化を検討してください。

---

## トラブルシューティング

### よくある問題

ログイン画面が表示されない場合
amplify/backend.tsでauthのコメントアウトが外れているか確認してください。BasicLayout/index.tsxで認証UIが有効化されているか確認してください。

Wiki機能でエラーが発生する場合
amplify/backend.tsでdataのコメントアウトが外れているか確認してください。Amplifyサンドボックスが正常に動作しているか確認してください。

AI Chatでエラーが発生する場合
Bedrock権限設定が有効化されているか確認してください。リージョン設定（amplify/constants.ts）を確認してください。

### デバッグコマンド

```bash
# Amplifyリソース状態確認
npx ampx sandbox --list

# ログ確認
npx ampx sandbox logs
```

AWS Amplify Gen2の完全な機能を体験できました。
