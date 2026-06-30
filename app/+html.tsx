import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

const basePath = process.env.EXPO_BASE_URL
  ? `/${String(process.env.EXPO_BASE_URL).replace(/^\/+|\/+$/g, '')}`
  : '';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/*
          GitHub Pages cannot set COOP/COEP headers. coi-serviceworker enables
          SharedArrayBuffer for expo-sqlite on web via a service worker.
        */}
        <script src={`${basePath}/coi-serviceworker.js`} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
* {
  box-sizing: border-box;
}
html,
body,
#root {
  width: 100%;
  height: 100%;
  height: 100dvh;
  height: -webkit-fill-available;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
body {
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}
#root {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}`;
