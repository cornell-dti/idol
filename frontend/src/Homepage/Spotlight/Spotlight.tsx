import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import styles from './Spotlight.module.css';
import AramHeadshot from '../../static/images/aram-headshot.jpg';

const Spotlight: React.FC = () => (
  <div className={styles.Spotlight} data-testid="Spotlight">
    <h2 style={{ textAlign: 'center', fontFamily: 'var(--mainFontFamily)' }}>
      This Week's Spotlight
      <span role="img" aria-label="Light emoji">
        💡
      </span>
    </h2>
    <Card.Group>
      <Card>
        <Card.Content>
          <Image className={styles.headshot} size="medium" src={AramHeadshot} />
          <Card.Header>Ring Aram the Rosey</Card.Header>
          <Card.Description>
            Aram is then new PM lead for DTI! He is also known for his signature
            blue hoodie.
          </Card.Description>
        </Card.Content>
      </Card>
    </Card.Group>
  </div>
);

export default Spotlight;
