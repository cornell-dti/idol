import React from 'react';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import styles from './NavigationCard.module.css';
import { useHasAdminPermission } from '../FirestoreDataProvider';
import { isProduction } from '../../../environment';

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

  return (
    <div data-testid={testID}>
      <Card.Group className={styles.cardsContainer}>
        {items.map(
          ({ header, description, link, adminOnly, disabled }) =>
            !disabled &&
            (!isProduction || !adminOnly || hasAdminPermission) && (
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
            )
        )}
      </Card.Group>
    </div>
  );
}
