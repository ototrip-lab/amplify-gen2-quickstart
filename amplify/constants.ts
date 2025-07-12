export const BEDROCK_MODEL_PATH = "amazon.nova-pro-v1:0";
// NOTE: デフォルトはNova Proですが、精度を上げたい場合はClaude Sonnetを使用してください。
// export const BEDROCK_MODEL_PATH = 'anthropic.claude-sonnet-4-20250514-v1:0';
export const CROSS_REGION_NAME = 'apac';
export const CROSS_REGION_BEDROCK_MODEL_PATH = `${CROSS_REGION_NAME}.${BEDROCK_MODEL_PATH}`;
