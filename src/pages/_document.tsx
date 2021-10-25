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
          {process.env.NODE_ENV === 'production' && (
            <script
              async
              defer
              data-website-id="8d61da99-f2f9-4820-ab55-3d674db3f1fc"
              src="https://umami.egoist.sh/umami.js"
            ></script>
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument
