import {render, html} from 'lit-html';
import {live} from 'lit-html/directives/live';
import {repeat} from 'lit-html/directives/repeat';
import {DomUtils} from './utils';
import {Overlay} from './overlay';

export class TaskEditModal {
  static categoriesChoices = [];
  static getModal() {
    return DomUtils._getDOMElement('.task-edit-modal');
  }
  static isOpen() {
    return this.getModal().classList.contains('active');
  }
  static getValues() {
    return {
      content: this.getModal().querySelector('main textarea').value,
      category:
        this.getModal().querySelector('main input.category').value || 'Default',
    };
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
  static createModal(task, handlers) {
    render(
      html`
        <header>
          <h2>Edit task</h2>
        </header>
        <main>
          <textarea .value=${live(task.content)}></textarea>
          <input
            type="text"
            class="category"
            list="category-select"
            .value=${live(task.category)}
          />
          <datalist id="category-select">
            ${this.renderCategoryChoices()}
          </datalist>
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
    );
  }
  static open(task, handlers) {
    this.createModal(task, handlers);
    Overlay.show();
    this.getModal().classList.add('active');
  }
  static close() {
    if (this.isOpen()) {
      Overlay.hide();
      this.getModal().classList.remove('active');
    }
  }
  static setFormCategoriesChoices(categories) {
    this.categoriesChoices = categories;
  }
}
