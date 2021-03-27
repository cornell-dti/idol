import { ReactElement } from 'react';

import { AppProps } from 'next/app';
import Head from 'next/head';

import '../scss/index.scss';
import '../components/CircleProgressIndicator.scss';
import '../components/DtiFooter.scss';
import '../components/DtiMainMenu.scss';
import '../components/HeadshotCard.scss';
import '../components/MemberProfile.scss';
import '../components/MemberProfileModal.scss';
import '../components/NovaHero.scss';
import '../components/PageHero.scss';
import '../components/ProjectFeaturesList.scss';
import '../components/ProjectGoTo.scss';
import '../components/ProjectHeader.scss';
import '../components/ProjectLearnMore.scss';
import '../components/QuickLink.scss';
import '../components/RoleSelector.scss';
import '../components/TextHero.scss';
import '../components/TimelineSection.scss';

import './apply.scss';
import './courses.scss';
import './home.scss';
import './initiatives.scss';
import './projects.scss';
import './sponsor.scss';
import './team.scss';

fetch('/.netlify/functions/server');

const App = (props: AppProps): ReactElement => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link
          href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css"
          rel="stylesheet"
          type="text/css"
        />
        <meta name="apple-mobile-web-app-title" content="Cornell DTI" />
        <meta name="application-name" content="Cornell DTI" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
