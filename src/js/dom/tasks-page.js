import {render, html} from 'lit-html';

import {TaskForm} from './task-form';
import {DomUtils} from './utils';
import plusWhiteIcon from '../../img/plus_white.svg';
import trashIcon from '../../img/trash.svg';

export class TasksPage {
  static _getContentDiv() {
    return DomUtils._getDOMElement('.container .content');
  }
  static render() {
    render(
      html`
        <div class="main-page">
          <div id="categories">
            <nav>
              <header>
                <h2>Categories</h2>
              </header>
              <ul></ul>
            </nav>
          </div>
          <main id="task-list">
            <header>
              <h1></h1>
              <button
                class="btn btn-primary icon-btn"
                @click=${() => TaskForm.openForm()}
              >
                <span class="icon">
                  <img src=${plusWhiteIcon} alt="plus icon" />
                </span>
                <span class="text">
                  Add item
                </span>
              </button>
            </header>
            <section>
              <ul></ul>
              <footer>
                <button class="btn link-btn icon-btn">
                  <span class="icon">
                    <img src=${trashIcon} alt="trash icon" />
                  </span>
                  <span class="text">
                    Remove finished items
                  </span>
                </button>
              </footer>
            </section>
          </main>
        </div>
      `,
      this._getContentDiv(),
    );
  }
}
