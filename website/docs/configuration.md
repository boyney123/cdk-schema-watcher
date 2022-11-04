---
id: configuration
title: Configuration
---

SchemaWatcher allows you to configure what you want to listen to.

- Listen to `any` change to schemas (New versions created and New schemas created)
- Only listen to `New Schmea Versions` (event payload has changed from producer)
- Only listen to `New Schemas` (new event payload from producer found)
- Listen to particular events
- Listen to all events in a given EventBridge `source`
- And more...

### Naming your schema listener

This construct allows teams to listen to any schemas changes they are interested in. It's recommended to put the team name inside the construct so all AWS resources will be prefixed with that team name.

An example of a team called `MyAwesomeTeam` can be seen below.

```js title="Setting up schema listeners for MyAwesomeTeam"
new SchemaWatcher(this, 'MyAwesomeTeam', {
    ...
});
```

---


### `type` {#type}

Type of schema changes you want to listen to.

- Type: `string`
- Options
  - `All` - Listen to new schemas and updates to schemas
  - `Changed` - Listen to schemas that have changed
  - `New` - Listen to new schemas

```js title="Example of listening to All schema changes"
new SchemaWatcher(this, 'MyTeam', {
    type: 'All',
    ...
});
```

---

### `sources (optional)` {#sources}

Sources you want to listen for. These will be used downstream in a custom EventBridge rule that the CDK construct will setup.

- Type: `string[]`

```js title="Example of listening to All schema changes for the source myapp.users"
new SchemaWatcher(this, 'MyTeam', {
    type: 'All',
    sources: ['myapp.users'],
    ...
});
```

---

### `schemas (optional)` {#scehams}

Pick out the schemas you want to listen to.

The example below will listen to all changes only for the schema `myapp.users@UserCreated`

- Type: `string[]`

```js title="Example of listening to All schema changes for the source myapp.users"
new SchemaWatcher(this, 'MyTeam', {
    type: 'All',
    schemas: ['myapp.users@UserCreated'],
    ...
});
```

---

### `plugins` {#plugins}

Array of SchemaWatcher plugins you want to use to notify your downstream consumers.

Below is an example of using the Slack plugin.

- Type: `SchemaWatcherPlugin[]`

```js title="Example of listening to All schema changes for the source myapp.users"
new SchemaWatcher(this, 'MyTeam', {
    type: 'All',
    schemas: ['myapp.users@UserCreated'],
    plugins: [
      new SlackNotifier({
        API_KEY: process.env.SLACK_API_KEY,
        CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
      }),
    ],
    ...
});
```

