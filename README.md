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