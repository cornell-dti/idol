import Container from 'react-bootstrap/Container';

import LazyVideo from './LazyVideo';
import TextHero from './TextHero';

type Props = {
  readonly header?: string;
  readonly video?: string | { readonly webm: string; readonly mp4: string };
  readonly lazy: string;
  readonly image?: string;
  readonly subheader?: string;
};

export default function NovaHero({ header, video, lazy, image, subheader }: Props): JSX.Element {
  return (
    <div className="nova-hero">
      <div className="nova-hero-visual-container">
        <LazyVideo className="nova-hero-visual" lazy={lazy} image={image} video={video} />
        <div className="nova-hero-overlay" />
      </div>
      {(header || subheader) && (
        <Container fluid>
          <TextHero header={header} subheader={subheader} />
        </Container>
      )}
    </div>
  );
}
