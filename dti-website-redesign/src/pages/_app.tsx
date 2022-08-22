import { ReactElement } from 'react';

import type { AppProps } from 'next/app';

import './App.css';

const App = ({ Component, pageProps }: AppProps): ReactElement => <Component {...pageProps} />;

export default App;
