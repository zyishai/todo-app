import {html, render} from 'lit-html';
import {DomUtils} from './utils';
import {Overlay} from './overlay';
import {repeat} from 'lit-html/directives/repeat';

export class TaskForm {
  static submitHandler = null;
  static categoriesChoices = [];
  static _getNewTaskInput() {
    return this.getForm().querySelector('main textarea');
  }
  static _getCategoryInput() {
    return this.getForm().querySelector('main > .category');
  }
  static getForm() {
    return DomUtils._getDOMElement('.new-task-modal');
  }
  static getInputValue() {
    return this._getNewTaskInput().value;
  }
  static getSelectedCategory() {
    return this._getCategoryInput().value;
  }
  static renderCategory(category) {
    return html`
      <option .value=${category.name} ?selected=${category.selected}
        >${category.displayName}</option
      >
    `;
  }
  static renderCategoryChoices() {
    return html`${repeat(
      this.categoriesChoices,
      (category) => category.name,
      this.renderCategory,
    )}`;
  }
  static submitForm() {
    if (this.submitHandler) {
      this.submitHandler(this.getInputValue(), this.getSelectedCategory());
    }
    this.closeForm();
  }
  static clearForm() {
    this._getNewTaskInput().value = '';
  }
  static openForm() {
    render(
      html`
        <header>
          <h2>Add new task</h2>
        </header>
        <main>
          <textarea></textarea>
          <input
            type="text"
            class="category"
            list="category-select"
            placeholder="Choose or create new category"
          />
          <datalist id="category-select">
            ${this.renderCategoryChoices()}
          </datalist>
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
    );
    Overlay.show();
    this.getForm().classList.add('active');
  }
  static closeForm() {
    this.clearForm();
    this.getForm().classList.remove('active');
    Overlay.hide();
  }
  static isOpen() {
    return this.getForm().classList.contains('active');
  }
  static onSubmit(submitHandler) {
    this.submitHandler = submitHandler;
  }
  static setFormCategoriesChoices(categories) {
    this.categoriesChoices = categories;
  }
}
