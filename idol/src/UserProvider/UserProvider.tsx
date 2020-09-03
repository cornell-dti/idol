import React, { Component, createContext } from "react";
import { auth, firestore } from "../firebase";
import { MembersAPI, Member } from "../API/MembersAPI";
import { Emitters } from "../EventEmitter/constant-emitters";

type UserContextType = { user: firebase.User | null };

export const UserContext = createContext<UserContextType>({ user: null });
class UserProvider extends Component<any, UserContextType>  {

  initialLoad: Promise<any> = Promise.resolve().then(() => {
    return MembersAPI.getAllMembers().then(
      (data) => {
        this.allMembers = data.docs.map(val => val.data() as Member);
      }
    );
  });
  allMembers!: Member[];
  constructor(props: any) {
    super(props);
    this.state = {
      user: auth.currentUser ? auth.currentUser : null
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      this.initialLoad.then(
        () => {
          if (userAuth) {
            if (this.allMembers.map(mem => mem.email).findIndex(email => email == userAuth.email) != -1) {
              this.setState({ user: userAuth });
            } else {
              Emitters.emailNotFoundError.emit();
              auth.signOut();
            }
          } else {
            this.setState({ user: userAuth });
          }
        }
      )
    });
  };
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;