import { ReactElement } from 'react';

import type { AppProps } from 'next/app';

import 'bootstrap/dist/css/bootstrap.css';

import './App.css';

const App = ({ Component, pageProps }: AppProps): ReactElement => <Component {...pageProps} />;

export default App;
