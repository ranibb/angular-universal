# Angular Universal: server-side rendering

**Why Angular Universal?**
* Performance Benefits
* Social Media Crawlers
* Search Engine Optimization

https://angular.io/guide/universal

## NgUniversal Express Engine

This is an express engine that uses angular universal internally as the rendering engine.

To build the server application, use the auxiliary npm task:

```
npm run build:server-app:prod
```

To build the client production application, use the auxiliary npm task:

```
npm run build:client-app:prod
```

In order to run the server, use the auxiliary npm task:

```
npm run start:express-server
```

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

You can use the following command to open the site:

    firebase open hosting:site

**step 5:** Deploying our application as a firebase cloud function

    firebase init functions

Firebase cloud function is a small server-side function running on firebase servers that can perform some auxiliary tasks to our single page application. It's typically used for processing images or doing operations that can only be done one a backend such as processing payments.

**step 6:** Delete the index.html file from the dist/angular-universal folder. This way our redirect will redirect everything to the firebase cloud function including the root url of the application.

**step 7:** Do a firebase deploy again to make sure indeed the request to our application are being redirected to the firebase cloud function including the request for the root url of the application

    firebase deploy

