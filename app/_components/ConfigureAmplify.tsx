"use client";

import config from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(config, { ssr: true });

export function ConfigureAmplifyClientSide() {
  return null;
}
