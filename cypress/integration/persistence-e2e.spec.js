/// <reference types="cypress" />

describe('Persistence', () => {
    beforeEach(() => {
        cy.cleanStart();
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