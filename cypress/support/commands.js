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
Cypress.Commands.add('clearTaskItems', {
    prevSubject: 'document'
}, (doc) => {
    doc.querySelectorAll('.tasks ul li').forEach(li => {
        li.querySelector('.delete').click();
        li.remove();
    });
});

/**
 * Add task with content.
 * 
 * @param {String} content - text for the task
 */
Cypress.Commands.add('addTask', (content) => {
    cy.get('.input > input').type(content);
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

Cypress.Commands.add('activateEditMode', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text .content').dblclick();
    return cy.wrap(task);
});

Cypress.Commands.add('deactivateEditMode', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text input').dblclick();
    return cy.wrap(task);
});

Cypress.Commands.add('verifyDisplayMode', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text .content').should('be.visible');
    return cy.wrap(task);
});

Cypress.Commands.add('verifyEditMode', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text input').should('be.visible');
    return cy.wrap(task);
});

Cypress.Commands.add('updateValue', { prevSubject: true }, (task, value) => {
    cy.wrap(task).find('.text input').type(value);
    return cy.wrap(task);
});

Cypress.Commands.add('assertValue', { prevSubject: true }, (task, value) => {
    cy.wrap(task).find('.text input').should('have.value', value);
    return cy.wrap(task);
});

Cypress.Commands.add('assertContent', { prevSubject: true }, (task, value) => {
    cy.wrap(task).find('.text .content').should('contain.text', value);
    return cy.wrap(task);
});

Cypress.Commands.add('deleteTask', { prevSubject: true }, (task) => {
    cy.wrap(task).find('.text .delete').click();
    return cy.wrap(task);
});