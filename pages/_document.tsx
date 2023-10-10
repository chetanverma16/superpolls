import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          defer
          src="https://analytics.eu.umami.is/script.js"
          data-website-id="9b1eed9f-09b2-4040-b965-113f032bf1c9"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
