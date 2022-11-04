import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '@heroicons/react/outline';

import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

const markdownExample = `import { SchemaWatcher } from 'cdk-schema-watcher';
import { SlackNotifier } from 'cdk-schema-watcher/plugins';

new SchemaWatcher(this, 'MyTeam', {
  type: 'All',
  sources: ['myapp.users', 'myapp.orders'],
  plugins: [
    new SlackNotifier({
      API_KEY: process.env.SLACK_API_KEY,
      CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
    }),
  ],
});`;

function Hero() {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-900  to-pink-900 ">
        <main className="py-6 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                    <span className="md:block">
                      Notify consumers of <span className="text-pink-500">EventBridge</span> schema changes.
                    </span>{' '}
                    {/* <span className="md:block">Documentation made Simple</span>{' '} */}
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Notify your downstream consumers of schema changes using 
                    <span className="text-pink-500 font-bold"> Slack</span>, <span className="text-pink-500 font-bold">emails</span> and{' '}
                    <span className="text-pink-500 font-bold">APIS</span>.
                  </p>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-sm">
                    Open source tool powered by TypeScript.
                  </p>
                  <div className="mt-5 sm:flex  md:mt-8 justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <a
                        href="/docs/introduction"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 md:py-3 md:text-lg md:px-10"
                      >
                        Get Started &rarr;
                      </a>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <a
                        href="https://github.com/boyney123/cdk-schema-watcher/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 md:py-3 md:text-lg md:px-10"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:-mt-0 lg:col-span-6 text-white">
                <div className="mt-8 mx-2">
                  <section className="px-4">
                    <div className=" sm:block">
                      <div className="flex items-center h-8 space-x-1.5 px-3 bg-gray-800">
                        <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
                        <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
                        <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />
                      </div>
                      <pre className="important-overflow-hidden w-full text-sm h-full rounded-lg rounded-t-none shadow-lg bg-gray-900">
                        <code className="language-js">{markdownExample}</code>
                      </pre>
                    </div>
                    {/* <div className="sm:hidden lg:block -top-40 h-64 lg:h-20 relative md:top-0 md:-mt-64 lg:-right-20 lg:relative md:px-6  ">
                      <div className="bg-white shadow-lg rounded-lg">
                        <img alt="Event Catalog Example" src="/img/slack-example1.png" />
                      </div>
                    </div> */}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <section className="text-center py-12 px-4 md:py-24 lg:py-48 lg:pb-32 max-w-5xl mx-auto">
        <h2 className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl dark:text-white">
          Schemas are important.
        </h2>
        <figure className="mx-0">
          <blockquote className="border-none">
            <p className="mt-6 max-w-3xl mx-auto text-lg">

              Over time our Event Driven Architectures (EDA) grow and it can become difficult to understand the impact of changes to downstream consumers.
              Producers can easily change their event schemas without consumers being aware. SchemaWatcher was built to help you setup notifications for your downstream consumers when using EventBridge.
              Never let a breaking schema scare you again!
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center space-x-4 text-left">
            <img
              src="https://pbs.twimg.com/profile_images/1262283153563140096/DYRDqKg6_400x400.png"
              alt=""
              className="w-14 h-14 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="text-slate-900 font-semibold dark:text-white">David Boyne</div>
              <div className="mt-0.5 text-sm leading-6">Dude with thoughts about schemas</div>
            </div>
          </figcaption>
        </figure>
      </section>
      {/* <div className="bg-gradient-to-r from-gray-800  to-gray-700">
        <section className="text-gray-300 body-font max-w-7xl mx-auto ">
          <div className="lg:container px-5 py-12 md:py-24 mx-auto">
            <div className="flex flex-wrap -m-4">
              <div className="md:w-1/2 lg:mb-0 mb-6 p-4 ">
                <div className="h-full text-center ">
                  <img
                    alt="testimonial"
                    className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"
                    src="https://randomuser.me/api/portraits/men/96.jpg"
                  />
                  <p className="leading-relaxed px-10 md:px-20">
                    SchemaWatcher is the best CDK construct we have ever seen. It allows consumers to listen to changes in scheams directly from AWS. Not sure where we would be without this!
                  </p>
                  <span className="inline-block h-1 w-10 rounded bg-green-500 mt-6 mb-4" />
                  <h2 className="text-gray-400 font-medium title-font tracking-wider text-sm">Fake Person</h2>
                </div>
              </div>
              <div className="md:w-1/2 lg:mb-0 mb-6 p-4">
                <div className="h-full text-center">
                  <img
                    alt="testimonial"
                    className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"
                    src="https://pbs.twimg.com/profile_images/663759011205029889/zIraFLcq_400x400.jpg"
                  />
                  <p className="leading-relaxed px-10 md:px-20">
                    EventCatalog does a tremendous job in bringing transparency to our landscape. With it&apos;s visualisation
                    features it&apos;s easy to identify stakeholders for event changes.
                  </p>
                  <span className="inline-block h-1 w-10 rounded bg-green-500 mt-6 mb-4" />
                  <h2 className="text-gray-400 font-medium title-font tracking-wider text-sm">Benjamin Otto</h2>
                </div>
              </div>
            
            </div>
          </div>
        </section>
      </div> */}
      {/* <div className="relative bg-white pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <h4 className="text-gray-400 mb-2 uppercase">Document your Events, Services and Domains</h4>
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Powered by Markdown</h2>
                <p className="mt-4 text-lg text-gray-500">
                  <p>Document your events and upstream/downstream services with Markdown and our custom components.</p>

                  <p>Render: Code Examples, Node Graphs, Event Schemas, Event Versions, Event Owners and much more...</p>

                  <p>
                    You can also generate documentation from any third party system using{' '}
                    <a className="text-green-600 underline" href="/docs/api/plugins">
                      our plugin architecture
                    </a>
                    .
                  </p>
                </p>
                <div className="mt-6">
                  <a
                    href="/docs/introduction"
                    className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Get Started &rarr;
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="/img/AddedItemToCartExample2.png"
                  alt="Inbox user interface"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
              <h4 className="text-gray-400 mb-2 uppercase">The Visualiser</h4>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Visualise your Architecture</h2>
              <p className="mt-4 text-lg text-gray-500">
                Visualise your Event Driven Architecture using the visualiser or 3D graphs.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                EventCatalog allows you to see exactly what’s happening in your architecture without needing to know the code or
                how it works.
              </p>
              <div className="mt-6">
                <a
                  href="https://app.eventcatalog.dev/visualiser/"
                  className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Try the Visualiser &rarr;
                </a>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
              <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="/img/NodeGraph.png"
                  alt="Customer profile user interface"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>

    // <div className="bg-white">
    //   <div className="relative overflow-hidden">
    //     <div className="relative sm:pb-12">
    //       <div className="mt-12 md:mt-16 mx-auto max-w-7xl px-4 sm:px-6">
    //         <div className="text-center">
    //           <div className="flex items-center text-xl justify-center space-x-4 -ml-4">
    //             <img src="/img/logo.svg" className="hidden md:block" alt="Logo" style={{ height: '85px' }} />
    //             <h1 className="text-4xl md:text-7xl font-bold">EventCatalog</h1>
    //           </div>
    //           <p className="max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
    //             Discover, Explore and Document your Event Driven Architectures.
    //           </p>
    //           <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
    //             <div className="rounded-md shadow">
    //               <a
    //                 href="/docs/installation"
    //                 className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 md:py-3 md:text-lg md:px-10"
    //               >
    //                 Get started
    //               </a>
    //             </div>
    //             <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
    //               <a
    //                 href="https://app.eventcatalog.dev/"
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 md:py-3 md:text-lg md:px-10"
    //               >
    //                 Live demo
    //               </a>
    //             </div>
    //           </div>
    //           <div className="mt-10 space-x-6">
    //             <span>License: MIT</span>
    //             <a className="text-gray-800 underline" href="https://github.com/boyney123/eventcatalog">
    //               GitHub
    //             </a>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="relative mt-4 md:mt-0">
    //       <div className="absolute inset-0 flex flex-col" aria-hidden="true">
    //         <div className="flex-1" />
    //         <div className="flex-1 w-full bg-gray-800" />
    //       </div>
    //       <div className="max-w-7xl mx-auto px-4 sm:px-6">
    //         <img className="relative rounded-lg shadow-xl" alt="EventCatalog Screenshot" src="/img/eventcatalog-screen1.png" />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="bg-gray-800 hidden md:block">
    //     <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8" />
    //   </div>
    // </div>
  );
}

export default Hero;
