import { defineBackend } from "@aws-amplify/backend";
// STEP2 Action: コメントアウト削除
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

// STEP1 Action: コメントアウト削除
// import { auth } from './auth/resource';
// STEP2 Action: コメントアウト削除
// import { chatHandler } from './data/chatHandler/resource';
// import { data } from './data/resource';
// STEP3 Action: コメントアウト削除
// import { webSearch } from './data/webSearch/resource';
// STEP5 Action: コメントアウト削除
// import { storage } from './storage/resource';
// STEP6 Action: コメントアウト削除
// import { OnUploaded } from './custom/onUploaded/resource';

const backend = defineBackend({
  // auth, // STEP1 Action: コメントアウト削除
  // data, // STEP2 Action: コメントアウト削除
  // chatHandler, // STEP2 Action: コメントアウト削除
  // webSearch, // STEP3 Action: コメントアウト削除
  // storage, // STEP5 Action: コメントアウト削除
});

// STEP2 Action: 以下のBedrock権限設定も有効化
// backend.chatHandler.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
//     resources: ['*'],
//   })
// );

// STEP3 Action: 以下のBedrock権限設定も有効化
// backend.webSearch.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: ['bedrock:InvokeModel'],
//     resources: ['*'],
//   })
// );

// STEP6 Action: 最後に以下のカスタムリソースを有効化
// const onUploaded = new OnUploaded(
//   backend.createStack('OnUploaded'),
//   'OnUploaded',
//   {
//     bucketName: backend.storage.resources.bucket.bucketName,
//     dynamoDbTableName: backend.data.resources.tables['PublicStorage'].tableName,
//   }
// );
