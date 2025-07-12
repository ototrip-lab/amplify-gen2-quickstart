import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

// STEP2 Action: コメントアウト削除
// import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../constants";
// import { chatHandler } from "./chatHandler/resource";

// STEP3 Action: コメントアウト削除
// import { webSearch } from "./webSearch/resource";

// STEP7 Action: 外部ファイルからのインポートを有効化
// import { DETAILED_SYSTEM_PROMPT } from "./prompts";

// STEP7 Action: ハードコードされたプロンプトを削除
const DETAILED_SYSTEM_PROMPT = "あなたは優秀なAIアシスタントです。";

const schema = a.schema({
  // Define data models
  // STEP2 Action: Todoモデルを削除
  Todo: a
    .model({
      title: a.string().required(),
      description: a.string(),
    })
    .authorization((allow) => allow.owner()),

  // STEP4 Action: UserWikiモデルを有効化
  // UserWiki: a
  //   .model({
  //     title: a.string().required(),
  //     content: a.string().required(),
  //     username: a.id().required(),
  //   })
  //   .secondaryIndexes((index) => [index("username")])
  //   .authorization((allow) => allow.ownerDefinedIn("username")),

  // STEP6 Action: PublicStorageモデルを有効化
  // PublicStorage: a
  //   .model({
  //     filePath: a.string().required(),
  //     description: a.string(),
  //   })
  //   .identifier(["filePath"])
  //   .authorization((allow) => allow.authenticated()),

  // Define functions
  // STEP3 Action: webSearch関数の定義を有効化
  // webSearch: a
  //   .query()
  //   .arguments({
  //     message: a.string(),
  //   })
  //   .returns(
  //     a.customType({
  //       value: a.string(),
  //     }),
  //   )
  //   .handler(a.handler.function(webSearch))
  //   .authorization((allow) => allow.authenticated()),

  // Define AI Kit
  // STEP2 Action: chatの定義のコメントアウトを外す
  // chat: a
  //   .conversation({
  //     aiModel: {
  //       resourcePath: CROSS_REGION_BEDROCK_MODEL_PATH,
  //     },
  //     systemPrompt: DETAILED_SYSTEM_PROMPT,
  //     handler: chatHandler,
  //     tools: [
  //       // STEP4 Action: chatのtoolsにWikiQueryツールを追加
  //       // a.ai.dataTool({
  //       //   name: "WikiQuery",
  //       //   description: "Searches for Wiki records",
  //       //   model: a.ref("UserWiki"),
  //       //   modelOperation: "list",
  //       // }),
  //       // STEP6 Action: chatのtoolsにStorageQueryツールを追加
  //       // a.ai.dataTool({
  //       //   name: "StorageQuery",
  //       //   description: "Searches for PublicStorage records",
  //       //   model: a.ref("PublicStorage"),
  //       //   modelOperation: "list",
  //       // }),
  //       // STEP3 Action: chatのtoolsにwebSearchツールを追加
  //       // a.ai.dataTool({
  //       //   name: "SearchTool",
  //       //   description: "Searches the web for information",
  //       //   query: a.ref("webSearch"),
  //       // }),
  //     ],
  //   })
  //   .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
