import { useState } from 'react';
import { Icon, Image } from 'semantic-ui-react';
import styles from './Alumni.module.css';

const FALLBACK_IMAGES = [
  '/alumni/fallback-1.svg',
  '/alumni/fallback-2.svg',
  '/alumni/fallback-3.svg',
  '/alumni/fallback-4.svg'
];

const getFallbackImage = (uuid: string): string => {
  const hash = uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
};

type AlumniCardProps = {
  alum: Alumni;
};

const AlumniCard: React.FC<AlumniCardProps> = ({ alum }) => {
  const [imgSrc, setImgSrc] = useState(alum.imageUrl || getFallbackImage(alum.uuid));

  const handleImageError = () => {
    setImgSrc(getFallbackImage(alum.uuid));
  };

  return (
    <div className={styles.alumniCard}>
      <Image
        src={imgSrc}
        alt={`${alum.firstName} ${alum.lastName}`}
        className={styles.profileImage}
        circular
        size="small"
        onError={handleImageError}
      />

      <div className={styles.cardContent}>
        <div className={styles.nameSection}>
          <h3 className={styles.name}>
            {alum.firstName} {alum.lastName}
          </h3>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoColumn}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Company</span>
              <span className={styles.infoValue}>{alum.company || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Company Role</span>
              <span className={styles.infoValue}>{alum.jobRole}</span>
            </div>
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Based in</span>
              <span className={styles.infoValue}>{alum.location || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Graduated in</span>
              <span className={styles.infoValue}>{alum.gradYear || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Role on DTI</span>
              <span className={styles.infoValue}>
                {alum.dtiRoles && alum.dtiRoles.length > 0 ? alum.dtiRoles.join(', ') : 'N/A'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Subteam on DTI</span>
              <span className={styles.infoValue}>
                {alum.subteams && alum.subteams.length > 0 ? alum.subteams.join(', ') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.socialIcons}>
        {alum.email && (
          <a href={`mailto:${alum.email}`} className={styles.socialLink} aria-label="Email">
            <Icon name="mail" size="large" />
          </a>
        )}
        {alum.linkedin && (
          <a
            href={alum.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <Icon name="linkedin" size="large" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
