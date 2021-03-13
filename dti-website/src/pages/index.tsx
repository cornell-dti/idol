import Row from 'react-bootstrap/Row';

import Layout from '../components/Layout';
import LazyVideo from '../components/LazyVideo';
import PageSublist from '../components/PageSublist';
import QuickLink from '../components/QuickLink';
import TextHero from '../components/TextHero';

export default function IndexPage(): JSX.Element {
  return (
    <Layout title="Home">
      <div className="home">
        <LazyVideo
          className="home-background home-preload-background home-background-video"
          image="/static/pages/home-hero.png"
          lazy="/static/pages/home-hero-lazy.jpg"
          video={{
            mp4:
              'https://d2ytxic79evey7.cloudfront.net/pages/home/hero/hero.mp4',
            webm:
              'https://d2ytxic79evey7.cloudfront.net/pages/home/hero/hero.webm'
          }}
        />
        <div className="home-background home-background-overlay" />
        <Row>
          <h1 className="home-overlay-text">
            Cornell Design
            <br />
            &amp; Tech Initiative
          </h1>
        </Row>
      </div>
      <TextHero
        header="Creating Technology for Community Impact"
        subheader="Our engineering project team is dedicated to more than just software development. We solve real problems around us to make our community better, while fostering our personal growth to teach others from our experience."
      />
      <PageSublist borderPadding>
        <QuickLink
          link="/projects"
          image="/static/pages/home-projects.jpg"
          header="Projects"
          subheader="What we create >"
        />
        <QuickLink
          link="/team"
          image="/static/pages/home-team.jpg"
          header="Team"
          subheader="Who we are >"
        />
        <QuickLink
          link="/initiatives"
          image="/static/pages/home-initiatives.jpg"
          header="Initiatives"
          subheader="Why we do it >"
        />
      </PageSublist>

      <div style={{ paddingBottom: '2vw' }} />
    </Layout>
  );
}
