import React from 'react';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import styles from './NavigationCard.module.css';
import { useHasAdminPermission } from '../FirestoreDataProvider';
import { isProduction } from '../../../environment';
import { Card as RedesignCard } from '../../../design-system-2026/components';
import { ArrowRightIcon } from '../../../design-system-2026/icons';
import { usePreview } from '../../../redesign/preview';

export type NavigationCardItem = {
  readonly header: string;
  readonly description: string;
  readonly link: string;
  readonly adminOnly?: boolean;
  readonly disabled?: boolean;
};

type Props = { readonly testID?: string; readonly items: readonly NavigationCardItem[] };

export default function NavigationCard({ testID, items }: Props): JSX.Element {
  const hasAdminPermission = useHasAdminPermission();
  const preview = usePreview();
  const visibleItems = items.filter(
    ({ disabled, adminOnly }) => !disabled && (!isProduction || !adminOnly || hasAdminPermission)
  );

  if (preview) {
    return (
      <div className={styles.cardGrid} data-testid={testID}>
        {visibleItems.map(({ header, description, link }) => (
          <Link key={link} href={link}>
            <a href={link} className={styles.cardLink}>
              <RedesignCard header={header} action={<ArrowRightIcon size={16} aria-hidden />}>
                <p>{description}</p>
              </RedesignCard>
            </a>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div data-testid={testID}>
      <Card.Group className={styles.cardsContainer}>
        {visibleItems.map(({ header, description, link }) => (
          <Card key={link}>
            <Card.Content>
              <Card.Header>{header}</Card.Header>
              <Card.Description>{description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui one buttons">
                <Link href={link}>
                  <Button basic color="blue">
                    Go To
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
}
