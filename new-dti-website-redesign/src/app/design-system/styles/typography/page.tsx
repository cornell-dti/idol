import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import typographyStyles from './typography';
import Note from '../../util/Note';

export default function TypographyPage() {
  const headingStyles = typographyStyles.filter((style) => style.type === 'Heading');
  const bodyStyles = typographyStyles.filter((style) => style.type === 'Body');

  return (
    <PageLayout title="Typography">
      <PageSection
        title="Headings"
        description="Used for titles to structure content and establish hierarchy. Levels H1-H3 also have different mobile sizes."
      >
        <div className="flex flex-col gap-6">
          <Note
            inner={
              <p>
                Use the proper HTML heading tag for semantics. Style the heading with the
                appropriate style using the CSS .h1, .h2, .h3, etc. class.
              </p>
            }
          />
          {headingStyles.map((style, index) => (
            <div key={index} className="flex items-center gap-8">
              <div className="w-20 flex flex-col items-end">
                <p className="caps">{style.html}</p>
                <p className="caps text-foreground-3">
                  {style.context !== 'default' ? `${style.context}` : ''}
                </p>
              </div>
              {React.createElement(
                style.html,
                {
                  className:
                    style.context === 'mobile' && ['h1', 'h2', 'h3'].includes(style.html)
                      ? `${style.html}-mobile`
                      : ''
                },
                'Building the Future of Tech @ Cornell'
              )}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Body"
        description="Text styles for paragraphs, captions, and labels, including default body text and uppercase variants for supporting content."
      >
        <div className="flex flex-col gap-6">
          {bodyStyles.map((style, index) => (
            <div key={index} className="flex items-center gap-8">
              <div key={index} className="w-20 flex flex-col items-end">
                <p className="caps">{style.variant}</p>
                <p className="caps text-foreground-3">{style.context}</p>
              </div>
              {React.createElement(
                style.html,
                { className: style.transform === 'uppercase' ? 'uppercase' : '' },
                'Building the Future of Tech @ Cornell'
              )}
            </div>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
