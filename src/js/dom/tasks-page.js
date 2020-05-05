import { render, html } from 'lit-html';

import { TaskForm } from "./task-form";
import { DomUtils } from './utils';
import plusGrayIcon from '../../img/plus_gray.svg';
import plusWhiteIcon from '../../img/plus_white.svg';
import trashIcon from '../../img/trash.svg';

export class TasksPage {
    static _getContentDiv() {
        return DomUtils._getDOMElement('.container .content');
    }
    static init() {
        render(html`
            <div class="main-page">
                <nav id="categories">
                    <header>
                        <h2>Categories</h2>
                        <button class="link-btn icon-btn">
                            <span class="icon">
                                <img src=${plusGrayIcon} alt="plus icon">
                            </span>
                            <span class="text">
                                Add
                            </span>
                        </button>
                    </header>
                    <ul>
                        <!-- <li class="active">
                            <a href="#">Default</a>
                        </li> -->
                    </ul>
                    <div class="new-category">
                        <input type="text" placeholder="Name of category">
                        <div class="actions">
                            <button class="link-btn">
                                <span class="text">
                                    cancel
                                </span>
                            </button>
                            <button class="link-btn">
                                <span class="text text-primary">
                                    add
                                </span>
                            </button>
                        </div>
                    </div>
                </nav>
                <main id="task-list">
                    <header>
                        <h1>Default</h1>
                        <button class="btn btn-primary icon-btn" @click=${() => TaskForm.openForm()}>
                            <span class="icon">
                                <img src=${plusWhiteIcon} alt="plus icon">
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
                                    <img src=${trashIcon} alt="trash icon">
                                </span>
                                <span class="text">
                                    Remove finished items
                                </span>
                            </button>
                        </footer>
                    </section>
                </main>
            </div>
        `, this._getContentDiv());
    }
}