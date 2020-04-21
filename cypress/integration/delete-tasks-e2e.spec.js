/// <reference types="cypress" />

describe('Deleting tasks', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('_pouch_test');
        cy.visit('http://localhost:1234');

        // remove any previous tasks
        cy.document().clearTaskItems();
    });

    it('should delete a task when clicking the garbage icon of that task', () => {
        cy.addTask('Example task');

        cy.contains('Example task');

        cy.queryTasks().withContent('Example task').deleteTask();

        cy.get('.tasks ul').should('not.contain.text', 'Example task');

        cy.reload();

        cy.get('.tasks ul').should('not.contain.text', 'Example task');
    });

    it('should remove all the finished tasks when clicking the `clear all finished tasks` button', () => {
        cy.addTask('First task');

        cy.addTask('Second task');

        cy.contains('First task');
        cy.contains('Second task');

        cy.queryTasks().withContent('Second task').toggleState();
        cy.get('.tasks .clear').click();

        cy.contains('First task');
        cy.get('.tasks ul').should('not.contain.text', 'Second task');

        cy.reload();

        cy.contains('First task');
        cy.get('.tasks ul').should('not.contain.text', 'Second task');
    });

    afterEach(() => {
        cy.end();
    });
});