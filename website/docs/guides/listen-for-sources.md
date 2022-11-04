---
sidebar_position: 1
id: listening-for-schemas-based-on-source
title: Listen for changes based on source
---  

With SchemaWatcher you can listen to schemas based on their source.

The example below will listen to all schema changes within the `source` called `myapp.users`.

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
      sources: ['myapp.users'],
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