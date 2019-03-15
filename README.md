# Angular Universal: server-side rendering

**Why Angular Universal?**
* Performance Benefits
* Social Media Crawlers
* Search Engine Optimization

https://angular.io/guide/universal

## NgUniversal Express Engine

This is an express engine that uses angular universal internally as the rendering engine.

To build the server application, use the auxiliary npm task:

    npm run build:server-app:prod

To build the client production application, use the auxiliary npm task:

		npm run build:client-app:prod

In order to run the server, use the auxiliary npm task:

		npm run start:express-server

If we have pages on the application that we want to rank on search engines, then we also need to provide a title and a meta description. Most search engines will need a server side rendered title and meta description, but that is however not the case of the google search engine. With the google search engine, you can set the title of the meta description dynamically at run time using JavaScript and the correct tag will still be shown on the search results.

The meta tags of the particular case of twitter crawler, Facebook crawler and other social media platforms need to come from the server. These crawlers are in general not compatible with single page applications. This means, rendering these meta tags at the level of the server is the only way to make our website compatible with the crawlers of these social media platforms.

## Angular Universal Application Shell

Application shell is the the initial HTML that we want to send in the first request that we make to the server. To do thatn we need to speicify to the angular universal rendering engine, what parts of the page should be rendered by the server side engine and which part of the page should be left to the client side application for rendering.

## Angular Universal State Transfer API

As the application is being server-side rendered, you will notice that when the application bootstrap itself on the client side, it will also re-emit all the Ajax request to fetch the data of the application. This is something that we would like to avoid because when the application bootstrap itself on the client, there is no need to call the server again and fetch the same data.

The state transfer API is going to allow us to take the data that corresponds to a given component and attach it to the page itself. Thus, eliminating what is essentially a duplicate HTTP request.

In our case, we have managed to pass the course data containing the title and a thumbnail to the router and ultimately to the component without having to call again our backend server. What happened is that the data was retrieved from the state transfer service and the service retrieved the data directly from the content of the page.

## Angular Universal Production Deployment

We're going to be deploying our angular universal application as a firebase cloud function. We're going to be deploying the bundles using firebase hosting.

**step 1:** Install firebase tools:

    npm install -g firebase-tools

**step2:** Identify who is running the command line interface by doing a Firebase logging, this is going to promt you for your Google account email and password. After you fill those, your CLI will be authenticated.

    firebase login

**step 3:** Initialize our project in order to support firebase hosting. So, hosting is for serving static files.

    firebase init hosting

So, what we have configured so far, is the configuration necessary for deploying this application in single page mode without server-side rendering.

**step 4:** Do initial deployment even though we are not yet using server side rendering

    firebase deploy

note: You can use the following command to open the site:

    firebase open hosting:site

**step 5:** Deploying our application as a firebase cloud function

    firebase init functions

Firebase cloud function is a small server-side function running on firebase servers that can perform some auxiliary tasks to our single page application. It's typically used for processing images or doing operations that can only be done one a backend such as processing payments.

**step 6:** Head over firebase.json and instead of redirecting everything that doesn't match the content of the dist/angular-universal folder to index.html, we are going to instead redirect everything to a firebase cloud function.

```JSON
{
  "hosting": {
    "public": "dist/angular-universal",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "function": "ssrApp"
      }
    ]
  },
  "functions": {
    "predeploy": "npm --prefix \"$RESOURCE_DIR\" run build"
  }
}
```

**step 7:** Delete the index.html file from the dist/angular-universal folder. This way our redirect will redirect everything to the firebase cloud function including the root url of the application.

**step 8:** Do a firebase deploy again to make sure indeed the request to our application are being redirected to the firebase cloud function including the request for the root url of the application

    firebase deploy

How can we implement our firebase cloud function in order to do the server-side rendering of our application?

We are going to be doing something very similar to what we've implemented in our server.ts file which is an express server.

**step 9:** Run an express app in functions/src/index.ts and deploy it to firebase cloud function.

```TypeScript
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { join } from 'path';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), 'lib/');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require('../lib/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Server static files from /browser
app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  // Identify which url is currently being rendered. is this the (/course) or the root (/)
  res.render('index-server.html', {req});
});

export const ssrApp = functions.https.onRequest(app);

```

**step 10:** Build functions to compile our index.ts into index.js

    npm run build:functions

**step 11:** Edit the server configuration in angular.js to Output the server-side bundle into the `functions/lib` folder instead of the `dist/server` folder:

```JSON
},
"server": {
    "builder": "@angular-devkit/build-angular:server",
    "options": {
    "outputPath": "functions/lib",
    "main": "src/main.server.ts",
    "tsConfig": "src/tsconfig.server.json"
    }
},
```

**step 12:** Delete the `dist/server` folder as it will no longer be used or generated again.

**step 13:** Make sure that the index.html to be deployed to the `functions/lib` folder as part of the firebase function instead of the `dist/angular-universal`. So, what we need to do is essentially a move after the front-end build has finished. To demonstrate this, we will go through it step by step:

* back to the root, run the following command to populate/build the front-end into the `dist/angular-universal` folder:

    npm run build:client-app:prod

* build the server-side application

    npm run build:server-app:prod

* move `index.html` from `dist/angular-universal` to `functions/lib` and rename it to `index-server.html`:

    npm run move-index

**step 14:** Add dependencies from our main package.json to our firebase cloud functions package.json and npm install within the functions folder to update node_modules.

**step 15:** Use the npm task to build the whole application and deploy it

    npm run build-and-deploy:prod

