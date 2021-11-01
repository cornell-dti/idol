import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import styles from './NavigationCard.module.css';
import PermissionsAPI from '../../API/PermissionsAPI';

export type NavigationCardItem = {
  readonly header: string;
  readonly description: string;
  readonly link: string;
  readonly unstable?: boolean;
};

type Props = { readonly testID?: string; readonly items: readonly NavigationCardItem[] };

export default function NavigationCard({ testID, items }: Props): JSX.Element {
  const [allowUnstable, setAllowUnstable] = useState(false);

  useEffect(() => {
    PermissionsAPI.isAdmin().then(({ isAdmin }) => setAllowUnstable(isAdmin));
  }, []);

  return (
    <div data-testid={testID}>
      <div className={styles.content}>
        <Card.Group>
          {items.map(
            ({ header, description, link, unstable }) =>
              (!unstable || allowUnstable) && (
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
    </div>
  );
}
