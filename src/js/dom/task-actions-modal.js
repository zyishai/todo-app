import {render, html} from 'lit-html'
import {repeat} from 'lit-html/directives/repeat'
import {DomUtils} from './utils'
import {Overlay} from './overlay'
import closeIcon from '../../img/x.svg'

export class TaskActionsModal {
  static getModal() {
    return DomUtils._getDOMElement('.task-actions-modal')
  }
  static isOpen() {
    return this.getModal().classList.contains('active')
  }
  static open(actions) {
    // render actions to task actions list
    render(
      html`
        <header>
          <h2>Actions</h2>
        </header>
        <section>
          ${repeat(
            actions,
            (action) => action.label,
            (action) => html`
              <button
                class="btn icon-btn btn-hover btn-full-width"
                @click=${() => {
                  this.close()
                  action.handler()
                }}
              >
                <span class="icon">
                  <img src=${action.icon} alt="action icon" />
                </span>
                <span class="text">${action.label}</span>
              </button>
            `,
          )}
        </section>
        <footer>
          <button class="link-btn icon-btn" @click=${() => this.close()}>
            <span class="icon">
              <img src=${closeIcon} alt="close icon" />
            </span>
            <span class="text">Close</span>
          </button>
        </footer>
      `,
      this.getModal(),
    )

    // activate overlay and show task actions list
    Overlay.show()
    this.getModal().classList.add('active')
  }
  static close() {
    Overlay.hide()
    this.getModal().classList.remove('active')
  }
}
