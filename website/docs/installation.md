---
id: installation
title: Installation
---

Getting up and running with SchemaWatcher should take a few minutes (hopefully!).

## Requirements {#requirements}

- [Node.js](https://nodejs.org/en/download/) version >= 14 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed
- [Yarn](https://yarnpkg.com/en/) version >= 1.5 (which can be checked by running `yarn --version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.
- [CDK v2](https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html) version >= 2.0 

## Installing the construct {#installing-the-construct}

To get started with SchemaWatcher you will need to install the construct into your project.

```bash
npm i cdk-schema-watcher
```

## Using the construct

Once installed, you will need to import the construct into your project and configure the plugins you want to use.

:::tip Plugin Support

At the moment only Slack is supported, looking to release more soon.

If you would like to help write a plugin, you can read the plugin docs.
:::

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
      sources: ['myapp.users', 'myapp.orders'],
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

With SchemaWatcher you can listen to a variety of events from the schema registry. You can configure these inside the `SchemaWatcher` construct.

### Listening to all events from a EventBridge source

If you want to listen to all events for a given `source` you can configure your `SchemaWatcher` to do that. 

**Example**

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
      sources: ['myapp.payments'],
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

As you can see above we are interested in `all` schema changes that are going to happen inside the `myapp.payments` source. This means **any** change to these schemas (new or new versions) will get reported to the selected plugins (in this example)

