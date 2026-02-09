import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Catalyst</title>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            var es = new EventSource("/livereload");
            es.onerror = function() {
              es.close();
              setTimeout(function retry() {
                fetch("/livereload").then(function() {
                  location.reload();
                }).catch(function() {
                  setTimeout(retry, 200);
                });
              }, 200);
            };
          })();
        `,
          }}
        />
      </body>
    </html>
  );
}
