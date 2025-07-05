import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../constants";
import { chatHandler } from "./chatHandler/resource";
import { DETAILED_SYSTEM_PROMPT } from "./prompts";
import { webSearch } from "./webSearch/resource";

const schema = a.schema({
  // Define data models
  UserWiki: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      username: a.id().required(),
    })
    .secondaryIndexes((index) => [index("username")])
    .authorization((allow) => allow.ownerDefinedIn("username")),

  PublicStorage: a
    .model({
      filePath: a.string().required(),
      description: a.string(),
    })
    .identifier(["filePath"])
    .authorization((allow) => allow.authenticated()),

  // Define functions
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

  // Define AI Kit
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
          name: "SearchTool",
          description: "Searches the web for information",
          query: a.ref("webSearch"),
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
