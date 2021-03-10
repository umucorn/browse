import { useEffect } from 'react';
import App from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../theme';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
