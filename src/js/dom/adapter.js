/**
 * This file have no tests, because it is using `lit-html` (for now)
 * and it is based on the DOM, so it is intended to use in browsers.
 * I tried to compile this library for use in tests but I failed.
 * Until I figure out what is the problem, I'm going to
 * implement this as a thin layer above `lit-html` so to minimize
 * the risk of errors from this layer.
 */
import {TaskForm} from './task-form';
import {TaskEditModal} from './task-edit-modal';
import {TaskList} from './task-list';
import {IntroPage} from './intro-page';
import {TasksPage} from './tasks-page';
import {UserLoginModal} from './user-login-modal';
import {CategoryList} from './category-list';

class Adapter {
  /** ===PUBLIC API=== */
  static initGlobal() {
    UserLoginModal.init();
  }
  static renderIntroPage() {
    IntroPage.render();
  }
  static renderTasksPage() {
    TasksPage.render();
  }
  static onAddNewTaskRequest(newTaskRequestHandler) {
    TaskForm.onSubmit(newTaskRequestHandler);
  }
  static setFormCategoriesChoices(choices) {
    TaskForm.setFormCategoriesChoices(choices);
  }
  static onClearFinishedTasksRequest(clearFinishedTasksRequestHandler) {
    TaskList.getClearFinishedTasksButton().addEventListener('click', (e) => {
      e.preventDefault();
      clearFinishedTasksRequestHandler();
    });
  }
  static onLoginRequest(loginRequestHandler) {
    UserLoginModal.onLogin(loginRequestHandler);
  }
  static getTaskInputValue() {
    return TaskEditModal.getValue();
  }
  static renderCategoriesList(categories, userDefinedHandlers = {}) {
    const defaultHandlers = {};
    const handlers = {
      ...defaultHandlers,
      ...userDefinedHandlers,
    };
    return CategoryList.renderList(categories, handlers);
  }
  static renderTasksList(tasks, userDefinedHandlers = {}) {
    const defaultHandlers = {
      taskStatusChangeRquestHandler: () => {},
      taskContentStartEditRequestHandler: this.activateTaskEditMode.bind(this),
      taskContentEndEditRequestHandler: this.activateTaskDisplayMode.bind(this),
      deleteTaskRequestHandler: () => {},
    };
    const handlers = {
      ...defaultHandlers,
      ...userDefinedHandlers,
    };
    return TaskList.renderList(tasks, handlers);
  }
  static activateTaskDisplayMode() {
    TaskEditModal.close();
  }
  static activateTaskEditMode(task, userDefinedHandlers) {
    const defaultHandlers = {
      closeWithoutSave: this.activateTaskDisplayMode.bind(this),
      closeAndSave: this.activateTaskDisplayMode.bind(this),
    };
    const handlers = {
      ...defaultHandlers,
      ...userDefinedHandlers,
    };
    TaskEditModal.open(task, handlers);
  }
}

export default Adapter;
