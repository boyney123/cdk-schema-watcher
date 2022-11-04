import { expect as expectCDK, haveResourceLike, arrayWith, objectLike } from '@aws-cdk/assert';
import { Stack } from 'aws-cdk-lib';
import { SchemaWatcher } from '../../../lib';
import { SlackNotifier } from '../../../plugins/slack/plugin';

describe('Slack plugin', () => {
  it('plugin creates a Lambda function to process schemas', () => {
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
      haveResourceLike('AWS::Lambda::Function', {
        Handler: 'index.handler',
        MemorySize: 1024,
        Runtime: 'nodejs16.x',
        Timeout: 5,
        Environment: {
          Variables: {
            SLACK_API_KEY: 'test',
            CHANNEL_ID: 'test',
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
          },
        },
      })
    );
  });

  it('attaches the processing Lambda function to the generated rule by SchemaWatcher', () => {
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
        Targets: arrayWith(
          objectLike({
            Arn: {
              'Fn::GetAtt': ['MyTestTeamPluginslackNotificationD0D29E5F', 'Arn'],
            }
          })
        ),
      })
    );
  });

  //   it('creates an API Gateway WEBSOCKET with onconnect and ondisconnect integrations', () => {
  //     const stack = new Stack();

  //     new EventBridgeWebSocket(stack, 'eventBridgeSocketDeploy', {
  //       bus: 'my-random-bus',
  //       eventPattern: {
  //         account: ['my-account'],
  //       },
  //       stage: 'dev',
  //     });
  //     const template = Template.fromStack(stack);
  //     // console.log(JSON.stringify(SynthUtils.toCloudFormation(stack), null, 4));
  //     expectCDK(stack).to(
  //       haveResourceLike('AWS::ApiGatewayV2::Api', {
  //         Name: 'EventBridgeSockets',
  //         ProtocolType: 'WEBSOCKET',
  //         RouteSelectionExpression: '$request.body.action',
  //       })
  //     );

  //     // on connect integration
  //     template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
  //       IntegrationType: 'AWS_PROXY',
  //       IntegrationUri: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'arn:',
  //             {
  //               Ref: 'AWS::Partition',
  //             },
  //             ':apigateway:',
  //             {
  //               Ref: 'AWS::Region',
  //             },
  //             ':lambda:path/2015-03-31/functions/',
  //             {
  //               'Fn::GetAtt': ['eventBridgeSocketDeployonconnectAE0ACD17', 'Arn'],
  //             },
  //             '/invocations',
  //           ],
  //         ],
  //       },
  //     });
  //     template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
  //       RouteKey: '$connect',
  //       Target: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'integrations/',
  //             {
  //               Ref: 'eventBridgeSocketDeployeventBridgeSocketDeployapiconnectRouteConnectIntegration439F042A',
  //             },
  //           ],
  //         ],
  //       },
  //     });

  //     template.hasResourceProperties('AWS::ApiGatewayV2::Integration', {
  //       IntegrationType: 'AWS_PROXY',
  //       IntegrationUri: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'arn:',
  //             {
  //               Ref: 'AWS::Partition',
  //             },
  //             ':apigateway:',
  //             {
  //               Ref: 'AWS::Region',
  //             },
  //             ':lambda:path/2015-03-31/functions/',
  //             {
  //               'Fn::GetAtt': ['eventBridgeSocketDeployondisconnect0F61A161', 'Arn'],
  //             },
  //             '/invocations',
  //           ],
  //         ],
  //       },
  //     });

  //     template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
  //       RouteKey: '$disconnect',
  //       Target: {
  //         'Fn::Join': [
  //           '',
  //           [
  //             'integrations/',
  //             {
  //               Ref: 'eventBridgeSocketDeployeventBridgeSocketDeployapidisconnectRouteDisconnectIntegrationBA93024C',
  //             },
  //           ],
  //         ],
  //       },
  //     });
  //   });

  //   it('creates a new EventBridge rule for given event bus and given event pattern', () => {
  //     const stack = new Stack();
  //     new EventBridgeWebSocket(stack, 'eventBridgeSocketDeploy', {
  //       bus: 'my-random-bus',
  //       eventPattern: {
  //         account: ['my-account'],
  //       },
  //       stage: 'dev',
  //     });

  //     expectCDK(stack).to(
  //       haveResourceLike('AWS::Events::Rule', {
  //         EventBusName: 'my-random-bus',
  //         EventPattern: {
  //           account: ['my-account'],
  //         },
  //       })
  //     );
  //   });
});
