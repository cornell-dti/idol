import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import PageBackground from '../components/PageBackground';
import TextPageHero from '../components/TextPageHero';

export default function Page404(): JSX.Element {
  const router = useRouter();

  return (
    <Layout title="Not Found" noFooter>
      <PageBackground>
        <TextPageHero style={{ height: '100vh' }}>
          <Container>
            <Row>
              <Col>
                <h2>Whoops... it doesn't look like this page exists.</h2>
                <br />
                <Button onClick={() => router.push('/')}>Go Home</Button>
              </Col>
            </Row>
          </Container>
        </TextPageHero>
      </PageBackground>
    </Layout>
  );
}
