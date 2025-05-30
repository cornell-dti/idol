import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import FeatureSection from '@/components/FeatureSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

export default function FooterPage() {
  return (
    <PageLayout title="Footer" description="Guidelines for footer component.">
      <PageSection title="" description="">
        <Footer />
      </PageSection>
    </PageLayout>
  );
}
