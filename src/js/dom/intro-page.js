import {UserLoginModal} from './user-login-modal'

export class IntroPage {
  static init() {
    UserLoginModal.init()
  }
  static onLogin(loginRequestHandler) {
    UserLoginModal.onLogin(loginRequestHandler)
  }
}
