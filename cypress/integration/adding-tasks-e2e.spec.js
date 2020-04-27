/// <reference types="cypress" />

describe('Adding tasks', () => {
    beforeEach(() => {
        cy.cleanStart();
    });

    it('should be able to add multiple tasks and control them separately', () => {
        cy.addTask('First task');

        cy.addTask('Second task');

        // control state
        cy.queryTasks().withContent('First task')
            .toggleState()
            .verifyChecked();
        
        cy.queryTasks().withContent('Second task').verifyNotChecked();

        // control content editing
        cy.queryTasks().withContent('Second task')
            .activateEditMode()
            .verifyEditMode()
            .updateValue('{selectall}Changed')
            .exitEditModeAndSave();
        
        cy.contains('First task');
        
        cy.contains('Changed');
        
        cy.get('.tasks ul').should('not.contain.text', 'Second task');
    });

    afterEach(() => {
        cy.end();
    });
});