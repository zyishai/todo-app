/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Clear all previous task items. Recommended to first remove
 * all local entries (e.g `indexedDB.deleteDatabase('...')`).
 */
Cypress.Commands.add('cleanStart', () => {
    indexedDB.deleteDatabase('_pouch_test');
    cy.visit('http://localhost:1234');
    cy.document().then(doc => {
        doc.querySelectorAll('.tasks ul li').forEach(li => {
            li.remove();
        });
    });
});

/**
 * Add task with content.
 * 
 * @param {String} content - text for the task
 */
Cypress.Commands.add('addTask', (content) => {
    cy.get('form .input > input').type(content);
    cy.get('form .btn[type="submit"]').click();
});

Cypress.Commands.add('queryTasks', () => {
    cy.get('.tasks ul li');
});

/**
 * Select the task item that contains some text.
 * Example: `cy.withContent('My first task')`.
 */
Cypress.Commands.add('withContent', {prevSubject: true}, (tasks, content) => {
    return cy.wrap(tasks).contains(content).parentsUntil('.tasks ul li').last().parent();
});

/**
 * Toggle the state of a task item.
 */
Cypress.Commands.add('toggleState', { prevSubject: true }, (task) => {
    cy.wrap(task).find('label').click();
    return cy.wrap(task);
});

Cypress.Commands.add('verifyChecked', { prevSubject: true }, (task) => {
    cy.wrap(task).find('input[type="checkbox"]').should('be.checked');
    return cy.wrap(task);
});

Cypress.Commands.add('verifyNotChecked', { prevSubject: true }, (task) => {
    cy.wrap(task).find('input[type="checkbox"]').should('not.be.checked');
    return cy.wrap(task);
});

Cypress.Commands.add('openTaskActionsMenu', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text .content').click();
    return cy.get('.task-actions-modal');
});
// ------------- TO BE CHANGED AS NECCESSARY -----------------
Cypress.Commands.add('activateEditMode', { prevSubject: true }, (task) => {
    cy.wrap(task).openTaskActionsMenu().contains('Edit task').click();
    cy.wrap(task).find('input[type="checkbox"]').invoke('attr', 'id').then(id => {
        cy.setCookie('currentTaskId', id);
    });
    return cy.get('.edit-task-modal');
});

Cypress.Commands.add('exitEditModeAndSave', { prevSubject: true }, (editModal) => {
    cy.wrap(editModal).find('.actions > .confirm').click();
    return cy.getCookie('currentTaskId').then(cookie => {
        return cy.get(`#${cookie.value}`).parent();
    });
});

Cypress.Commands.add('exitEditModeWithoutSave', { prevSubject: true }, (editModal) => {
    cy.wrap(editModal).find('.actions .cancel').click();
    return cy.getCookie('currentTaskId').then(cookie => {
        return cy.get(`#${cookie.value}`).parent();
    });
});

Cypress.Commands.add('verifyDisplayMode', { prevSubject: true }, (element) => {
    cy.get('.edit-task-modal').should('not.have.class', 'active');
    return cy.wrap(element);
});

Cypress.Commands.add('verifyEditMode', { prevSubject: true }, (element) => {
    cy.get('.edit-task-modal').should('have.class', 'active');
    return cy.wrap(element);
});

Cypress.Commands.add('updateValue', { prevSubject: true }, (editModal, value) => {
    cy.wrap(editModal).find('main textarea').type(value);
    return cy.wrap(editModal);
});

Cypress.Commands.add('assertValue', { prevSubject: true }, (editModal, value) => {
    cy.wrap(editModal).find('main textarea').should('have.value', value);
    return cy.wrap(editModal);
});

Cypress.Commands.add('assertContent', { prevSubject: true }, (task, value) => {
    cy.wrap(task).find('.text .content').should('contain.text', value);
    return cy.wrap(task);
});

Cypress.Commands.add('deleteTask', { prevSubject: true }, (task) => {
    cy.wrap(task).openTaskActionsMenu().contains('Delete task').click();
    return cy.wrap(task);
});