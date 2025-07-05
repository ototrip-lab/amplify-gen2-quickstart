import { Duration } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import * as url from 'node:url';

type OnUploadedProps = {
  bucketName: string;
  dynamoDbTableName: string;
};

export class OnUploaded extends Construct {
  public func?: NodejsFunction;

  constructor(scope: Construct, id: string, props: OnUploadedProps) {
    super(scope, id);

    // Amplify resourcesを参照
    const storage = Bucket.fromBucketName(this, 'storage', props.bucketName);
    const dynamoDbTable = Table.fromTableName(
      this,
      'dynamoDbTable',
      props.dynamoDbTableName
    );

    // Lambda Functions
    const func = new NodejsFunction(this, 'onUpLoaded', {
      entry: url.fileURLToPath(new URL('index.ts', import.meta.url)),
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.minutes(5),
    });

    // S3のイベント通知をLambdaに設定
    storage.addEventNotification(
      EventType.OBJECT_CREATED_PUT,
      new LambdaDestination(func),
      {
        prefix: 'public/',
      }
    );

    // 環境変数
    func.addEnvironment('DYNAMODB_TABLE_NAME', props.dynamoDbTableName);

    // 権限をLambdaに付与
    dynamoDbTable.grantReadWriteData(func);
    storage.grantRead(func);
    func.addToRolePolicy(
      new PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: ['*'],
      })
    );
    this.func = func;
  }
}
