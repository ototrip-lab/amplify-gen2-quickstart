// STEP3 Action: envインポートを有効化
// import { env } from '$amplify/env/webSearch';
import { ChatBedrockConverse } from "@langchain/aws";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { TavilySearch } from "@langchain/tavily";

import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../../constants";
// STEP3 Action: Schema型のインポートを有効化
// import type { Schema } from '../resource';

// 型定義の追加
type BedrockResponse = BaseMessage & {
  tool_calls?: Array<{
    name: string;
    args: Record<string, any>;
    id: string;
  }>;
};

type ToolMessage = {
  content: string;
};

type AuthenticatedEvent = {
  request: {
    headers: {
      authorization?: string;
    };
  };
  identity: {
    username: string;
    sub: string;
    claims?: Record<string, any>;
  };
  arguments: {
    message: string;
  };
};

// STEP3 Action: コメントアウト削除
const tavilyTool = new TavilySearch({
  maxResults: 3,
  // tavilyApiKey: env.TAVILY_API_KEY,
});
const model = new ChatBedrockConverse({
  model: CROSS_REGION_BEDROCK_MODEL_PATH,
});

const modelWithTavily = model.bindTools([tavilyTool]);
const prompt = ChatPromptTemplate.fromMessages([
  new SystemMessage("あなたは優秀な検索エージェントです。"),
  ["placeholder", "{messages}"],
]);
const chain = prompt.pipe(modelWithTavily);

const toolChain = RunnableLambda.from(async (userInput: string, config) => {
  const aiMsg = (await chain.invoke(
    {
      messages: [new HumanMessage(userInput)],
    },
    config
  )) as BedrockResponse;
  console.log({ aiMsg });

  const toolCalls = aiMsg.tool_calls || [];
  const toolMsgs = (await tavilyTool.batch(toolCalls, config)) as ToolMessage[];
  console.log({ toolMsgs });

  const result = {
    content: toolMsgs?.[0]?.content || 'No search results found',
  };
  return result;
});

// 認証検証の強化
const validateAuthentication = (
  event: AuthenticatedEvent
): { username: string; sub: string } => {
  const authorization = event.request.headers.authorization;
  const identity = event.identity;

  // 必須フィールドの検証
  if (!authorization) {
    throw new Error('認証ヘッダーが必要です');
  }

  if (!identity?.username || !identity?.sub) {
    throw new Error('有効な認証情報が必要です');
  }

  return {
    username: identity.username,
    sub: identity.sub,
  };
};

// 入力値検証の強化
const validateInput = (message: string): void => {
  if (!message || typeof message !== 'string') {
    throw new Error('有効なメッセージが必要です');
  }

  // 危険な文字の検証
  const dangerousPatterns = /<script|javascript:|data:|vbscript:/i;
  if (dangerousPatterns.test(message)) {
    throw new Error('不正な文字が含まれています');
  }
};

// STEP3 Action: メインのhandler関数を有効化
// export const handler: Schema['webSearch']['functionHandler'] = async (
//   event
// ) => {
//   try {
//     // 認証・認可の検証
//     const { username, sub } = validateAuthentication(
//       event as AuthenticatedEvent
//     );

//     // 入力値の事前チェック
//     const message = event.arguments.message;
//     if (!message) {
//       throw new Error('メッセージが必要です');
//     }

//     // 入力値の検証
//     validateInput(message);

//     console.log(`Web search request from user: ${username} (${sub})`);

//     // エージェントの実行
//     const answer = await toolChain.invoke(message);
//     console.log({ answer });

//     return {
//       value: answer.content,
//     };
//   } catch (error) {
//     console.error('Web search error:', error);

//     // セキュアなエラーメッセージの返却
//     if (error instanceof Error) {
//       throw new Error(`検索処理でエラーが発生しました: ${error.message}`);
//     } else {
//       throw new Error('検索処理で予期しないエラーが発生しました');
//     }
//   }
// };

// STEP3 Action: 仮のhandlerを削除
export const handler = async (event: AuthenticatedEvent) => {
  // 何もしない場合のデフォルトレスポンス
};
