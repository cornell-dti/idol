import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Footer from '../../../../components/Footer';

export default function FooterPage() {
  return (
    <PageLayout title="Footer">
      <PageSection title="" description="" className="h-200">
        <Footer />
      </PageSection>
    </PageLayout>
  );
}
