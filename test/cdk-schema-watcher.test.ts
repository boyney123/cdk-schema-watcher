import { SynthUtils, expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import { Stack } from 'aws-cdk-lib';
import { SchemaWatcher } from '../lib';
import { SlackNotifier } from '../plugins/slack/plugin';

describe('SchemaWatcher', () => {
  it('snapshot test SchemaWatcher default params', () => {
    const stack = new Stack();
    new SchemaWatcher(stack, 'MyTestTeam', {
      schemas: ['myapp.users@Test'],
      type: 'All',
      plugins: [
        new SlackNotifier({
          API_KEY: 'test',
          CHANNEL_ID: 'test',
        }),
      ],
    });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });

  it('cdk-schema-watcher creates a default log group for all configured events', () => {
    const stack = new Stack();

    new SchemaWatcher(stack, 'MyTestTeam', {
      schemas: ['myapp.users@Test'],
      type: 'All',
      plugins: [
        new SlackNotifier({
          API_KEY: 'test',
          CHANNEL_ID: 'test',
        }),
      ],
    });

    expectCDK(stack).to(
      haveResourceLike('AWS::Logs::LogGroup', {
        LogGroupName: '/aws/events/schema-listeners/MyTestTeam/schema-notification-logs',
        RetentionInDays: 731,
      })
    );
  });

  it('cdk-schema-watcher creates a rule onto the default EventBridge event bus to listen for user configured schemas', () => {
    const stack = new Stack();

    new SchemaWatcher(stack, 'MyTestTeam', {
      schemas: ['myapp.users@Test'],
      type: 'All',
      plugins: [
        new SlackNotifier({
          API_KEY: 'test',
          CHANNEL_ID: 'test',
        }),
      ],
    });

    expectCDK(stack).to(
      haveResourceLike('AWS::Events::Rule', {
        EventBusName: 'default',
        EventPattern: {
          detail: {
            SchemaName: ['myapp.users@Test'],
          },
          'detail-type': ['Schema Created', 'Schema Version Created'],
          source: ['aws.schemas'],
        },
        Name: 'MyTestTeam-listen-to-schema-changes',
        State: 'ENABLED',
      })
    );
  });
  
});
