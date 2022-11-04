---
sidebar_position: 1
id: listening-for-schemas
title: Listen for changes based on schema names
---  

With SchemaWatcher you can listen to schema changes by their names.

The example below will listen to all schema changes for the schemas `myapp.users@UserCreated` and `myapp.orders@OrderCreated`

```js
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { SchemaWatcher } from 'cdk-schema-watcher';
import { SlackNotifier } from 'cdk-schema-watcher/plugins';

export class CdkSchemaWatcherSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SchemaWatcher(this, 'MyTeam', {
      type: 'All',
      schemas: ['myapp.users@UserCreated', 'myapp.orders@OrderCreated']
      plugins: [
        new SlackNotifier({
          API_KEY: process.env.SLACK_API_KEY,
          CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
        }),
      ],
    });
  }
}

```