# AWS Amplify Gen2 ワークショップ - Amplify AI Kit のツール拡張で学ぶ、Amplify Gen2開発体験

## ワークショップ概要

このワークショップでは、コメントアウト解除によってAWS Amplify Gen2の機能を段階的に学習します。

学習方式: コメントアウトを外すだけで機能を有効化  
所要時間: 約1.5時間
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

### 注意事項

このワークショップはわかりやすさを重視しています。実際のアプリケーションとして利用される場合は、パフォーマンスやセキュリティの要件に合わせて修正する必要があります。

---

## 事前準備

### ローカル環境の設定

公式ドキュメントを参考に、AWS Amplify の関連リソースにアクセス可能な状態にしてください。

https://docs.amplify.aws/react/start/account-setup/

### Amazon Bedrock のモデル利用申請

Amplify AI Kit を使用するには Amazon Bedrock のモデルアクセス権が必要です。
Amazon Bedrock の使用には料金が発生するため、料金体系を確認してください。

1. Amazon Bedrock コンソールで「モデルアクセス」を選択
2. 「モデルアクセスを変更」から Claude Sonnet v4 を有効化（通常数分で承認）

※ アカウント全体でBedrockの利用履歴がない場合はモデルアクセスクォーター制限が厳しい可能性があります。その場合は、Amazon Nova Proも許可申請に追加してください。

---

## 環境セットアップ

### プロジェクトの作成

スタート状態のブランチを用意しています。
こちらのレポジトリからCloneする、もしくはこちらレポジトリのテンプレートからご自分の管理下にレポジトリを作成しCloneしてください。

※ 全ての作業が完了したブランチも用意しています。以下の手順で不明な点がある場合は、[完了番ブランチ](https://github.com/ototrip-lab/amplify-gen2-quickstart/tree/event/cdk-conference-2025-completed)をご覧ください。

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

### その他コマンドの紹介

開発に便利なコマンドを用意しています。適宜ご利用ください。

```bash
# biomeによるフォーマット
$ npm run format

# 型チェック
$ npm run tsc
```

---

## Step 1: Authentication

### 目標

Email認証機能を有効化し、ユーザー管理システムを構築します。

### 手順

#### Backend設定有効化

amplify/backend.ts の認証設定を有効化します。

※ 作業が必要なコメントの冒頭に `Action: ` を記載しております。

```ts
// Action: コメントアウト削除
import { auth } from './auth/resource';

const backend = defineBackend({
  auth, // Action: コメントアウト削除
  // data,
  // storage,
  // chatHandler,
  // webSearch,
});
```

> [!NOTE]
> ファイル保存によって自動的にバックエンドにリソースがデプロイされます。

#### 認証UI有効化

app/\_components/BasicLayout/index.tsx の認証UIを有効化します。

```ts
// Action: コメントアウト削除
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
  const { authStatus } = useAuthenticator((context) => [context.authStatus]); // Action: コメントアウト削除
  const { tokens } = useTheme();

  return (
    <>
      <View textAlign="center" padding={tokens.space.large}>
        <View textAlign="center">
          <Heading level={2}>{headerTitle}</Heading>
        </View>
      </View>
      {/* Action: 以下のブロック全体のコメントアウトを外す */}
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

> [!NOTE]
>
> useAuthenticatorからユーザーのログイン状況を取得して、認証画面とログイン後画面を切り替えています。

### 確認

Amplifyサンドボックスで変更が自動デプロイされます。ブラウザでログイン画面が表示され、新規ユーザー登録とログインができることを確認してください。ログイン後、ページ内容が表示されます。

---

## Step 2: Chat Handler

### 目標

Amazon Bedrock統合とAI会話機能の基本部分を実装します。

### 手順

#### Data設定有効化

amplify/data/resource.ts のData設定を有効化します。

> [!NOTE]
> /Amplify以下の複数ファイルを変更する場合は、`npx ampx sandbox` コマンドを一度停止して修正が完了してから再開することをお勧めします。

```ts
// Action: コメントアウト削除
import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../constants";
import { chatHandler } from "./chatHandler/resource";

// Action: Todoモデルを削除
// Todo: a
//   .model({
//     title: a.string().required(),
//     description: a.string(),
//   })
//   .authorization((allow) => allow.owner()),

// Action: chatの定義のコメントアウトを外す
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

> [!NOTE]
>
> aiModelは別の設定方法もあります。（[参考](https://docs.amplify.aws/react/ai/concepts/models/#using-different-models)）こちらの方法であれば、モデルアクセスのためのIAM権限も自動で設定してくれます。しかし、Claudeは 3.5 Sonnet v2までしか用意されいないため、上記の通りカスタマイズする方法を選択しています。

#### Backend設定有効化

amplify/backend.ts のBackend設定を有効化します。

```ts
// Action: コメントアウト削除
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { chatHandler } from './data/chatHandler/resource';

// Action: コメントアウト削除
import { chatHandler } from './data/chatHandler/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data, // Action: コメントアウト削除
  // storage,
  chatHandler, // Action: コメントアウト削除
  // webSearch,
});

// Action: 以下のBedrock権限設定も有効化
backend.chatHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
    resources: ['*'],
  })
);
```

> [!NOTE]
>
> AppSyncから呼び出すLambda関数は `amplify/data/resource.ts` と `amplify/backend.ts` の両方で設定する必要があります。これは、前者がAppSyncの設定、後者がLambdaの設定のために必要です。

#### AI Conversation機能有効化

app/\_components/AIConversationLayout.tsx のAI Conversation機能を有効化します。

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

app/chat/page.tsx を下記の通り書き換えます。

```ts
// Action: コメントアウト削除
import { AIConversationLayout } from '@/app/_components/AIConversationLayout';

// Action: コメントアウト削除
export default AIConversationLayout;

// Action: その他削除
```

app/chat/[id]/page.tsx を下記の通り書き換えます。

```ts
// Action: コメントアウト削除
import { AIConversationLayout } from '@/app/_components/AIConversationLayout';

// Action: コメントアウト削除
// return <AIConversationLayout id={id} key={id} />;

// Action: 以下削除
// return (
//   <div>
//     <h1>Chat Page</h1>
//     <p>Chat ID: {id}</p>
//     {/* Add your chat component here */}
//   </div>
// );
```

#### History機能有効化

app/history/page.tsx のコメントアウトを削除し、初期記述 `App` を削除します。

### 動作確認

New Chat ボタンまたは /chat でAIチャットを確認。基本的なAIチャット機能が動作します。また、/history でチャット履歴の閲覧、およびチャットの再開が動作します。

---

## Step 3: Web Search

### 目標

Tavily APIを使用したWeb検索機能をAIチャットに統合します。

※ Tavily APIを利用できない場合は本章をスキップしてください

### 手順

#### 外部サービス API Key設定

外部API Key設定には、Amplifyのシークレットキーを安全に設定する方法（[参考](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/#secure-secrets-in-your-sandbox)）を利用します。

```bash
# Tavily Web検索API設定
npx ampx sandbox secret set TAVILY_API_KEY
# APIキー取得: https://tavily.com/
```

> [!NOTE]
> すでに起動している `npx ampx sandbox` を一度停止して設定する方が確実です。

#### WebSearch Resource設定有効化

amplify/data/webSearch/resource.ts のWebSearch Resource設定を有効化します。

```ts
export const webSearch = defineFunction({
  name: 'webSearch',
  entry: './index.ts',
  timeoutSeconds: 30,
  runtime: 22,
  environment: {
    TAVILY_API_KEY: secret('TAVILY_API_KEY'), // Action: コメントアウト削除
  },
});
```

#### Backend設定有効化

amplify/backend.ts のBackend設定を有効化します。

```ts
// Action: コメントアウト削除
import { webSearch } from './data/webSearch/resource';

const backend = defineBackend({
  auth,
  chatHandler,
  data,
  // storage,
  webSearch, // Action: コメントアウト削除
});

// Action: 以下のBedrock権限設定も有効化
backend.webSearch.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*'],
  })
);
```

#### Data設定有効化

amplify/data/resource.ts のData設定を有効化します。

```ts
// Action: コメントアウト削除
import { webSearch } from "./webSearch/resource";

// Action: webSearch関数の定義を有効化
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

// Action: chatのtoolsにwebSearchツールを追加
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

amplify/data/webSearch/index.ts のWebSearch実装を修正します。

```ts
// Action: envインポートを有効化
import { env } from '$amplify/env/webSearch';

// Action: Schema型のインポートを有効化
import type { Schema } from '../resource';

// TAVILY_API_KEYを有効化
const tavilyTool = new TavilySearch({
  maxResults: 3,
  tavilyApiKey: env.TAVILY_API_KEY, // Action: コメントアウト削除
});

// Action: メインのhandler関数を有効化
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

// Action: 仮のhandlerを削除
// export const handler = async (event: AuthenticatedEvent) => {
//   // 何もしない場合のデフォルトレスポンス
// };
```

### 動作確認

AIチャットで外部情報を検索して回答する機能が動作することを確認してください。

---

## Step 4: Data Models

### 目標

GraphQL APIとDynamoDBを有効化し、Wiki CRUD機能を実装します。

### 手順

#### Data設定修正

amplify/data/resource.ts のData設定を有効化します。

```ts
// Action: UserWikiモデルを有効化
UserWiki: a
  .model({
    title: a.string().required(),
    content: a.string().required(),
    username: a.id().required(),
  })
  .secondaryIndexes((index) => [index("username")])
  .authorization((allow) => allow.ownerDefinedIn("username")),

// Action: chatのtoolsにWikiQueryツールを追加
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

app/wiki/page.tsx のWiki機能を有効化します。

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

  // Action: 以下全ての関数とreturn文のコメントアウトを外してください
```

### 動作確認

/wiki ページでWiki一覧が表示され、新しいWiki記事の作成、編集、削除を確認。所有者のみが編集可能な認可機能も動作します。AIチャットでWikiデータを参照した回答も可能になります。

---

## Step 5: Storage

### 目標

S3バケットを有効化し、ファイルアップロード・管理機能を実装します。

### 手順

#### Backend設定有効化

amplify/backend.ts のBackend設定を有効化します。

```ts
// Action: コメントアウト削除
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  chatHandler,
  webSearch,
  data,
  storage, // Action: コメントアウト削除
});
```

#### Storage機能有効化

app/storage/page.tsx のStorage機能を有効化します。

```ts
// Action: コメントアウト削除
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

/storage ページでファイルアップロード機能が表示され、PDFファイルをアップロードできることを確認してください。アップロードしたファイル一覧が表示され、ファイルをダウンロードできます。

---

## Step 6: Custom Lambda

### 目標

カスタムLambda関数によるS3イベント処理の自動化を実装します。

### 手順

#### Data設定有効化

amplify/data/resource.ts のData設定を有効化します。

```ts
// Action: PublicStorageモデルを有効化
PublicStorage: a
  .model({
    filePath: a.string().required(),
    description: a.string(),
  })
  .identifier(["filePath"])
  .authorization((allow) => allow.authenticated()),

// Action: chatのtoolsにStorageQueryツールを追加
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

amplify/backend.ts のBackend設定を有効化します。

```ts
// Action: コメントアウト削除
import { OnUploaded } from './custom/onUploaded/resource';

// Action: 最後に以下のカスタムリソースを有効化
const onUploaded = new OnUploaded(
  backend.createStack('OnUploaded'),
  'OnUploaded',
  {
    bucketName: backend.storage.resources.bucket.bucketName,
    dynamoDbTableName: backend.data.resources.tables['PublicStorage'].tableName,
  }
);
```

> [!NOTE]
>
> onUploadedではPDFのみ処理するように実装しています。また、S3のデータを削除してもそれを反映する機能は実装されていません。必要な場合は機能追加してください。

### 動作確認

New Chat ボタンまたは /chat でAIチャットを確認。Wikiデータを参照した回答が得られ、ストレージファイルを参照した回答も可能です。/history でチャット履歴が確認でき、Web検索機能も動作します（Tavily設定済みの場合）。

> [!NOTE]
>
> onUploaded処理が数十秒必要となる場合があります。アップロード直後は反映されていない可能性がありますので、ご注意ください。

---

## Step 7: System Prompt最適化

### 目標

ハードコードされたシステムプロンプトを外部ファイルから読み込むように変更し、保守性を向上させます。

### 手順

#### Data設定修正

amplify/data/resource.ts のData設定を修正します。

```ts
// Action: ハードコードされたプロンプトを削除
// const DETAILED_SYSTEM_PROMPT = "あなたは優秀なAIアシスタントです。";

// Action: 外部ファイルからのインポートを有効化
import { DETAILED_SYSTEM_PROMPT } from './prompts';
```

### 動作確認

システムプロンプト読み込み確認

---

## ワークショップ完了

以上で、全てのAWS Amplify Gen2の機能実装が完了しました。
Web、Database、Storageの情報から回答を作成してくれるAI Chatが簡単に作成できました。

### リソースの削除

```bash
$ npx ampx sandbox delete
$ npx ampx sandbox secret remove TAVILY_API_KEY
```
