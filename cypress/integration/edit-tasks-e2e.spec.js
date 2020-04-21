/// <reference types="cypress" />

describe('Editing task with double click', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('_pouch_test');
        cy.visit('http://localhost:1234');

        // remove any previous tasks
        cy.document().clearTaskItems()
    });

    it('should discard changes when toggling the task while in edit mode', () => {
        // add a task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .verifyDisplayMode()
            .activateEditMode()
            .verifyEditMode()
            .assertValue('Example task')
            .updateValue('{selectall}Example task (edited)')
            .toggleState()
            .assertContent('Example task')
            .verifyDisplayMode()
            .verifyChecked();
    });

    it('should save the changes when double clicking the edit input', () => {
        // add a task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .verifyDisplayMode()
            .activateEditMode()
            .verifyEditMode()
            .assertValue('Example task')
            .updateValue('{selectall}Example task (edited)')
            .deactivateEditMode()
            .assertContent('Example task (edited)')
            .verifyDisplayMode();
    });

    afterEach(() => {
        cy.end();
    });
});