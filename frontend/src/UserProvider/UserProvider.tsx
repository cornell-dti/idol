import React, { Component, createContext } from 'react';
import { auth } from '../firebase';
import Emitters from '../EventEmitter/constant-emitters';
import { LoginAPI } from '../API/LoginAPI';

type UserContextType = { user: firebase.User | null, loggingIntoDTI: boolean };

export const UserContext = createContext<UserContextType>({ user: null, loggingIntoDTI: false });
class UserProvider extends Component<Record<string, unknown>, UserContextType> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      user: auth.currentUser ? auth.currentUser : null,
      loggingIntoDTI: false,
    };
  }

  componentDidMount = (): void => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        this.setState({ loggingIntoDTI: true });
        LoginAPI.login(await userAuth.getIdToken()).then((loginResp) => {
          if (!loginResp.isLoggedIn) {
            auth.signOut().then(() => {
              this.setState({ user: null });
              Emitters.emailNotFoundError.emit();
            });
            this.setState({ loggingIntoDTI: false });
            return;
          }
          this.setState({ user: userAuth, loggingIntoDTI: false });
        });
      } else {
        LoginAPI.logout().then((logoutResp) => {
          if (!logoutResp.isLoggedIn) {
            this.setState({ user: null, loggingIntoDTI: false });
          } else {
            Emitters.generalError.emit({
              headerMsg: "Couldn't log out!",
              contentMsg: "Backend could not sign you out!"
            });
          }
        });
      }
    });
  };

  render(): JSX.Element {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;
