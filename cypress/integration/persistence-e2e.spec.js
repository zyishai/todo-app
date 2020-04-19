/// <reference types="cypress" />

describe('Persistence', () => {
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

    it('should persist a task after reload', () => {
        cy.get('.input > input').type('Example task');
        cy.get('.btn[type="submit"]').click();
        cy.contains('Example task');

        cy.reload();

        cy.contains('Example task');
    });

    afterEach(() => {
        cy.end();
    });
});