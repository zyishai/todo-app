/// <reference types="cypress" />

describe('Toggling tasks state', () => {
    beforeEach(() => {
        cy.cleanStart();
    });

    it('should mark task as done when clicking the label of a task', () => {
        // adding task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .verifyNotChecked()
            .toggleState()
            .verifyChecked();
    });

    it('should reset task state when clicking the label twice', () => {
        // adding task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .toggleState()
            .toggleState()
            .verifyNotChecked();
    });

    afterEach(() => {
        cy.end();
    });
});