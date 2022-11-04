"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lib_1 = require("../../../lib");
const plugin_1 = require("../../../plugins/slack/plugin");
describe('Slack plugin', () => {
    it('plugin creates a Lambda function to process schemas', () => {
        const stack = new aws_cdk_lib_1.Stack();
        new lib_1.SchemaWatcher(stack, 'MyTestTeam', {
            schemas: ['myapp.users@Test'],
            type: 'All',
            plugins: [
                new plugin_1.SlackNotifier({
                    API_KEY: 'test',
                    CHANNEL_ID: 'test',
                }),
            ],
        });
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Lambda::Function', {
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
        }));
    });
    it('attaches the processing Lambda function to the generated rule by SchemaWatcher', () => {
        const stack = new aws_cdk_lib_1.Stack();
        new lib_1.SchemaWatcher(stack, 'MyTestTeam', {
            schemas: ['myapp.users@Test'],
            type: 'All',
            plugins: [
                new plugin_1.SlackNotifier({
                    API_KEY: 'test',
                    CHANNEL_ID: 'test',
                }),
            ],
        });
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Events::Rule', {
            EventBusName: 'default',
            EventPattern: {
                detail: {
                    SchemaName: ['myapp.users@Test'],
                },
                'detail-type': ['Schema Created', 'Schema Version Created'],
                source: ['aws.schemas'],
            },
            Targets: assert_1.arrayWith(assert_1.objectLike({
                Arn: {
                    'Fn::GetAtt': ['MyTestTeamPluginslackNotificationD0D29E5F', 'Arn'],
                }
            })),
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNsYWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBK0Y7QUFDL0YsNkNBQW9DO0FBQ3BDLHNDQUE2QztBQUM3QywwREFBOEQ7QUFFOUQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLG1CQUFhLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNyQyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM3QixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRTtnQkFDUCxJQUFJLHNCQUFhLENBQUM7b0JBQ2hCLE9BQU8sRUFBRSxNQUFNO29CQUNmLFVBQVUsRUFBRSxNQUFNO2lCQUNuQixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUNqQix5QkFBZ0IsQ0FBQyx1QkFBdUIsRUFBRTtZQUN4QyxPQUFPLEVBQUUsZUFBZTtZQUN4QixVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsWUFBWTtZQUNyQixPQUFPLEVBQUUsQ0FBQztZQUNWLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUU7b0JBQ1QsYUFBYSxFQUFFLE1BQU07b0JBQ3JCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixtQ0FBbUMsRUFBRSxHQUFHO2lCQUN6QzthQUNGO1NBQ0YsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7UUFDeEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7UUFFMUIsSUFBSSxtQkFBYSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7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O0lBQ1gsc0JBQXNCO0lBQ3RCLFVBQVU7SUFFViwyQkFBMkI7SUFDM0IsZ0RBQWdEO0lBQ2hELHlDQUF5QztJQUN6QywwQkFBMEI7SUFDMUIscUNBQXFDO0lBQ3JDLGFBQWE7SUFDYixXQUFXO0lBQ1gsU0FBUztJQUNULFFBQVE7QUFDVixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIGhhdmVSZXNvdXJjZUxpa2UsIGFycmF5V2l0aCwgb2JqZWN0TGlrZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IFNjaGVtYVdhdGNoZXIgfSBmcm9tICcuLi8uLi8uLi9saWInO1xuaW1wb3J0IHsgU2xhY2tOb3RpZmllciB9IGZyb20gJy4uLy4uLy4uL3BsdWdpbnMvc2xhY2svcGx1Z2luJztcblxuZGVzY3JpYmUoJ1NsYWNrIHBsdWdpbicsICgpID0+IHtcbiAgaXQoJ3BsdWdpbiBjcmVhdGVzIGEgTGFtYmRhIGZ1bmN0aW9uIHRvIHByb2Nlc3Mgc2NoZW1hcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFNjaGVtYVdhdGNoZXIoc3RhY2ssICdNeVRlc3RUZWFtJywge1xuICAgICAgc2NoZW1hczogWydteWFwcC51c2Vyc0BUZXN0J10sXG4gICAgICB0eXBlOiAnQWxsJyxcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbmV3IFNsYWNrTm90aWZpZXIoe1xuICAgICAgICAgIEFQSV9LRVk6ICd0ZXN0JyxcbiAgICAgICAgICBDSEFOTkVMX0lEOiAndGVzdCcsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgICBoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgUnVudGltZTogJ25vZGVqczE2LngnLFxuICAgICAgICBUaW1lb3V0OiA1LFxuICAgICAgICBFbnZpcm9ubWVudDoge1xuICAgICAgICAgIFZhcmlhYmxlczoge1xuICAgICAgICAgICAgU0xBQ0tfQVBJX0tFWTogJ3Rlc3QnLFxuICAgICAgICAgICAgQ0hBTk5FTF9JRDogJ3Rlc3QnLFxuICAgICAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICApO1xuICB9KTtcblxuICBpdCgnYXR0YWNoZXMgdGhlIHByb2Nlc3NpbmcgTGFtYmRhIGZ1bmN0aW9uIHRvIHRoZSBnZW5lcmF0ZWQgcnVsZSBieSBTY2hlbWFXYXRjaGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgU2NoZW1hV2F0Y2hlcihzdGFjaywgJ015VGVzdFRlYW0nLCB7XG4gICAgICBzY2hlbWFzOiBbJ215YXBwLnVzZXJzQFRlc3QnXSxcbiAgICAgIHR5cGU6ICdBbGwnLFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBuZXcgU2xhY2tOb3RpZmllcih7XG4gICAgICAgICAgQVBJX0tFWTogJ3Rlc3QnLFxuICAgICAgICAgIENIQU5ORUxfSUQ6ICd0ZXN0JyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICAgIGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBFdmVudEJ1c05hbWU6ICdkZWZhdWx0JyxcbiAgICAgICAgRXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICBTY2hlbWFOYW1lOiBbJ215YXBwLnVzZXJzQFRlc3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdkZXRhaWwtdHlwZSc6IFsnU2NoZW1hIENyZWF0ZWQnLCAnU2NoZW1hIFZlcnNpb24gQ3JlYXRlZCddLFxuICAgICAgICAgIHNvdXJjZTogWydhd3Muc2NoZW1hcyddLFxuICAgICAgICB9LFxuICAgICAgICBUYXJnZXRzOiBhcnJheVdpdGgoXG4gICAgICAgICAgb2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015VGVzdFRlYW1QbHVnaW5zbGFja05vdGlmaWNhdGlvbkQwRDI5RTVGJywgJ0FybiddLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICB9KVxuICAgICk7XG4gIH0pO1xuXG4gIC8vICAgaXQoJ2NyZWF0ZXMgYW4gQVBJIEdhdGV3YXkgV0VCU09DS0VUIHdpdGggb25jb25uZWN0IGFuZCBvbmRpc2Nvbm5lY3QgaW50ZWdyYXRpb25zJywgKCkgPT4ge1xuICAvLyAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyAgICAgbmV3IEV2ZW50QnJpZGdlV2ViU29ja2V0KHN0YWNrLCAnZXZlbnRCcmlkZ2VTb2NrZXREZXBsb3knLCB7XG4gIC8vICAgICAgIGJ1czogJ215LXJhbmRvbS1idXMnLFxuICAvLyAgICAgICBldmVudFBhdHRlcm46IHtcbiAgLy8gICAgICAgICBhY2NvdW50OiBbJ215LWFjY291bnQnXSxcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgICAgc3RhZ2U6ICdkZXYnLFxuICAvLyAgICAgfSk7XG4gIC8vICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gIC8vICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShTeW50aFV0aWxzLnRvQ2xvdWRGb3JtYXRpb24oc3RhY2spLCBudWxsLCA0KSk7XG4gIC8vICAgICBleHBlY3RDREsoc3RhY2spLnRvKFxuICAvLyAgICAgICBoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkFwaUdhdGV3YXlWMjo6QXBpJywge1xuICAvLyAgICAgICAgIE5hbWU6ICdFdmVudEJyaWRnZVNvY2tldHMnLFxuICAvLyAgICAgICAgIFByb3RvY29sVHlwZTogJ1dFQlNPQ0tFVCcsXG4gIC8vICAgICAgICAgUm91dGVTZWxlY3Rpb25FeHByZXNzaW9uOiAnJHJlcXVlc3QuYm9keS5hY3Rpb24nLFxuICAvLyAgICAgICB9KVxuICAvLyAgICAgKTtcblxuICAvLyAgICAgLy8gb24gY29ubmVjdCBpbnRlZ3JhdGlvblxuICAvLyAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXlWMjo6SW50ZWdyYXRpb24nLCB7XG4gIC8vICAgICAgIEludGVncmF0aW9uVHlwZTogJ0FXU19QUk9YWScsXG4gIC8vICAgICAgIEludGVncmF0aW9uVXJpOiB7XG4gIC8vICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAvLyAgICAgICAgICAgJycsXG4gIC8vICAgICAgICAgICBbXG4gIC8vICAgICAgICAgICAgICdhcm46JyxcbiAgLy8gICAgICAgICAgICAge1xuICAvLyAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgLy8gICAgICAgICAgICAgfSxcbiAgLy8gICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gIC8vICAgICAgICAgICAgIHtcbiAgLy8gICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gIC8vICAgICAgICAgICAgIH0sXG4gIC8vICAgICAgICAgICAgICc6bGFtYmRhOnBhdGgvMjAxNS0wMy0zMS9mdW5jdGlvbnMvJyxcbiAgLy8gICAgICAgICAgICAge1xuICAvLyAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydldmVudEJyaWRnZVNvY2tldERlcGxveW9uY29ubmVjdEFFMEFDRDE3JywgJ0FybiddLFxuICAvLyAgICAgICAgICAgICB9LFxuICAvLyAgICAgICAgICAgICAnL2ludm9jYXRpb25zJyxcbiAgLy8gICAgICAgICAgIF0sXG4gIC8vICAgICAgICAgXSxcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXlWMjo6Um91dGUnLCB7XG4gIC8vICAgICAgIFJvdXRlS2V5OiAnJGNvbm5lY3QnLFxuICAvLyAgICAgICBUYXJnZXQ6IHtcbiAgLy8gICAgICAgICAnRm46OkpvaW4nOiBbXG4gIC8vICAgICAgICAgICAnJyxcbiAgLy8gICAgICAgICAgIFtcbiAgLy8gICAgICAgICAgICAgJ2ludGVncmF0aW9ucy8nLFxuICAvLyAgICAgICAgICAgICB7XG4gIC8vICAgICAgICAgICAgICAgUmVmOiAnZXZlbnRCcmlkZ2VTb2NrZXREZXBsb3lldmVudEJyaWRnZVNvY2tldERlcGxveWFwaWNvbm5lY3RSb3V0ZUNvbm5lY3RJbnRlZ3JhdGlvbjQzOUYwNDJBJyxcbiAgLy8gICAgICAgICAgICAgfSxcbiAgLy8gICAgICAgICAgIF0sXG4gIC8vICAgICAgICAgXSxcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgIH0pO1xuXG4gIC8vICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheVYyOjpJbnRlZ3JhdGlvbicsIHtcbiAgLy8gICAgICAgSW50ZWdyYXRpb25UeXBlOiAnQVdTX1BST1hZJyxcbiAgLy8gICAgICAgSW50ZWdyYXRpb25Vcmk6IHtcbiAgLy8gICAgICAgICAnRm46OkpvaW4nOiBbXG4gIC8vICAgICAgICAgICAnJyxcbiAgLy8gICAgICAgICAgIFtcbiAgLy8gICAgICAgICAgICAgJ2FybjonLFxuICAvLyAgICAgICAgICAgICB7XG4gIC8vICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAvLyAgICAgICAgICAgICB9LFxuICAvLyAgICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgLy8gICAgICAgICAgICAge1xuICAvLyAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgLy8gICAgICAgICAgICAgfSxcbiAgLy8gICAgICAgICAgICAgJzpsYW1iZGE6cGF0aC8yMDE1LTAzLTMxL2Z1bmN0aW9ucy8nLFxuICAvLyAgICAgICAgICAgICB7XG4gIC8vICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2V2ZW50QnJpZGdlU29ja2V0RGVwbG95b25kaXNjb25uZWN0MEY2MUExNjEnLCAnQXJuJ10sXG4gIC8vICAgICAgICAgICAgIH0sXG4gIC8vICAgICAgICAgICAgICcvaW52b2NhdGlvbnMnLFxuICAvLyAgICAgICAgICAgXSxcbiAgLy8gICAgICAgICBdLFxuICAvLyAgICAgICB9LFxuICAvLyAgICAgfSk7XG5cbiAgLy8gICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5VjI6OlJvdXRlJywge1xuICAvLyAgICAgICBSb3V0ZUtleTogJyRkaXNjb25uZWN0JyxcbiAgLy8gICAgICAgVGFyZ2V0OiB7XG4gIC8vICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAvLyAgICAgICAgICAgJycsXG4gIC8vICAgICAgICAgICBbXG4gIC8vICAgICAgICAgICAgICdpbnRlZ3JhdGlvbnMvJyxcbiAgLy8gICAgICAgICAgICAge1xuICAvLyAgICAgICAgICAgICAgIFJlZjogJ2V2ZW50QnJpZGdlU29ja2V0RGVwbG95ZXZlbnRCcmlkZ2VTb2NrZXREZXBsb3lhcGlkaXNjb25uZWN0Um91dGVEaXNjb25uZWN0SW50ZWdyYXRpb25CQTkzMDI0QycsXG4gIC8vICAgICAgICAgICAgIH0sXG4gIC8vICAgICAgICAgICBdLFxuICAvLyAgICAgICAgIF0sXG4gIC8vICAgICAgIH0sXG4gIC8vICAgICB9KTtcbiAgLy8gICB9KTtcblxuICAvLyAgIGl0KCdjcmVhdGVzIGEgbmV3IEV2ZW50QnJpZGdlIHJ1bGUgZm9yIGdpdmVuIGV2ZW50IGJ1cyBhbmQgZ2l2ZW4gZXZlbnQgcGF0dGVybicsICgpID0+IHtcbiAgLy8gICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIC8vICAgICBuZXcgRXZlbnRCcmlkZ2VXZWJTb2NrZXQoc3RhY2ssICdldmVudEJyaWRnZVNvY2tldERlcGxveScsIHtcbiAgLy8gICAgICAgYnVzOiAnbXktcmFuZG9tLWJ1cycsXG4gIC8vICAgICAgIGV2ZW50UGF0dGVybjoge1xuICAvLyAgICAgICAgIGFjY291bnQ6IFsnbXktYWNjb3VudCddLFxuICAvLyAgICAgICB9LFxuICAvLyAgICAgICBzdGFnZTogJ2RldicsXG4gIC8vICAgICB9KTtcblxuICAvLyAgICAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgLy8gICAgICAgaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gIC8vICAgICAgICAgRXZlbnRCdXNOYW1lOiAnbXktcmFuZG9tLWJ1cycsXG4gIC8vICAgICAgICAgRXZlbnRQYXR0ZXJuOiB7XG4gIC8vICAgICAgICAgICBhY2NvdW50OiBbJ215LWFjY291bnQnXSxcbiAgLy8gICAgICAgICB9LFxuICAvLyAgICAgICB9KVxuICAvLyAgICAgKTtcbiAgLy8gICB9KTtcbn0pO1xuIl19