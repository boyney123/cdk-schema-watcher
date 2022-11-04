---
id: plugin-intro
---

# What are plugins?

SchemaWatcher was built with extensibility in mind. 

Consumers can configure schema listners and be notified any way the want, you just have to have the plugin to support it.

## How to plugins work 

SchemaWatcher will initiate all configured plugins for the construct. SchemaWatcher will pass on the dynamic configured **EventBridge Rule** to the plugin through the `PluginProps`.

Plugin authors can use this rule and attach an [EventBridge target to it](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html).

This allows SchemaWatcher to do the heavy lifting for you, and you can write a plugin to notify anything you want.

**Plugin Architecture Diagram**

![plugin-architecture](/img/plugin-architecture.png)

## Example of how the Slack plugin works

**Slack Plugin diagram**

![slack-plugin-architecture](/img/slack-plugin.png)

The slack plugin takes the generated `EventBridge Rule` and then attachs a Lambda function to it. When the rule is triggered (either schema change or new schema) the Lambda function will fetch the schema information and post it to Slack.