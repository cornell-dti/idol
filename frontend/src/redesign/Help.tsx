import Head from 'next/head';
import { useRef, useState } from 'react';
import content from './helpContent.json';
import productLogos from './helpProductLogos';
import { Card, DesignSystemScope, Input, Link } from '../design-system-2026/components';
import {
  ArrowSquareOutIcon,
  MagnifyingGlassIcon,
  CalendarBlankIcon,
  CodeIcon,
  CoffeeIcon,
  GraduationCapIcon,
  HouseIcon,
  MegaphoneIcon,
  UserIcon
} from '../design-system-2026/icons';
import type { Icon } from '../design-system-2026/icons';
import styles from './Help.module.css';

type GlossaryEntry = {
  title: string;
  icon?: Icon;
  logo?: string;
  description: string;
  href?: string;
  status?: string;
};
const termIcons: Record<string, Icon> = {
  House: HouseIcon,
  Megaphone: MegaphoneIcon,
  CalendarBlank: CalendarBlankIcon,
  Coffee: CoffeeIcon,
  Code: CodeIcon,
  User: UserIcon,
  GraduationCap: GraduationCapIcon
};
const glossary: readonly GlossaryEntry[] = content.terms.map((term) => ({
  ...term,
  icon: termIcons[term.icon]
}));
const productEntries: readonly GlossaryEntry[] = content.products.map((product) => ({
  ...product,
  logo: productLogos[product.logo],
  href: product.status === 'Archived' ? undefined : product.href
}));

function Definitions({
  entries,
  productSection = false
}: {
  readonly entries: readonly GlossaryEntry[];
  readonly productSection?: boolean;
}): JSX.Element {
  const Heading = productSection ? 'h4' : 'h3';
  return (
    <dl className={styles.glossary}>
      {entries.map(({ title, icon: TermIcon, logo, description, href, status }) => (
        <div key={title} className={styles.entry}>
          <dt className={styles.term}>
            {logo ? (
              <span className={styles.productLogo}>
                <img src={logo} alt="" width={24} height={24} />
              </span>
            ) : (
              TermIcon && <TermIcon size={24} aria-hidden="true" className={styles.termIcon} />
            )}
            <div className={styles.termLabel}>
              <Heading className={styles.termTitle}>
                {title}
                {href && (
                  <>
                    {' '}
                    <Link
                      href={href}
                      className={styles.pageLink}
                      aria-label={`Open ${title}`}
                      title={`Open ${title}`}
                    >
                      <ArrowSquareOutIcon size={16} aria-hidden="true" />
                    </Link>
                  </>
                )}
              </Heading>
              {status && <span className={styles.status}>{status}</span>}
            </div>
          </dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Help(): JSX.Element {
  const [query, setQuery] = useState('');
  const results = useRef<HTMLDivElement>(null);
  const [resultsHeight, setResultsHeight] = useState<number>();
  const normalized = query.trim().toLowerCase();
  const matches = (entry: GlossaryEntry) =>
    `${entry.title} ${entry.description} ${entry.status ?? ''}`.toLowerCase().includes(normalized);
  const terms = glossary.filter(matches);
  const matchingProducts = productEntries.filter(matches);
  return (
    <DesignSystemScope>
      <Head>
        <title>{content.documentTitle}</title>
      </Head>
      <div className={styles.page}>
        <h1 className="idol-heading-1">{content.pageTitle}</h1>
        <Card
          header={content.glossaryTitle}
          className={styles.glossaryCard}
          action={
            <div className={styles.search}>
              <Input
                id="help-search"
                type="search"
                aria-label={content.search.label}
                placeholder={content.search.placeholder}
                shape="pill"
                icon={<MagnifyingGlassIcon size={16} aria-hidden="true" />}
                value={query}
                onChange={(event) => {
                  if (!normalized && event.target.value.trim())
                    setResultsHeight(results.current?.getBoundingClientRect().height);
                  setQuery(event.target.value);
                }}
              />
            </div>
          }
        >
          <div
            ref={results}
            className={styles.results}
            style={{ minHeight: normalized ? resultsHeight : undefined }}
          >
            {terms.length > 0 && <Definitions entries={terms} />}
            {matchingProducts.length > 0 && (
              <section className={styles.products} aria-labelledby="help-products">
                <h3 id="help-products" className={styles.productsTitle}>
                  {content.productsTitle}
                </h3>
                <Definitions entries={matchingProducts} productSection />
              </section>
            )}
            {!terms.length && !matchingProducts.length && (
              <p className={styles.empty} role="status">
                {content.search.empty.replace('{query}', query.trim())}
              </p>
            )}
          </div>
        </Card>
        <Card header={content.support.title}>
          <p className={styles.support}>
            {content.support.beforeLink}
            <Link href={content.support.href}>{content.support.linkLabel}</Link>
            {content.support.afterLink}
          </p>
        </Card>
      </div>
    </DesignSystemScope>
  );
}
