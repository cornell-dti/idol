import { useEffect, useRef, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import IconPreview from '../design-system-2026/IconPreview';
import TypographyPreview from '../design-system-2026/TypographyPreview';
import ComponentsPreview from '../design-system-2026/ComponentsPreview';
import { DesignSystemScope, DottedBackground } from '../design-system-2026/components';
import styles from '../design-system/TokenPreview.module.css';

const tokens = [
  'fg/default',
  'fg/dimmer',
  'bg/root',
  'bg/default',
  'bg/dimmer',
  'stroke/black',
  'stroke/medium',
  'stroke/white',
  'accent/default',
  'accent/dimmer',
  'danger/default',
  'danger/dimmer',
  'success/default'
] as const;

const cssName = (name: string) => `--idol-${name.replace(/\//g, '-')}`;

function ThemePreview({ mode }: { readonly mode: 'light' | 'dark' }): JSX.Element {
  const preview = useRef<HTMLElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!preview.current) return;
    const computed = getComputedStyle(preview.current);
    setValues(
      Object.fromEntries(
        tokens.map((name) => [name, computed.getPropertyValue(cssName(name)).trim()])
      )
    );
  }, []);

  return (
    <section
      ref={preview}
      data-idol-redesign
      data-idol-theme={mode}
      className={styles.panel}
      aria-labelledby={`${mode}-title`}
    >
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>Theme / {mode}</p>
          <h2 id={`${mode}-title`}>{mode === 'light' ? 'Light' : 'Dark'}</h2>
        </div>
        <span className={styles.modeBadge}>{mode === 'light' ? 'Default mode' : 'Dark mode'}</span>
      </div>
      <ul className={styles.tokens}>
        {tokens.map((name) => (
          <li key={name} className={styles.token}>
            <div className={styles.checkerboard} aria-hidden="true">
              <span
                className={styles.swatch}
                style={{ backgroundColor: `var(${cssName(name)})` }}
              />
            </div>
            <div className={styles.tokenInfo}>
              <h3>{name}</h3>
              <code>{cssName(name)}</code>
            </div>
            <code className={styles.value}>{values[name] || '…'}</code>
          </li>
        ))}
      </ul>
      <div className={styles.sample}>
        <span className={styles.statusDot} aria-hidden="true" />
        <div>
          <strong>Colors in context</strong>
          <p>Foreground, surface, stroke, and success.</p>
        </div>
      </div>
    </section>
  );
}

export default function DesignSystem2026(): JSX.Element {
  return (
    <div data-idol-redesign data-idol-theme="light" className={styles.page}>
      <Head>
        <title>Design system 2026 · IDOL</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <aside className={styles.sidebar}>
        <a href="#overview" className={styles.brand}>
          IDOL<span>Design system / 2026</span>
        </a>
        <p className={styles.eyebrow}>Foundations</p>
        <nav className={styles.sectionNav} aria-label="Design system sections">
          <a href="#typography">
            <span>01</span>Typography
          </a>
          <a href="#colors">
            <span>02</span>Color tokens
          </a>
          <a href="#icons">
            <span>03</span>Phosphor icons
          </a>
          <a href="#buttons">
            <span>04</span>Buttons
          </a>
          <a href="#icon-buttons">
            <span>05</span>Icon buttons
          </a>
          <a href="#inputs">
            <span>06</span>Inputs
          </a>
          <a href="#cards">
            <span>07</span>Cards
          </a>
          <a href="#breadcrumb-items">
            <span>08</span>Breadcrumb item
          </a>
          <a href="#breadcrumbs">
            <span>09</span>Breadcrumbs
          </a>
          <a href="#tab">
            <span>10</span>Tab
          </a>
          <a href="#tabs">
            <span>11</span>Tabs
          </a>
          <a href="#checkboxes">
            <span>12</span>Checkboxes
          </a>
          <a href="#labelled-checkboxes">
            <span>13</span>Labeled checkboxes
          </a>
          <a href="#pills">
            <span>14</span>Pills
          </a>
          <a href="#modals">
            <span>15</span>Modal
          </a>
          <a href="#avatars">
            <span>16</span>Avatars
          </a>
          <a href="#modal-backdrop">
            <span>17</span>Backdrop
          </a>
          <a href="#sidebar-items">
            <span>18</span>Sidebar items
          </a>
          <a href="#sidebar-preview">
            <span>19</span>Sidebar
          </a>
          <a href="#radio-buttons">
            <span>20</span>Radio buttons
          </a>
          <a href="#switches">
            <span>21</span>Switches
          </a>
          <a href="#links">
            <span>22</span>Links
          </a>
          <a href="#menus">
            <span>23</span>Menus
          </a>
          <a href="#dotted-background">
            <span>24</span>Dotted background
          </a>
          <a href="/design-system-2026/shell">
            <span>↗</span>App shell
          </a>
        </nav>
        <p className={styles.sidebarNote}>
          A shared language for
          <br />
          the next IDOL.
        </p>
      </aside>
      <main id="overview" className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>IDOL / Foundations / 2026</p>
            <h1 className="idol-title">Design system</h1>
            <p className={styles.description}>
              Typography, colors, and icons. The foundations of the next IDOL.
            </p>
          </div>
          <a
            className={styles.sourceLink}
            href="https://www.figma.com/design/b8WJ4ACbZyljS6ZNYufOxD/?node-id=179-7955"
            target="_blank"
            rel="noreferrer"
          >
            View in Figma ↗
          </a>
        </header>
        <div className={styles.summary}>
          <span>11 type styles</span>
          <span>{tokens.length} color tokens</span>
          <span>2 theme modes</span>
        </div>
        <TypographyPreview />
        <section id="colors" className={styles.foundationSection} aria-labelledby="colors-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>02 / Color</p>
              <h2 id="colors-title">One palette, two perspectives.</h2>
              <p className={styles.description}>
                Semantic colors for every surface, state, and theme.
              </p>
            </div>
          </div>
          <div className={styles.themes}>
            <ThemePreview mode="light" />
            <ThemePreview mode="dark" />
          </div>
        </section>
        <IconPreview />
        <ComponentsPreview />
        <section
          id="dotted-background"
          className={styles.foundationSection}
          aria-labelledby="background-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>24 / Surfaces</p>
              <h2 id="background-title">Dotted background</h2>
              <p className={styles.description}>
                A quiet, repeating canvas that follows the current theme.
              </p>
            </div>
            <a className={styles.sourceLink} href="/design-system-2026/shell">
              Explore the app shell ↗
            </a>
          </div>
          <div className={styles.themes}>
            {(['light', 'dark'] as const).map((theme) => (
              <DesignSystemScope key={theme} theme={theme}>
                <DottedBackground
                  className={styles.backgroundSample}
                  role="img"
                  aria-label={`${theme} dotted background`}
                />
              </DesignSystemScope>
            ))}
          </div>
        </section>
        <footer className={styles.footer}>
          Swatches and values use the imported CSS variables. Checkerboards reveal transparency.
        </footer>
      </main>
    </div>
  );
}

// This local test route must not expose the unreleased redesign in production exports.
export const getStaticProps: GetStaticProps = () => ({
  notFound: process.env.NODE_ENV !== 'development',
  props: {}
});
