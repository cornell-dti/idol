import { EventEmitter } from "./event-emitter";

export class Emitters {

  // Navigation
  static navOpenEmitter: EventEmitter<boolean> = new EventEmitter();

  // Login
  static emailNotFoundError: EventEmitter<void> = new EventEmitter();

  // Site-wide
  static generalError: EventEmitter<{ headerMsg: string, contentMsg: string }> = new EventEmitter();


  // Users
  static userEditError: EventEmitter<{ headerMsg: string, contentMsg: string }> = new EventEmitter();
  // Teams
  static teamEditError: EventEmitter<{ headerMsg: string, contentMsg: string }> = new EventEmitter();

}