import { Image } from 'semantic-ui-react';
import IdolHallOfFame from '../../static/images/idol-hall-of-fame.png';
import styles from './index.module.css';

const HallOfFame: React.FC = () => <Image className={styles.headshot} src={IdolHallOfFame.src} />;

export default HallOfFame;
