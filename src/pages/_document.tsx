import Document, { Html, Head, Main, NextScript } from 'next/document'

const MAINTAINANCE_MODE = process.env.MAINTAINANCE_MODE

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    if (MAINTAINANCE_MODE) {
      return <div>网站升级维护中，稍等一会...</div>
    }
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "4514c386de584b889d8b465387e46079"}'
          ></script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
