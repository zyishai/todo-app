/// <reference types="cypress" />

describe('Deleting tasks', () => {
  beforeEach(() => {
    cy.cleanStart();
  });

  it('should delete a task when clicking the garbage icon of that task', () => {
    cy.addTask('Example task');

    cy.contains('Example task');

    cy.queryTasks().withContent('Example task').deleteTask();

    cy.queryTasks().should('not.contain.text', 'Example task');

    cy.reload();
    cy.login();

    cy.queryTasks().should('not.contain.text', 'Example task');
  });

  it('should remove all the finished tasks when clicking the `clear all finished tasks` button', () => {
    cy.addTask('First task');

    cy.addTask('Second task');

    cy.contains('First task');
    cy.contains('Second task');

    cy.queryTasks().withContent('Second task').toggleState();
    cy.get('#task-list section footer').contains('button', 'Remove').click();

    cy.contains('First task');
    cy.queryTasks().should('not.contain.text', 'Second task');

    cy.reload();
    cy.login();

    cy.contains('First task');
    cy.queryTasks().should('not.contain.text', 'Second task');
  });

  afterEach(() => {
    cy.end();
  });
});
