import React from 'react';
import {
  GlobeAltIcon,
  ChatAltIcon,
  DocumentReportIcon,
  HeartIcon,
  CodeIcon,
  DocumentIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';

const features = [
  {
    name: 'Open Source',
    description: 'Designed and Developed for the community. Free for everybody to use.',
    icon: CodeIcon,
  },
  {
    name: 'Schemas',
    description: 'Use AWS events to help you manage your schemas. Let consumers get notified of incoming changes.',
    icon: DocumentIcon,
  },
  {
    name: 'Schema Diff',
    description:
      'Use the Slack plugin to get notifications directly into Slack! Schema diffs will be displayed for any changes made.',
    icon: ChartBarIcon,
  },
  {
    name: 'Deploy in seconds',
    description: 'Simple CDK pattern, deploy in your AWS account in seconds.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Plugins and API',
    description: 'Integrate with Slack, emails or APIs. Or contribute your own CDK plugin!',
    icon: DocumentReportIcon,
  },
  {
    name: 'Producers & Consumers',
    description: 'Producers do not know about consumers, but don\'t let the stop you getting notified!',
    icon: UserGroupIcon,
  },
  {
    name: 'Control Schemas',
    description: "Links directly back into your AWS console to see schemas in more detail.",
    icon: ChatAltIcon,
  },
  {
    name: 'Community',
    description: 'Join the community, learn from each other and help shape the project.',
    icon: HeartIcon,
  },
];

export default function Example() {
  return (
    <div className="bg-gradient-to-r from-gray-800  to-gray-700">
      <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
        <div>
          <p className="mt-2 text-3xl font-extrabold text-gray-200 wide">
            Notify <span className="text-pink-500">consumers</span> of schema changes.
          </p>
          <p className="mt-4 text-lg text-gray-300">Let your consumers stay on top of incoming changes to their contracts.</p>
        </div>
        <div className="mt-12 lg:mt-0 lg:col-span-2">
          <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-4 sm:grid-flow-col sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <feature.icon className="absolute text-gray-200 h-6 w-6" aria-hidden="true" />
                  {/* <CheckIcon className="absolute h-6 w-6 text-green-500" aria-hidden="true" /> */}
                  <p className="ml-9 text-lg leading-6 font-bold text-gray-200">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-9 text-base text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
