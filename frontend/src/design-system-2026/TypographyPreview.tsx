import styles from './TokenPreview.module.css';

const sample = 'IDOL is the most goat-ed team of cornell dti';
const headings = [
  { tag: 'h1', name: 'Heading/1', size: 32, line: 40, tracking: -1.28 },
  { tag: 'h2', name: 'Heading/2', size: 24, line: 32, tracking: -0.96 },
  { tag: 'h3', name: 'Heading/3', size: 20, line: 26, tracking: -0.4 },
  { tag: 'h4', name: 'Heading/4', size: 16, line: 24, tracking: -0.32 }
] as const;
const sizes = ['large', 'default', 'small'] as const;

export default function TypographyPreview(): JSX.Element {
  return (
    <section
      id="typography"
      className={styles.foundationSection}
      aria-labelledby="typography-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>01 / Typography</p>
          <h2 id="typography-title">Type, with purpose.</h2>
          <p className={styles.description}>
            Inter. Eleven styles, from page titles to the smallest labels.
          </p>
        </div>
        <span className={styles.modeBadge}>Inter · 400 / 600</span>
      </div>
      <div className={styles.typeSpecimen}>
        <div className={styles.headingSpecimen}>
          <div className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span>Title</span>
              <code>40 / 48 · 600</code>
              <code>−2.4px</code>
            </div>
            <p className="idol-title" data-type-style="title">
              {sample}
            </p>
          </div>
          {headings.map(({ tag: Tag, name, size, line, tracking }) => (
            <div key={name} className={styles.typeRow}>
              <div className={styles.typeMeta}>
                <span>
                  {name} <code>&lt;{Tag}&gt;</code>
                </span>
                <code>
                  {size} / {line} · 600
                </code>
                <code>{tracking}px</code>
              </div>
              <Tag data-type-style={`heading-${Tag.slice(1)}`}>{sample}</Tag>
            </div>
          ))}
        </div>
        <div className={styles.bodySpecimens}>
          {(['body', 'label'] as const).map((group) => (
            <div key={group}>
              <h3 className={styles.typeGroupTitle}>{group === 'body' ? 'Body' : 'Label'}</h3>
              {sizes.map((size, index) => (
                <div key={size} className={styles.bodyTypeRow}>
                  <div className={styles.typeMeta}>
                    <span>{size}</span>
                    <code>
                      {16 - index * 2} / {group === 'body' ? 22 - index * 2 : 16 - index * 2}
                    </code>
                  </div>
                  <p className={`idol-${group}-${size}`} data-type-style={`${group}-${size}`}>
                    {sample}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.typeUsage}>
        <p className="idol-body-small">
          Headings keep their HTML semantics. Body and label classes choose the visual style.
        </p>
        <code>
          {
            '<h2>Section heading</h2>\n<p className="idol-body-large">Body text</p>\n<span className="idol-label-small">Label</span>'
          }
        </code>
      </div>
    </section>
  );
}
