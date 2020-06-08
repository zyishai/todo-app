import {render, html} from 'lit-html'
import {live} from 'lit-html/directives/live'
import {DomUtils} from './utils'
import {Overlay} from './overlay'

export class TaskEditModal {
  static getModal() {
    return DomUtils._getDOMElement('.task-edit-modal')
  }
  static isOpen() {
    return this.getModal().classList.contains('active')
  }
  static getValue() {
    return this.getModal().querySelector('main textarea').value
  }
  static createModal(task, handlers) {
    render(
      html`
        <header>
          <h2>Edit task</h2>
        </header>
        <main>
          <textarea .value=${live(task.content)}></textarea>
        </main>
        <footer>
          <button class="btn" @click=${() => handlers.closeWithoutSave()}>
            <span class="text">
              Cancel
            </span>
          </button>
          <button
            class="btn btn-primary"
            @click=${() => handlers.closeAndSave(task)}
          >
            <span class="text">
              Update
            </span>
          </button>
        </footer>
      `,
      this.getModal(),
    )
  }
  static open(task, handlers) {
    this.createModal(task, handlers)
    Overlay.show()
    this.getModal().classList.add('active')
  }
  static close() {
    if (this.isOpen()) {
      Overlay.hide()
      this.getModal().classList.remove('active')
    }
  }
}
