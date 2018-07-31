import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';

// Styled-components
import { ServerStyleSheet } from 'styled-components';

// React Helmet
import {Helmet} from 'react-helmet';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const sheet = new ServerStyleSheet();
    const markup = renderToString(
      sheet.collectStyles(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
      )
    );

    // Styles
    const styleTags = sheet.getStyleTags();
    // Meta
    const helmet = Helmet.renderStatic();
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="en" ${helmet.htmlAttributes.toString()}>
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta charset="utf-8" />
                <title>Welcome to Razzle</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <!-- Social Meta -->
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                <!-- Styles -->
                ${ assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : '' }
                ${styleTags}
                <!-- JS -->
                ${ process.env.NODE_ENV === 'production' ? `<script src="${assets.client.js}" defer></script>` : `<script src="${assets.client.js}" defer crossorigin></script>` }
            </head>
            <body>
                <div id="root">${markup}</div>
            </body>
          </html>`
      );
    }
  });

export default server;
