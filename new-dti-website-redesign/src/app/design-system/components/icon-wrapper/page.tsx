import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import IconWrapper from '../../../../components/IconWrapper';
import RocketIcon from '../../../../components/icons/RocketIcon';

export default function IconWrapperPage() {
  return (
    <PageLayout title="Icon wrapper">
      <PageSection title="" description="">
        <p>
          These are used as decorational elements, for example in the Feature page section or in the
          Timeline Card component.
        </p>
        <div className="flex gap-8">
          <div className="flex flex-col gap-6">
            <IconWrapper size="large" type="primary">
              <RocketIcon />
            </IconWrapper>

            <IconWrapper size="default" type="primary">
              <RocketIcon />
            </IconWrapper>

            <IconWrapper size="small" type="primary">
              <RocketIcon />
            </IconWrapper>
          </div>

          <div className="flex flex-col gap-6">
            <IconWrapper size="large" type="default">
              <RocketIcon />
            </IconWrapper>

            <IconWrapper size="default" type="default">
              <RocketIcon />
            </IconWrapper>

            <IconWrapper size="small" type="default">
              <RocketIcon />
            </IconWrapper>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
