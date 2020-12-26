import '../css/tailwind.css'
import '../css/main.css'
import '../css/prose.css'
import { useUrqlClient } from '@src/lib/urql-client'
import { Provider as UrqlProvider } from 'urql'

function MyApp({ Component, pageProps }: any) {
  const urqlClient = useUrqlClient()
  return (
    <UrqlProvider value={urqlClient}>
      <Component {...pageProps} />
    </UrqlProvider>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
