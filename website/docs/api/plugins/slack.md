---
sidebar_position: 1
id: slack
title: '📦 Slack Plugin'
---

SchemaWatcher allows you to notify your downstream consumers of schema changes using Slack.

You can pick the channel you want to notify.

## Getting started

First you will need a `SLACK_API_KEY` and `SLACK_CHANNEL_ID` you can find out how to get [these on the slack documentation](https://slack.com/help/articles/215770388-Create-and-regenerate-API-tokens).

Once you have your `SLACK_API_KEY` and `SLACK_CHANNEL_ID` you can configure the Slack plugin.

First import the plugin.

```js
import { SlackNotifier } from 'cdk-schema-watcher/plugins';
```

Next, configure SchemaWatcher to use the plugin.

```js
export class CdkSchemaWatcherSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SchemaWatcher(this, 'MyTeam', {
      type: 'All',
      schemas: ['myapp.users@UserCreated'],
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

:::tip
When running `cdk deploy` you will need to set the `SLACK_API_KEY` and `SLACK_CHANNEL_ID` as environmental variables. 

If you would to prefer to use another service to pass these values into the construct you can. You can pass the configuration into the construct anyway you want.
:::

Once you deploy the construct it will start listening to your configured schemas.

## Example output

The Slack plugin will output two different styles of posts `New Schemas` and `Changed Schemas`.

#### Example of `New Schema Version` into slack

When a new version of a schema is raised, a diff is posted back to Slack. The diff between the new and old schemas.

![new schema slack post](/img/slack-example1.png)

#### Example of `New Schema` into slack

When new schemas are raised the Schema is posted to slack with links back to your AWS account.

![new schema slack post](/img/slack-example2.png)