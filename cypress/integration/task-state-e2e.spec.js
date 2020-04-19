/// <reference types="cypress" />

describe('Toggling tasks state', () => {
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

    it('should mark task as done when clicking the label of a task', () => {
        // adding task
        cy.get('.input > input').type('Example task');
        cy.get('.btn[type="submit"]').click();

        cy.withContent('.tasks ul li', 'Example task').within(() => {
            cy.get('input[type="checkbox"]').should('not.be.checked');
            cy.get('label').click();
            cy.get('input[type="checkbox"]').should('be.checked');
        });
    });

    it('should reset task state when clicking the label twice', () => {
        // adding task
        cy.get('.input > input').type('Example task');
        cy.get('.btn[type="submit"]').click();

        cy.withContent('.tasks ul li', 'Example task').within(() => {
            cy.get('label').click().click();
            cy.get('input[type="checkbox"]').should('not.be.checked');
        });
    });

    afterEach(() => {
        cy.end();
    });
});