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