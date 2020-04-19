/// <reference types="cypress" />

describe('Editing task with double click', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('_pouch_test');
        cy.visit('http://localhost:1234');

        // remove any previous tasks
        cy.document().then(doc => {
            doc.querySelectorAll('.tasks ul li').forEach(li => {
                li.querySelector('label').click();
                li.remove();
            });
        });
    });

    it('should discard changes when toggling the task while in edit mode', () => {
        // add a task
        cy.get('.input > input').type('Example task');
        cy.get('.btn[type="submit"]').click();

        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]').should('not.be.visible');

        // enter "edit mode"
        cy.withContent('.tasks ul li', 'Example task').find('.text .content').dblclick();
        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]')
            .should('be.visible')
            .should('have.value', 'Example task')
            .type('{selectall}Example task (edited)'); // edit task content

        cy.withContent('.tasks ul li', 'Example task').find('label').click();

        cy.withContent('.tasks ul li', 'Example task').find('.text .content').should('have.text', 'Example task');
        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]').should('not.be.visible');
        cy.withContent('.tasks ul li', 'Example task').find('input[type="checkbox"]').should('be.checked');
    });

    it('should save the changes when double clicking the edit input', () => {
        // add a task
        cy.get('.input > input').type('Example task');
        cy.get('.btn[type="submit"]').click();

        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]').should('not.be.visible');

        // enter "edit mode"
        cy.withContent('.tasks ul li', 'Example task').find('.text .content').dblclick();
        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]')
            .should('be.visible')
            .should('have.value', 'Example task')
            .type('{selectall}Example task (edited)') // edit task content
            .dblclick(); // exit "edit mode"

        cy.withContent('.tasks ul li', 'Example task').find('.text .content').should('have.text', 'Example task (edited)');
        cy.withContent('.tasks ul li', 'Example task').find('.text input[type="text"]').should('not.be.visible');
    });

    afterEach(() => {
        cy.end();
    });
});