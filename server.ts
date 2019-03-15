import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { readFileSync } from 'fs';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

enableProdMode();

const app = express();

const indexHtml = readFileSync(__dirname + '/dist/angular-universal/index.html', 'utf-8').toString();

const distFolder = __dirname + '/dist/angular-universal';

// define the engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [provideModuleMap(LAZY_MODULE_MAP)]
}));

// use the engine to render HTML responses
app.set('view engine', 'html');
app.set('views', distFolder);

// Mapping between incoming HTTP request and the engine itself (*.js, *.css, etc)
app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// The universal rendering itself.
app.get('*', (req, res) => {
  // Identify which url is currently being rendered. is this the (/course) or the root (/)
  res.render('index', {req});
});

app.listen(9000, () => {
  console.log('Angular Universal Node Express server listening on http://localhost:9000');
});
