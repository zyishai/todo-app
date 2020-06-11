/// <reference types="cypress" />

describe('Editing task with double click', () => {
    beforeEach(() => {
        cy.cleanStart();
    });

    // ****************************
    // This test is not possible with current configurations, because
    // while we in "edit mode" we cannot click on anything outside the
    // "edit task" modal.
    // ****************************
    // it('should discard changes when toggling the task while in edit mode', () => {
    //     // add a task
    //     cy.addTask('Example task');

    //     cy.queryTasks().withContent('Example task')
    //         .verifyDisplayMode()
    //         .activateEditMode()
    //         .verifyEditMode()
    //         .assertValue('Example task')
    //         .updateValue('{selectall}Example task (edited)')
    //         .toggleState()
    //         .assertContent('Example task')
    //         .verifyDisplayMode()
    //         .verifyChecked();
    // });

    it('should save the changes when clicking the `confirm` button', () => {
        // add a task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .verifyDisplayMode()
            .activateEditMode()
            .verifyEditMode()
            .assertValue('Example task')
            .updateValue('{selectall}Example task (edited)')
            .exitEditModeAndSave()
            .assertContent('Example task (edited)')
            .verifyDisplayMode();
    });

    it('should not save the changes when clicking the `cancel` button', () => {
        // add a task
        cy.addTask('Example task');

        cy.queryTasks().withContent('Example task')
            .verifyDisplayMode()
            .activateEditMode()
            .verifyEditMode()
            .assertValue('Example task')
            .updateValue('{selectall}Example task (edited)')
            .exitEditModeWithoutSave()
            .assertContent('Example task')
            .verifyDisplayMode();
    });

    afterEach(() => {
        cy.end();
    });
});