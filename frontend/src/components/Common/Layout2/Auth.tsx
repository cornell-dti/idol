import { Button, Group, GroupProps, Text } from '@mantine/core';

import { auth } from '../../../firebase';
import { useUserEmail } from '../UserProvider/UserProvider';

const Name = () => {
  const userEmail = useUserEmail();
  return (
    <Text
      fz="lg"
      sx={{
        maxWidth: 225,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {userEmail}
    </Text>
  );
};

export interface AuthProps extends GroupProps {
  hideButtons?: boolean;
}

const Auth: React.FC<AuthProps> = ({ hideButtons = false, ...props }) => {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <Group {...props}>
      <Name />
      {hideButtons || (
        <>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </>
      )}
    </Group>
  );
};

export default Auth;
