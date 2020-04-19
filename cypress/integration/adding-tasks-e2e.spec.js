/// <reference types="cypress" />

describe('Adding tasks', () => {
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

    it('should be able to add multiple tasks and control them separately', () => {
        cy.get('.input > input').type('First task');
        cy.get('.btn').click();

        cy.get('.input > input').type('Second task');
        cy.get('.btn').click();

        // control state
        cy.withContent('.tasks ul li', 'First task').find('label').click();
        cy.withContent('.tasks ul li', 'First task').find('input[type="checkbox"]').should('be.checked');
        cy.withContent('.tasks ul li', 'Second task').find('input[type="checkbox"]').should('not.be.checked');

        // control content editing
        cy.withContent('.tasks ul li', 'Second task').find('.text .content').dblclick();
        cy.withContent('.tasks ul li', 'First task').find('.text input').should('not.be.visible');
        cy.withContent('.tasks ul li', 'Second task').find('.text input').should('be.visible');
        cy.withContent('.tasks ul li', 'Second task').find('.text input').type('{selectall}Changed').dblclick();
        cy.get('.tasks ul').should('contain.text', 'First task');
        cy.get('.tasks ul').should('contain.text', 'Changed');
        cy.get('.tasks ul').should('not.contain.text', 'Second task');
    });

    afterEach(() => {
        cy.end();
    });
});