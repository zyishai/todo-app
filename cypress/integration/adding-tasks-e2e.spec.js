/// <reference types="cypress" />

describe('Adding tasks', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('_pouch_test');
        cy.visit('http://localhost:1234');

        // remove any previous tasks
        cy.document().clearTaskItems();
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
        cy.queryTasks().withContent('Second task').activateEditMode();

        cy.queryTasks().withContent('First task').verifyDisplayMode();
        
        cy.queryTasks().withContent('Second task').verifyEditMode();
        
        cy.queryTasks().withContent('Second task').updateValue('{selectall}Changed');
        
        cy.queryTasks().withContent('Second task').deactivateEditMode();
        
        cy.contains('First task');
        
        cy.contains('Changed');
        
        cy.get('.tasks ul').should('not.contain.text', 'Second task');
    });

    afterEach(() => {
        cy.end();
    });
});