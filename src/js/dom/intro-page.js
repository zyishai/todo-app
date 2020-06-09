import {render, html} from 'lit-html';
import {DomUtils} from './utils';

export class IntroPage {
  static _getContentDiv() {
    return DomUtils._getDOMElement('.container .content');
  }
  static render() {
    render(
      html`
        <div class="hero">
          <h1>Beautiful. Simple. Powerful.</h1>
          <p>
            <span class="highlight">Scheduler</span> let you manage your tasks
            with a ease. With beautiful display, simple layout and easy
            management, your tasks were never so easy to complete!
          </p>
          <p>Click on login above to get started!</p>
        </div>
      `,
      this._getContentDiv(),
    );
  }
}
