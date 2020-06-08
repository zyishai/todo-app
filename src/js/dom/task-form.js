import {html, render} from 'lit-html'
import {DomUtils} from './utils'
import {Overlay} from './overlay'

export class TaskForm {
  static submitHandler = null
  static _getNewTaskInput() {
    return this.getForm().querySelector('main textarea')
  }
  static getForm() {
    return DomUtils._getDOMElement('.new-task-modal')
  }
  static getInputValue() {
    return this._getNewTaskInput().value
  }
  static submitForm() {
    if (this.submitHandler) {
      this.submitHandler(this.getInputValue())
    }
    this.closeForm()
  }
  static clearForm() {
    this._getNewTaskInput().value = ''
  }
  static openForm() {
    render(
      html`
        <header>
          <h2>Add new task</h2>
        </header>
        <main>
          <textarea></textarea>
        </main>
        <footer>
          <button class="btn" @click=${this.closeForm.bind(this)}>
            <span class="text">
              Cancel
            </span>
          </button>
          <button class="btn btn-primary" @click=${this.submitForm.bind(this)}>
            <span class="text">
              Save
            </span>
          </button>
        </footer>
      `,
      this.getForm(),
    )
    Overlay.show()
    this.getForm().classList.add('active')
  }
  static closeForm() {
    this.clearForm()
    this.getForm().classList.remove('active')
    Overlay.hide()
  }
  static isOpen() {
    return this.getForm().classList.contains('active')
  }
  static onSubmit(submitHandler) {
    this.submitHandler = submitHandler
  }
}
