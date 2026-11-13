import React from 'react';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import styles from './NavigationCard.module.css';
import { useHasAdminPermission } from '../FirestoreDataProvider';
import { isProduction } from '../../../environment';
import { ClipboardTextIcon } from '../../../design-system-2026/icons';
import type { Icon } from '../../../design-system-2026/icons';
import { usePreview } from '../../../redesign/preview';
import ShortcutCard from '../../../redesign/ShortcutCard/ShortcutCard';

export type NavigationCardItem = {
  readonly header: string;
  readonly description: string;
  readonly link: string;
  readonly adminOnly?: boolean;
  readonly disabled?: boolean;
  /** Shown in the redesign's icon tile; falls back to a generic form icon. */
  readonly icon?: Icon;
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
        {visibleItems.map(({ header, description, link, icon }) => (
          <ShortcutCard
            key={link}
            href={link}
            label={header}
            description={description}
            icon={icon ?? ClipboardTextIcon}
          />
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
