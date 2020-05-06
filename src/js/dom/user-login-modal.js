import { DomUtils } from "./utils";
import { render, html } from "lit-html";
import { Overlay } from "./overlay";

export class UserLoginModal {
    static loginHandler = null;
    static _getModal() {
        return DomUtils._getDOMElement('.user-login-modal');
    }
    static _focusParent(event) {
        event.target.parentElement.classList.add('active');
    }
    static _blurParent(event) {
        if (!event.target.value.trim()) {
            event.target.parentElement.classList.remove('active');
        }
    }
    static init() {
        DomUtils._addEventListener(DomUtils._getDOMElement('.container header .link-btn'), 'click', () => {
            this.open();
        });
    }
    static login() {
        if (this.loginHandler) {
            const username = this._getModal().querySelector('input[type="text"]').value;
            const password = this._getModal().querySelector('input[type="password"]').value;
            const persist = this._getModal().querySelector('.checkbox input[type="checkbox"]').checked;
            this.loginHandler({
                username,
                password,
                persist
            });
        }

        this.close();
    }
    static open() {
        render(html`
            <header>
                <h2>Login</h2>
            </header>
            <main>
                <div class="input">
                    <i class="gg-profile"></i>
                    <input type="text" @focus=${this._focusParent} @blur=${this._blurParent}>
                    <span class="placeholder">Username</span>
                </div>
                <div class="input">
                    <i class="gg-lock"></i>
                    <input type="password" @focus=${this._focusParent} @blur=${this._blurParent}>
                    <span class="placeholder">Password</span>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="keep-credentials" />
                    <label for="keep-credentials">
                        Keep me logged in
                    </label>
                </div>
            </main>
            <footer>
                <button class="btn" @click=${() => this.close()}>
                    <span class="text">Cancel</span>
                </button>
                <button class="btn btn-primary" @click=${() => this.login()}>
                    <span class="text">Login</span>
                </button>
            </footer>
        `, this._getModal());

        this._getModal().classList.add('active');
        Overlay.show();
    }
    static close() {
        this.clear();
        this._getModal().classList.remove('active');
        Overlay.hide();
    }
    static clear() {
        this._getModal().querySelectorAll('.input input').forEach(input => {
            input.value = '';
            input.parentElement.classList.remove('active');
        });
        this._getModal().querySelector('.checkbox input').checked = false;
    }
    static onLogin(loginHandler) {
        this.loginHandler = loginHandler;
    }
}