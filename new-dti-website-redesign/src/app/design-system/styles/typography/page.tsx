import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import typographyStyles from './typography';

export default function TypographyPage() {
  const headingStyles = typographyStyles.filter((style) => style.type === 'Heading');
  const bodyStyles = typographyStyles.filter((style) => style.type === 'Body');

  return (
    <PageLayout title="Typography" description="Guidelines for font usage and hierarchy.">
      <PageSection title="Headings">
        <div className="flex flex-col gap-6">
          {headingStyles.map((style, index) => (
            <div key={index} className="flex items-center gap-8">
              <div className="w-20 flex flex-col items-end">
                <p className="caps">{style.html}</p>
                <p className="caps text-foreground-3">
                  {style.context !== 'default' ? `${style.context}` : ''}
                </p>
              </div>
              {React.createElement(style.html, {}, 'Building the Future of Tech @ Cornell')}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Body">
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
