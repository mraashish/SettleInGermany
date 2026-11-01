import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Static web document. SDK 58 streams HTML: head/body nodes (route metadata from
 * `generateMetadata`, CSS, JS chunks, fonts) come from the server document context.
 * Light-only for now (web dark mode not designed — HANDOFF §3).
 */
export default function Root({ children }: PropsWithChildren) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } = useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#0F5C63" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'body{background:#F6F4F0;} :focus-visible{outline:3px solid #0F5C63;outline-offset:2px;} @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}' }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
