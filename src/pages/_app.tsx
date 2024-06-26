import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import type { AppProps } from 'next/app';

import config from '@/amplify_outputs.json';

// configure the Amplify client library with the configuration generated by `amplify sandbox`
Amplify.configure(config);

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App);
