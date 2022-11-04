---
id: debugging
title: Debugging
---

By default all new instances of the `SchemaWatcher` come with a **CloudWatch Log Group** configured, all events that match your rule will be put here. You can use this to make sure your configuration is correct and your rules/schema events are being triggered.

The log groups will follow a format of `/aws/events/schema-watcher/{team-name}/schema-notification-logs`.

:::tip

It can take a few minutes for EventBridge to send the schema change events. So if you don't see things immediately give it a few minutes before debugging.

:::

### Configure your Event Bus

In order to get notified of schema changes you need to turn on [schema discovery on your EventBridge bus](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-schema.html). 