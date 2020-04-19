/// <reference types="cypress" />

describe('Deleting tasks', () => {
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

    it('should delete a task when clicking the garbage icon of that task', () => {
        cy.get('.input > input').type('Example task');
        cy.get('.btn').click();

        cy.get('.tasks ul').should('contain.text', 'Example task');

        cy.withContent('.tasks ul li', 'Example task').find('.text .delete').click();
        cy.wait(500);

        cy.get('.tasks ul').should('not.contain.text', 'Example task');

        cy.reload();

        cy.get('.tasks ul').should('not.contain.text', 'Example task');
    });

    it('should remove all the finished tasks when clicking the `clear all finished tasks` button', () => {
        cy.get('.input > input').type('First task');
        cy.get('.btn').click();

        cy.get('.input > input').type('Second task');
        cy.get('.btn').click();

        cy.get('.tasks ul').should('contain.text', 'First task');
        cy.get('.tasks ul').should('contain.text', 'Second task');

        cy.withContent('.tasks ul li', 'Second task').find('label').click();
        cy.get('.tasks .clear').click();

        cy.get('.tasks ul').should('contain.text', 'First task');
        cy.get('.tasks ul').should('not.contain.text', 'Second task');

        cy.reload();

        cy.get('.tasks ul').should('contain.text', 'First task');
        cy.get('.tasks ul').should('not.contain.text', 'Second task');
    });

    afterEach(() => {
        cy.end();
    });
});