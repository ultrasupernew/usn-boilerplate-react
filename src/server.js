import { StaticRouter, matchPath } from 'react-router-dom';

import App from './App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import {Helmet} from 'react-helmet';
import routes from './routes';
import { ServerStyleSheet } from 'styled-components';


const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // This data fetching technique came from a gist by @ryanflorence
    // @see https://gist.github.com/ryanflorence/efbe562332d4f1cc9331202669763741

    // First we iterate through our top level routes
    // looking for matches against the current url.
    const matches = routes.map((route, index) => {
      const match = matchPath(req.url, route.path, route);
      // We then look for static getInitialData function on each top level component
      if (match) {
        const obj = {
          route,
          match,
          promise: route.component.getInitialData
            ? route.component.getInitialData({ match, req, res })
            : Promise.resolve(null),
        };
        return obj;
      }
      return null;
    });

    if (matches.length === 0) {
      res.status(404).send('Not Found');
    }

    // Now we pull out all the promises we found into an array.
    const promises = matches.map(match => (match ? match.promise : null));

    // We block rendering until all promises have resolved
    Promise.all(promises)
      .then(data => {
        const context = {};
        const sheet = new ServerStyleSheet();

        // Pass our routes and data array to our App component
        const markup = renderToString(
          sheet.collectStyles(
            <StaticRouter context={context} location={req.url}>
              <App routes={routes} initialData={data} />
            </StaticRouter>
          )
        );
        const helmet = Helmet.renderStatic();
        const styleTags = sheet.getStyleTags();

        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(context.statusCode || 200).send(
            `<!doctype html>
              <html lang="ja" ${helmet.htmlAttributes.toString()}>
                <head>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, height=device-height", initial-scale=1.0, maximum-scale=1.0, user-scalable=0, minimal-ui, viewport-fit=cover">
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <title>USN React Boilerplate</title>
                    <meta name="description"          content="" />
                    <meta property="og:type"          content="website" />
                    <meta property="og:title"         content="" />
                    <meta property="og:description"   content="" />
                    <meta name="twitter:card"         content="summary_large_image" />
                    <meta name="twitter:site"         content="" />
                    <meta name="twitter:creator"      content="" />
                    <meta name="twitter:description"  content="" />
                    <!-- React Helmet for Meta -->
                    ${helmet.title.toString()}
                    ${helmet.meta.toString()}
                    ${helmet.link.toString()}
                    <!-- Styles -->
                    ${ assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : '' }
                    ${styleTags}
                    <!-- Javascript -->
                    ${ process.env.NODE_ENV === 'production' ? `<script src="${assets.client.js}" defer></script>` : `<script src="${ assets.client.js }" defer crossorigin></script>`}
                </head>
                <body ${helmet.bodyAttributes.toString()}>
                    <div id="root">${markup}</div>
                    <script>window._INITIAL_DATA_ = ${JSON.stringify(data)};</script>
                </body>
            </html>`,
          );
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: error.message, stack: error.stack });
      });
  });

export default server;