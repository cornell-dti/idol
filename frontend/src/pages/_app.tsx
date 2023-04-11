import { ReactNode } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import UserProvider from '../components/Common/UserProvider/UserProvider';
import FirestoreDataProvider from '../components/Common/FirestoreDataProvider';
import { Emitters } from '../utils';
import ErrorModal from '../components/Modals/ErrorModal';
import SuccessModal from '../components/Modals/SuccessModal';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import SITE_THEME from '../theme';
import { Layout } from '../components/Common/Layout';
import { Layout as Layout2 } from '../components/Common/Layout2';

const NEW_STYLE = false;

export default function AppTemplate(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/dti-logo.png" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="description" content="Cornell DTI's Internal DTI Organization Logic (IDOL)" />
        <link rel="apple-touch-icon" href="/dti-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Cornell DTI IDOL</title>
      </Head>
      <UserProvider>
        <FirestoreDataProvider>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={SITE_THEME}>
            {NEW_STYLE ? (
              <AppContent>
                <Component {...pageProps} />
              </AppContent>
            ) : (
              <AppContent2>
                <Component {...pageProps} />
              </AppContent2>
            )}
          </MantineProvider>
        </FirestoreDataProvider>
      </UserProvider>
    </>
  );
}

function AppContent({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <div>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      <SuccessModal onEmitter={Emitters.generalSuccess}></SuccessModal>
      <Layout>{children}</Layout>
    </div>
  );
}
export function AppContent2({ children }: { readonly children: ReactNode }): JSX.Element {
  return <Layout2>{children}</Layout2>;
}
