import {html, render} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {classMap} from 'lit-html/directives/class-map';
import {DomUtils} from './utils';
import trashIcon from '../../img/trash.svg';

export class CategoryList {
  static getList() {
    return DomUtils._getDOMElement('#categories > nav > ul');
  }
  static getListTitle() {
    return DomUtils._getDOMElement('#task-list > header > h1');
  }
  static updateTitle(category) {
    return render(html`${category.displayName}`, this.getListTitle());
  }
  static renderCategory(handlers) {
    return (category) => {
      let categoryItemClasses = {active: category.selected};
      if (category.selected) {
        this.updateTitle(category);
      }
      return html`
        <div class="item">
          ${category.name !== 'Default'
            ? html`<button
                class="link-btn icon-btn delete hidden"
                @click=${() =>
                  handlers.categoryDeleteRequestHandler(category.name)}
              >
                <span class="icon">
                  <img src=${trashIcon} alt="trash icon" />
                </span>
              </button>`
            : html`<div class="delete placeholder hidden"></div>`}
          <li
            class=${classMap(categoryItemClasses)}
            @click=${() => {
              if (!category.selected) {
                handlers.categorySelectedHandler(category.name);
              }
            }}
          >
            <a href="#">${category.displayName}</a>
          </li>
        </div>
      `;
    };
  }
  static renderList(categories, handlers) {
    return render(
      html`${repeat(
        categories,
        (category) => category.name,
        this.renderCategory(handlers),
      )}`,
      this.getList(),
    );
  }
  /**
   * @returns {HTMLButtonElement}
   */
  static getManageButton() {
    return DomUtils._getDOMElement(
      '#categories > nav > header > .actions > button.manage',
    );
  }
  /**
   * @returns {HTMLButtonElement}
   */
  static getDoneButton() {
    return DomUtils._getDOMElement(
      '#categories > nav > header > .actions > button.done',
    );
  }
  /**
   * @returns {HTMLInputElement[]}
   */
  static getCategoryItemsDeleteButton() {
    return DomUtils._getAllDOMElements(
      '#categories > nav > ul > .item > .delete',
    );
  }
  static activateManagementState() {
    this.getManageButton().classList.add('hidden');
    this.getDoneButton().classList.remove('hidden');
    this.getCategoryItemsDeleteButton().forEach((input) => {
      input.classList.remove('hidden');
    });
  }
  static deactivateManagementState() {
    this.getManageButton().classList.remove('hidden');
    this.getDoneButton().classList.add('hidden');
    this.getCategoryItemsDeleteButton().forEach((input) => {
      input.classList.add('hidden');
    });
  }
}
