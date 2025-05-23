import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

import { chatHandler } from "./chatHandler/resource";
import { BEDROCK_MODEL_PATH } from "./constants";

const schema = a.schema({
  User: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  UserWiki: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      username: a.id().required(),
    })
    .secondaryIndexes((index) => [index("username")])
    .authorization((allow) => allow.ownerDefinedIn("username")),

  // Define AI Kit
  chat: a
    .conversation({
      aiModel: {
        resourcePath: BEDROCK_MODEL_PATH,
      },
      systemPrompt: "You are a helpful AI assistant.",
      handler: chatHandler,
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
