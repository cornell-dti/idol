import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import IconWrapper from '../../../../components/IconWrapper';
import RocketIcon from '../icon/RocketIcon';

export default function IconWrapperPage() {
  return (
    <PageLayout title="Icon Wrapper" description="Guidelines for icon wrapper component.">
      <PageSection title="" description="">
        <IconWrapper size="large" type="primary">
          <RocketIcon />
        </IconWrapper>

        <IconWrapper size="default" type="primary">
          <RocketIcon />
        </IconWrapper>

        <IconWrapper size="small" type="primary">
          <RocketIcon />
        </IconWrapper>

        <IconWrapper size="large" type="default">
          <RocketIcon />
        </IconWrapper>

        <IconWrapper size="default" type="default">
          <RocketIcon />
        </IconWrapper>

        <IconWrapper size="small" type="default">
          <RocketIcon />
        </IconWrapper>
      </PageSection>
    </PageLayout>
  );
}
