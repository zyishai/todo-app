import {html, render} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {classMap} from 'lit-html/directives/class-map';
import {DomUtils} from './utils';

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
        <li class=${classMap(categoryItemClasses)}>
          <a href="#">${category.displayName}</a>
        </li>
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
}
