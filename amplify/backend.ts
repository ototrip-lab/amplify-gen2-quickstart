import { defineBackend } from "@aws-amplify/backend";
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

// STEP1 Action: コメントアウト削除
// import { auth } from './auth/resource';
// import { OnUploaded } from './custom/onUploaded/resource';
// import { chatHandler } from './data/chatHandler/resource';
// import { data } from './data/resource';
// import { webSearch } from './data/webSearch/resource';
// import { storage } from './storage/resource';

const backend = defineBackend({
  // auth, // STEP1 Action: コメントアウト削除
  // data,
  // storage,
  // chatHandler,
  // webSearch,
});

// backend.chatHandler.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
//     resources: ['*'],
//   })
// );

// backend.webSearch.resources.lambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: ['bedrock:InvokeModel'],
//     resources: ['*'],
//   })
// );

// const onUploaded = new OnUploaded(
//   backend.createStack('OnUploaded'),
//   'OnUploaded',
//   {
//     bucketName: backend.storage.resources.bucket.bucketName,
//     dynamoDbTableName: backend.data.resources.tables['PublicStorage'].tableName,
//   }
// );
