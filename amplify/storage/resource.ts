import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "publicFiles",
  access: (allow) => ({
    "public/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
