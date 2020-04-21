/// <reference types="cypress" />

describe('Persistence', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('_pouch_test');
        cy.visit('http://localhost:1234');

        // remove any previous tasks
        cy.document().clearTaskItems();
    });

    it('should persist a task after reload', () => {
        cy.addTask('Example task');
        cy.contains('Example task');

        cy.reload();

        cy.contains('Example task');
    });

    afterEach(() => {
        cy.end();
    });
});