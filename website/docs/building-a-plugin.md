---
id: building-a-plugin
---

# Building a plugin

When you create a new `SchemaWatcher` instance you can pass it an array of `Plugins`. The SchemaWatcher will go through the plugins and execute them.

Here is an example of the `SlackNotifier` plugin

```js
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
```

You can replace and write your own

```js
 new SchemaWatcher(this, 'MyTeam', {
      type: 'All',
      schemas: ['myapp.users@UserCreated'],
      sources: ['myapp.users', 'myapp.orders'],
      plugins: [
        new MySuperCoolPlugin({
            anythingIwant: true,
            thisIsGreat: true
        }),
      ],
    });
```

When your plugin is executed it will get the `EventBridge Rule` to attach your target too. 
As this is generated dynamically for you from the consumers input, you can create anything you want (within reason!).

To get started, recommended looking at the Slack Plugin to get started.