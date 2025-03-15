"use client";

import { Amplify } from "aws-amplify";

// @ts-ignore
import config from "@/amplify_outputs.json";

Amplify.configure(config, { ssr: true });

export function ConfigureAmplifyClientSide() {
  return null;
}
