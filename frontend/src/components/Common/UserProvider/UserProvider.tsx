import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import SignIn from '../SignIn/SignIn.lazy';
import EmailNotFoundErrorModal from '../../Modals/EmailNotFoundErrorModal';

import styles from './UserProvider.module.css';
import { useHasMemberPermission } from '../FirestoreDataProvider';

type UserContextType = { readonly email: string } | 'INIT' | null;

const UserContext = createContext<UserContextType>(null);

const getUserEmail = (user: User) => {
  const { email } = user;
  if (email == null) throw new Error();
  return email;
};

export const useUserContext = (): UserContextType => useContext(UserContext);

export const useUserEmail = (): string => {
  const context = useUserContext();
  if (context === 'INIT' || context == null) return '@cornell.edu';
  return context.email;
};

let cachedUser: User | null = null;

const updateCachedUser = async (userAuth: User) => {
  cachedUser = userAuth;
};

export const getUserIdToken = async (): Promise<string | null> => {
  if (cachedUser == null) return null;
  return cachedUser.getIdToken();
};

export default function UserProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserContextType>('INIT');
  const router = useRouter();
  const isMember = useHasMemberPermission();

  useEffect(
    () =>
      process.env.NODE_ENV === 'test'
        ? () => {
            // Do not run firebase auth in test environment.
          }
        : auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
              updateCachedUser(userAuth).then(() => setUser({ email: getUserEmail(userAuth) }));
            } else {
              setUser(null);
            }
          }),
    []
  );

  if (user === 'INIT') {
    return (
      <div data-testid="UserProvider" className="App">
        <div className={styles.LoaderContainer}>
          <Loader active={true} size="massive">
            Signing you in...
          </Loader>
        </div>
      </div>
    );
  }
  if (user == null) {
    return (
      <div data-testid="UserProvider" className="App">
        <EmailNotFoundErrorModal />
        <SignIn />
      </div>
    );
  }

  if (!router.pathname.startsWith('/applicant') && !isMember) {
    console.log(isMember);
    router.push('/applicant');
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
