import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ChatBedrockConverse } from '@langchain/aws';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import type { S3Handler } from 'aws-lambda';
import { Readable } from 'stream';

import { CROSS_REGION_BEDROCK_MODEL_PATH } from "../../constants";
import { PDF_SUMMARY_SYSTEM_PROMPT } from "../../data/prompts";

// Environment variables
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Initialize AWS SDK clients
const s3Client = new S3Client({});
const dynamoDbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

// Define the Bedrock
const model = new ChatBedrockConverse({
  model: CROSS_REGION_BEDROCK_MODEL_PATH,
});
const systemPrompt = PDF_SUMMARY_SYSTEM_PROMPT;

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

export const handler: S3Handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  if (!DYNAMODB_TABLE_NAME) {
    console.error('DYNAMODB_TABLE_NAME is not set');
    return;
  }

  for (const record of event.Records) {
    // file path decode
    const decodedFilePath = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, ' ')
    );

    // get object
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: record.s3.bucket.name,
        Key: decodedFilePath,
      })
    );

    if (response.ContentType !== 'application/pdf') {
      console.error('Not a PDF');
      return;
    }

    const stream = response.Body as Readable;
    const buffer = await streamToBuffer(stream);

    if (!Buffer.isBuffer(buffer)) {
      console.error('Failed to convert stream to buffer');
      return;
    }

    // load PDF
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();
    const text = docs.map((doc) => doc.pageContent).join('\n');
    console.log('Extracted text:', text.slice(0, 50));

    const answer = await model.invoke([
      ['system', systemPrompt],
      ['human', text],
    ]);

    const description = answer.text || '';
    console.log('Answer:', description);

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
          filePath: decodedFilePath,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __typename: 'PublicStorage',
          username: 'system',
        },
      })
    );
  }
};
