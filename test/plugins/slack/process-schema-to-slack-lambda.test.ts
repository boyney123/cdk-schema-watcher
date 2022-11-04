const slackFunction = require('../../../plugins/slack/process-schema-to-slack-lambda.ts');
const SchemaCreatedEvent = require('../events/SchemaCreated.json');
const SchemaVersionUpdated = require('../events/SchemaVersionUpdated.json');

const mockSlackPostMessage = jest.fn((params: any) => Promise.resolve());

// old version schema
const exampleOfOldSchema = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'ThisIsANewEvent10' },
  paths: {},
  components: {
    schemas: {
      AWSEvent: {
        type: 'object',
        required: ['detail-type', 'resources', 'detail', 'id', 'source', 'time', 'region', 'version', 'account'],
        'x-amazon-events-detail-type': 'ThisIsANewEvent10',
        'x-amazon-events-source': 'myapp.users',
        properties: {
          detail: { $ref: '#/components/schemas/ThisIsANewEvent10' },
          account: { type: 'string' },
          'detail-type': { type: 'string' },
          id: { type: 'string' },
          region: { type: 'string' },
          resources: { type: 'array', items: { type: 'string' } },
          source: { type: 'string' },
          time: { type: 'string', format: 'date-time' },
          version: { type: 'string' },
        },
      },
      ThisIsANewEvent10: { type: 'object', required: ['key1', 'key2'], properties: { key1: { type: 'string' }, key2: { type: 'string' } } },
    },
  },
};

// new version
const exampleOfNewSchema = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'ThisIsANewEvent10' },
  paths: {},
  components: {
    schemas: {
      AWSEvent: {
        type: 'object',
        required: ['detail-type', 'resources', 'detail', 'id', 'source', 'time', 'region', 'version', 'account'],
        'x-amazon-events-detail-type': 'ThisIsANewEvent10',
        'x-amazon-events-source': 'myapp.users',
        properties: {
          detail: { $ref: '#/components/schemas/ThisIsANewEvent10' },
          account: { type: 'string' },
          'detail-type': { type: 'string' },
          id: { type: 'string' },
          region: { type: 'string' },
          resources: { type: 'array', items: { type: 'string' } },
          source: { type: 'string' },
          time: { type: 'string', format: 'date-time' },
          version: { type: 'string' },
        },
      },
      ThisIsANewEvent10: { type: 'object', required: ['key1', 'key2'], properties: { key1: { type: 'string' }, key2: { type: 'string' } } },
    },
  },
};

jest.mock('@slack/web-api', () => ({
  WebClient: class {
    constructor() {
      return {
        chat: {
          postMessage: (params: any) => mockSlackPostMessage(params),
        },
      };
    }
  },
}));

jest.mock('@aws-sdk/client-schemas', () => ({
  DescribeSchemaCommand: class {
    props: any;
    constructor(props: any) {
      this.props = props;
    }
  },
  SchemasClient: class {
    constructor() {
      return {
        send: (params: any) => {
          if (params.props.SchemaVersion === 1) {
            return {
              Content: JSON.stringify(exampleOfOldSchema),
            };
          } else {
            return {
              Content: JSON.stringify(exampleOfNewSchema),
            };
          }
        },
      };
    }
  },
}));

beforeEach(() => {
  process.env.CHANNEL_ID = 'fake-channel';
  process.env.API_KEY = 'fake-api-key';
});

describe('slack lambda function to process information into slack', () => {
  it('throws an error if no CHANNEL_ID is found in the environment variables', async () => {
    process.env.CHANNEL_ID = '';
    await expect(slackFunction.handler({ test: true })).rejects.toThrowError('No Channel ID found');
  });

  it('makes a request to SLACK API with blocks when a new schema has been created', async () => {
    await slackFunction.handler(SchemaCreatedEvent);

    expect(mockSlackPostMessage).toHaveBeenCalledWith({
      channel: 'fake-channel',
      blocks: [
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '⭐️ A new event has been published *"ThisIsANewEvent10"*',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Version:*\n<https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/registries/discovered-schemas/schemas/myapp.users@ThisIsANewEvent10/version/1|version 1>',
            },
            {
              type: 'mrkdwn',
              text: '*SchemaType:*\nOpenApi3',
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Event Source:*\nmyapp.users',
            },
            {
              type: 'mrkdwn',
              text: '*Creation Date:*\n2022-11-04T12:46:28Z',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Schema (v1)* ```{\n    "openapi": "3.0.0",\n    "info": {\n        "version": "1.0.0",\n        "title": "ThisIsANewEvent10"\n    },\n    "paths": {},\n    "components": {\n        "schemas": {\n            "AWSEvent": {\n                "type": "object",\n                "required": [\n                    "detail-type",\n                    "resources",\n                    "detail",\n                    "id",\n                    "source",\n                    "time",\n                    "region",\n                    "version",\n                    "account"\n                ],\n                "x-amazon-events-detail-type": "ThisIsANewEvent10",\n                "x-amazon-events-source": "myapp.users",\n                "properties": {\n                    "detail": {\n                        "$ref": "#/components/schemas/ThisIsANewEvent10"\n                    },\n                    "account": {\n                        "type": "string"\n                    },\n                    "detail-type": {\n                        "type": "string"\n                    },\n                    "id": {\n                        "type": "string"\n                    },\n                    "region": {\n                        "type": "string"\n                    },\n                    "resources": {\n                        "type": "array",\n                        "items": {\n                            "type": "string"\n                        }\n                    },\n                    "source": {\n                        "type": "string"\n                    },\n                    "time": {\n                        "type": "string",\n                        "format": "date-time"\n                    },\n                    "version": {\n                        "type": "string"\n                    }\n                }\n            },\n            "ThisIsANewEvent10": {\n                "type": "object",\n                "required": [\n                    "key1",\n                    "key2"\n                ],\n                "properties": {\n                    "key1": {\n                        "type": "string"\n                    },\n                    "key2": {\n                        "type": "string"\n                    }\n                }\n            }\n        }\n    }\n}```',
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '_What am I seeing this? A new event has been created on your event bus._',
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    });
  });

  it('makes a request to SLACK API with blocks when a new schema version has been created', async () => {
    await slackFunction.handler(SchemaVersionUpdated);

    expect(mockSlackPostMessage).toHaveBeenCalledWith({
      channel: 'fake-channel',
      blocks: [
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '🚨 New schema version found for event *"ThisIsANewEvent10"*',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Previous Version:*\n<https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/registries/discovered-schemas/schemas/myapp.users@ThisIsANewEvent10/version/1|version 1>',
            },
            {
              type: 'mrkdwn',
              text: '*New Version:*\n<https://us-west-2.console.aws.amazon.com/events/home?region=us-west-2#/registries/discovered-schemas/schemas/myapp.users@ThisIsANewEvent10/version/2|version 2>',
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Event Source:*\nmyapp.users',
            },
            {
              type: 'mrkdwn',
              text: '*Creation Date:*\n2022-11-04T13:52:44Z',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Diff (v1:v2)* ``````',
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '_What am I seeing this? A new version of an event has been created. You may have downstream consumers that may break due to contract changes._',
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    });
  });

  
});

export {};
