import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

type UserContextType = { readonly email: string } | 'INIT' | null;

const UserContext = createContext<UserContextType>(null);

const getUserEmail = (user: firebase.User) => {
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

let cachedUser: firebase.User | null = null;

export const getUserIdToken = async (): Promise<string | null> => {
  if (cachedUser == null) return null;
  return cachedUser.getIdToken();
};

export default function UserProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserContextType>('INIT');

  useEffect(
    () =>
      auth.onAuthStateChanged(async (userAuth) => {
        if (userAuth) {
          setUser({ email: getUserEmail(userAuth) });
          cachedUser = userAuth;
        } else {
          setUser(null);
        }
      }),
    []
  );

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
