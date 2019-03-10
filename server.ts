import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { readFileSync } from 'fs';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

enableProdMode();

const app = express();

const indexHtml = readFileSync(__dirname + '/dist/angular-universial/index.html', 'utf-8').toString();

app.route('/').get((req, res) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: '/',
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => res.status(200).send(html))
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.listen(9000, () => {
  console.log('Angular Universal Node Express server listening on http://localhost:9000');
});
