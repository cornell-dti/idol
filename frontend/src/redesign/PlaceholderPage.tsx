import Head from 'next/head';
import styles from './PlaceholderPage.module.css';

export default function PlaceholderPage({ title }: { readonly title: string }): JSX.Element {
  return (
    <div className={styles.page}>
      <Head>
        <title>{title} · IDOL</title>
      </Head>
      <h1 className="idol-heading-1">{title}</h1>
      <p>Coming soon.</p>
    </div>
  );
}
