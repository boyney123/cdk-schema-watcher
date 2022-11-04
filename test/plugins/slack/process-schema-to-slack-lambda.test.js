"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slackFunction = require('../../../plugins/slack/process-schema-to-slack-lambda.ts');
const SchemaCreatedEvent = require('../events/SchemaCreated.json');
const SchemaVersionUpdated = require('../events/SchemaVersionUpdated.json');
const mockSlackPostMessage = jest.fn((params) => Promise.resolve());
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
                    postMessage: (params) => mockSlackPostMessage(params),
                },
            };
        }
    },
}));
jest.mock('@aws-sdk/client-schemas', () => ({
    DescribeSchemaCommand: class {
        constructor(props) {
            this.props = props;
        }
    },
    SchemasClient: class {
        constructor() {
            return {
                send: (params) => {
                    if (params.props.SchemaVersion === 1) {
                        return {
                            Content: JSON.stringify(exampleOfOldSchema),
                        };
                    }
                    else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzcy1zY2hlbWEtdG8tc2xhY2stbGFtYmRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9jZXNzLXNjaGVtYS10by1zbGFjay1sYW1iZGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0FBQzFGLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDbkUsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUU1RSxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBRXpFLHFCQUFxQjtBQUNyQixNQUFNLGtCQUFrQixHQUFHO0lBQ3pCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFFO0lBQ3RELEtBQUssRUFBRSxFQUFFO0lBQ1QsVUFBVSxFQUFFO1FBQ1YsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxRQUFRO2dCQUNkLFFBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUN4Ryw2QkFBNkIsRUFBRSxtQkFBbUI7Z0JBQ2xELHdCQUF3QixFQUFFLGFBQWE7Z0JBQ3ZDLFVBQVUsRUFBRTtvQkFDVixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0NBQXdDLEVBQUU7b0JBQzFELE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7b0JBQzNCLGFBQWEsRUFBRSxFQUFFLElBQUksRUFB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O1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFHTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNsYWNrRnVuY3Rpb24gPSByZXF1aXJlKCcuLi8uLi8uLi9wbHVnaW5zL3NsYWNrL3Byb2Nlc3Mtc2NoZW1hLXRvLXNsYWNrLWxhbWJkYS50cycpO1xuY29uc3QgU2NoZW1hQ3JlYXRlZEV2ZW50ID0gcmVxdWlyZSgnLi4vZXZlbnRzL1NjaGVtYUNyZWF0ZWQuanNvbicpO1xuY29uc3QgU2NoZW1hVmVyc2lvblVwZGF0ZWQgPSByZXF1aXJlKCcuLi9ldmVudHMvU2NoZW1hVmVyc2lvblVwZGF0ZWQuanNvbicpO1xuXG5jb25zdCBtb2NrU2xhY2tQb3N0TWVzc2FnZSA9IGplc3QuZm4oKHBhcmFtczogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoKSk7XG5cbi8vIG9sZCB2ZXJzaW9uIHNjaGVtYVxuY29uc3QgZXhhbXBsZU9mT2xkU2NoZW1hID0ge1xuICBvcGVuYXBpOiAnMy4wLjAnLFxuICBpbmZvOiB7IHZlcnNpb246ICcxLjAuMCcsIHRpdGxlOiAnVGhpc0lzQU5ld0V2ZW50MTAnIH0sXG4gIHBhdGhzOiB7fSxcbiAgY29tcG9uZW50czoge1xuICAgIHNjaGVtYXM6IHtcbiAgICAgIEFXU0V2ZW50OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydkZXRhaWwtdHlwZScsICdyZXNvdXJjZXMnLCAnZGV0YWlsJywgJ2lkJywgJ3NvdXJjZScsICd0aW1lJywgJ3JlZ2lvbicsICd2ZXJzaW9uJywgJ2FjY291bnQnXSxcbiAgICAgICAgJ3gtYW1hem9uLWV2ZW50cy1kZXRhaWwtdHlwZSc6ICdUaGlzSXNBTmV3RXZlbnQxMCcsXG4gICAgICAgICd4LWFtYXpvbi1ldmVudHMtc291cmNlJzogJ215YXBwLnVzZXJzJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGRldGFpbDogeyAkcmVmOiAnIy9jb21wb25lbnRzL3NjaGVtYXMvVGhpc0lzQU5ld0V2ZW50MTAnIH0sXG4gICAgICAgICAgYWNjb3VudDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICdkZXRhaWwtdHlwZSc6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICBpZDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIHJlZ2lvbjogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIHJlc291cmNlczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgICAgICAgc291cmNlOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgdGltZTogeyB0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJyB9LFxuICAgICAgICAgIHZlcnNpb246IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBUaGlzSXNBTmV3RXZlbnQxMDogeyB0eXBlOiAnb2JqZWN0JywgcmVxdWlyZWQ6IFsna2V5MScsICdrZXkyJ10sIHByb3BlcnRpZXM6IHsga2V5MTogeyB0eXBlOiAnc3RyaW5nJyB9LCBrZXkyOiB7IHR5cGU6ICdzdHJpbmcnIH0gfSB9LFxuICAgIH0sXG4gIH0sXG59O1xuXG4vLyBuZXcgdmVyc2lvblxuY29uc3QgZXhhbXBsZU9mTmV3U2NoZW1hID0ge1xuICBvcGVuYXBpOiAnMy4wLjAnLFxuICBpbmZvOiB7IHZlcnNpb246ICcxLjAuMCcsIHRpdGxlOiAnVGhpc0lzQU5ld0V2ZW50MTAnIH0sXG4gIHBhdGhzOiB7fSxcbiAgY29tcG9uZW50czoge1xuICAgIHNjaGVtYXM6IHtcbiAgICAgIEFXU0V2ZW50OiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICByZXF1aXJlZDogWydkZXRhaWwtdHlwZScsICdyZXNvdXJjZXMnLCAnZGV0YWlsJywgJ2lkJywgJ3NvdXJjZScsICd0aW1lJywgJ3JlZ2lvbicsICd2ZXJzaW9uJywgJ2FjY291bnQnXSxcbiAgICAgICAgJ3gtYW1hem9uLWV2ZW50cy1kZXRhaWwtdHlwZSc6ICdUaGlzSXNBTmV3RXZlbnQxMCcsXG4gICAgICAgICd4LWFtYXpvbi1ldmVudHMtc291cmNlJzogJ215YXBwLnVzZXJzJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGRldGFpbDogeyAkcmVmOiAnIy9jb21wb25lbnRzL3NjaGVtYXMvVGhpc0lzQU5ld0V2ZW50MTAnIH0sXG4gICAgICAgICAgYWNjb3VudDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICdkZXRhaWwtdHlwZSc6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICBpZDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIHJlZ2lvbjogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIHJlc291cmNlczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgICAgICAgc291cmNlOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgdGltZTogeyB0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnZGF0ZS10aW1lJyB9LFxuICAgICAgICAgIHZlcnNpb246IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBUaGlzSXNBTmV3RXZlbnQxMDogeyB0eXBlOiAnb2JqZWN0JywgcmVxdWlyZWQ6IFsna2V5MScsICdrZXkyJ10sIHByb3BlcnRpZXM6IHsga2V5MTogeyB0eXBlOiAnc3RyaW5nJyB9LCBrZXkyOiB7IHR5cGU6ICdzdHJpbmcnIH0gfSB9LFxuICAgIH0sXG4gIH0sXG59O1xuXG5qZXN0Lm1vY2soJ0BzbGFjay93ZWItYXBpJywgKCkgPT4gKHtcbiAgV2ViQ2xpZW50OiBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjaGF0OiB7XG4gICAgICAgICAgcG9zdE1lc3NhZ2U6IChwYXJhbXM6IGFueSkgPT4gbW9ja1NsYWNrUG9zdE1lc3NhZ2UocGFyYW1zKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuICB9LFxufSkpO1xuXG5qZXN0Lm1vY2soJ0Bhd3Mtc2RrL2NsaWVudC1zY2hlbWFzJywgKCkgPT4gKHtcbiAgRGVzY3JpYmVTY2hlbWFDb21tYW5kOiBjbGFzcyB7XG4gICAgcHJvcHM6IGFueTtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgfVxuICB9LFxuICBTY2hlbWFzQ2xpZW50OiBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZW5kOiAocGFyYW1zOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAocGFyYW1zLnByb3BzLlNjaGVtYVZlcnNpb24gPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIENvbnRlbnQ6IEpTT04uc3RyaW5naWZ5KGV4YW1wbGVPZk9sZFNjaGVtYSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBDb250ZW50OiBKU09OLnN0cmluZ2lmeShleGFtcGxlT2ZOZXdTY2hlbWEpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbn0pKTtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHByb2Nlc3MuZW52LkNIQU5ORUxfSUQgPSAnZmFrZS1jaGFubmVsJztcbiAgcHJvY2Vzcy5lbnYuQVBJX0tFWSA9ICdmYWtlLWFwaS1rZXknO1xufSk7XG5cbmRlc2NyaWJlKCdzbGFjayBsYW1iZGEgZnVuY3Rpb24gdG8gcHJvY2VzcyBpbmZvcm1hdGlvbiBpbnRvIHNsYWNrJywgKCkgPT4ge1xuICBpdCgndGhyb3dzIGFuIGVycm9yIGlmIG5vIENIQU5ORUxfSUQgaXMgZm91bmQgaW4gdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcycsIGFzeW5jICgpID0+IHtcbiAgICBwcm9jZXNzLmVudi5DSEFOTkVMX0lEID0gJyc7XG4gICAgYXdhaXQgZXhwZWN0KHNsYWNrRnVuY3Rpb24uaGFuZGxlcih7IHRlc3Q6IHRydWUgfSkpLnJlamVjdHMudG9UaHJvd0Vycm9yKCdObyBDaGFubmVsIElEIGZvdW5kJyk7XG4gIH0pO1xuXG4gIGl0KCdtYWtlcyBhIHJlcXVlc3QgdG8gU0xBQ0sgQVBJIHdpdGggYmxvY2tzIHdoZW4gYSBuZXcgc2NoZW1hIGhhcyBiZWVuIGNyZWF0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgc2xhY2tGdW5jdGlvbi5oYW5kbGVyKFNjaGVtYUNyZWF0ZWRFdmVudCk7XG5cbiAgICBleHBlY3QobW9ja1NsYWNrUG9zdE1lc3NhZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIGNoYW5uZWw6ICdmYWtlLWNoYW5uZWwnLFxuICAgICAgYmxvY2tzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnZGl2aWRlcicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICB0ZXh0OiAn4q2Q77iPIEEgbmV3IGV2ZW50IGhhcyBiZWVuIHB1Ymxpc2hlZCAqXCJUaGlzSXNBTmV3RXZlbnQxMFwiKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdzZWN0aW9uJyxcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgIHRleHQ6ICcqVmVyc2lvbjoqXFxuPGh0dHBzOi8vdXMtd2VzdC0yLmNvbnNvbGUuYXdzLmFtYXpvbi5jb20vZXZlbnRzL2hvbWU/cmVnaW9uPXVzLXdlc3QtMiMvcmVnaXN0cmllcy9kaXNjb3ZlcmVkLXNjaGVtYXMvc2NoZW1hcy9teWFwcC51c2Vyc0BUaGlzSXNBTmV3RXZlbnQxMC92ZXJzaW9uLzF8dmVyc2lvbiAxPicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgdGV4dDogJypTY2hlbWFUeXBlOipcXG5PcGVuQXBpMycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICB0ZXh0OiAnKkV2ZW50IFNvdXJjZToqXFxubXlhcHAudXNlcnMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgIHRleHQ6ICcqQ3JlYXRpb24gRGF0ZToqXFxuMjAyMi0xMS0wNFQxMjo0NjoyOFonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgdGV4dDogJypTY2hlbWEgKHYxKSogYGBge1xcbiAgICBcIm9wZW5hcGlcIjogXCIzLjAuMFwiLFxcbiAgICBcImluZm9cIjoge1xcbiAgICAgICAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcXG4gICAgICAgIFwidGl0bGVcIjogXCJUaGlzSXNBTmV3RXZlbnQxMFwiXFxuICAgIH0sXFxuICAgIFwicGF0aHNcIjoge30sXFxuICAgIFwiY29tcG9uZW50c1wiOiB7XFxuICAgICAgICBcInNjaGVtYXNcIjoge1xcbiAgICAgICAgICAgIFwiQVdTRXZlbnRcIjoge1xcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcXG4gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBbXFxuICAgICAgICAgICAgICAgICAgICBcImRldGFpbC10eXBlXCIsXFxuICAgICAgICAgICAgICAgICAgICBcInJlc291cmNlc1wiLFxcbiAgICAgICAgICAgICAgICAgICAgXCJkZXRhaWxcIixcXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIixcXG4gICAgICAgICAgICAgICAgICAgIFwic291cmNlXCIsXFxuICAgICAgICAgICAgICAgICAgICBcInRpbWVcIixcXG4gICAgICAgICAgICAgICAgICAgIFwicmVnaW9uXCIsXFxuICAgICAgICAgICAgICAgICAgICBcInZlcnNpb25cIixcXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjb3VudFwiXFxuICAgICAgICAgICAgICAgIF0sXFxuICAgICAgICAgICAgICAgIFwieC1hbWF6b24tZXZlbnRzLWRldGFpbC10eXBlXCI6IFwiVGhpc0lzQU5ld0V2ZW50MTBcIixcXG4gICAgICAgICAgICAgICAgXCJ4LWFtYXpvbi1ldmVudHMtc291cmNlXCI6IFwibXlhcHAudXNlcnNcIixcXG4gICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgIFwiZGV0YWlsXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiRyZWZcIjogXCIjL2NvbXBvbmVudHMvc2NoZW1hcy9UaGlzSXNBTmV3RXZlbnQxMFwiXFxuICAgICAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICAgICAgXCJhY2NvdW50XCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxcbiAgICAgICAgICAgICAgICAgICAgfSxcXG4gICAgICAgICAgICAgICAgICAgIFwiZGV0YWlsLXR5cGVcIjoge1xcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXFxuICAgICAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcXG4gICAgICAgICAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgICAgICAgICBcInJlZ2lvblwiOiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcXG4gICAgICAgICAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgICAgICAgICBcInJlc291cmNlc1wiOiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYXJyYXlcIixcXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VcIjoge1xcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXFxuICAgICAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICAgICAgXCJ0aW1lXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiBcImRhdGUtdGltZVwiXFxuICAgICAgICAgICAgICAgICAgICB9LFxcbiAgICAgICAgICAgICAgICAgICAgXCJ2ZXJzaW9uXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfSxcXG4gICAgICAgICAgICBcIlRoaXNJc0FOZXdFdmVudDEwXCI6IHtcXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXFxuICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogW1xcbiAgICAgICAgICAgICAgICAgICAgXCJrZXkxXCIsXFxuICAgICAgICAgICAgICAgICAgICBcImtleTJcIlxcbiAgICAgICAgICAgICAgICBdLFxcbiAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xcbiAgICAgICAgICAgICAgICAgICAgXCJrZXkxXCI6IHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxcbiAgICAgICAgICAgICAgICAgICAgfSxcXG4gICAgICAgICAgICAgICAgICAgIFwia2V5MlwiOiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcXG4gICAgICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgfVxcbn1gYGAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnY29udGV4dCcsXG4gICAgICAgICAgZWxlbWVudHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgIHRleHQ6ICdfV2hhdCBhbSBJIHNlZWluZyB0aGlzPyBBIG5ldyBldmVudCBoYXMgYmVlbiBjcmVhdGVkIG9uIHlvdXIgZXZlbnQgYnVzLl8nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2RpdmlkZXInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ21ha2VzIGEgcmVxdWVzdCB0byBTTEFDSyBBUEkgd2l0aCBibG9ja3Mgd2hlbiBhIG5ldyBzY2hlbWEgdmVyc2lvbiBoYXMgYmVlbiBjcmVhdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHNsYWNrRnVuY3Rpb24uaGFuZGxlcihTY2hlbWFWZXJzaW9uVXBkYXRlZCk7XG5cbiAgICBleHBlY3QobW9ja1NsYWNrUG9zdE1lc3NhZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIGNoYW5uZWw6ICdmYWtlLWNoYW5uZWwnLFxuICAgICAgYmxvY2tzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnZGl2aWRlcicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICB0ZXh0OiAn8J+aqCBOZXcgc2NoZW1hIHZlcnNpb24gZm91bmQgZm9yIGV2ZW50ICpcIlRoaXNJc0FOZXdFdmVudDEwXCIqJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgdGV4dDogJypQcmV2aW91cyBWZXJzaW9uOipcXG48aHR0cHM6Ly91cy13ZXN0LTIuY29uc29sZS5hd3MuYW1hem9uLmNvbS9ldmVudHMvaG9tZT9yZWdpb249dXMtd2VzdC0yIy9yZWdpc3RyaWVzL2Rpc2NvdmVyZWQtc2NoZW1hcy9zY2hlbWFzL215YXBwLnVzZXJzQFRoaXNJc0FOZXdFdmVudDEwL3ZlcnNpb24vMXx2ZXJzaW9uIDE+JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICB0ZXh0OiAnKk5ldyBWZXJzaW9uOipcXG48aHR0cHM6Ly91cy13ZXN0LTIuY29uc29sZS5hd3MuYW1hem9uLmNvbS9ldmVudHMvaG9tZT9yZWdpb249dXMtd2VzdC0yIy9yZWdpc3RyaWVzL2Rpc2NvdmVyZWQtc2NoZW1hcy9zY2hlbWFzL215YXBwLnVzZXJzQFRoaXNJc0FOZXdFdmVudDEwL3ZlcnNpb24vMnx2ZXJzaW9uIDI+JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdzZWN0aW9uJyxcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICAgIHRleHQ6ICcqRXZlbnQgU291cmNlOipcXG5teWFwcC51c2VycycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiAnbXJrZHduJyxcbiAgICAgICAgICAgICAgdGV4dDogJypDcmVhdGlvbiBEYXRlOipcXG4yMDIyLTExLTA0VDEzOjUyOjQ0WicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgdHlwZTogJ21ya2R3bicsXG4gICAgICAgICAgICB0ZXh0OiAnKkRpZmYgKHYxOnYyKSogYGBgYGBgJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2NvbnRleHQnLFxuICAgICAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6ICdtcmtkd24nLFxuICAgICAgICAgICAgICB0ZXh0OiAnX1doYXQgYW0gSSBzZWVpbmcgdGhpcz8gQSBuZXcgdmVyc2lvbiBvZiBhbiBldmVudCBoYXMgYmVlbiBjcmVhdGVkLiBZb3UgbWF5IGhhdmUgZG93bnN0cmVhbSBjb25zdW1lcnMgdGhhdCBtYXkgYnJlYWsgZHVlIHRvIGNvbnRyYWN0IGNoYW5nZXMuXycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnZGl2aWRlcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBcbn0pO1xuXG5leHBvcnQge307XG4iXX0=