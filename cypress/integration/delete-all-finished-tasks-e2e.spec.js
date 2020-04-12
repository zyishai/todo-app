/// <reference types="cypress" />

it('when clicking the delete all tasks button, all the finished tasks should be deleted', () => {
    cy.visit('http://localhost:1234');

    cy.get('.input > input').type('First task');
    cy.get('.btn').click();

    cy.get('.input > input').type('Second task');
    cy.get('.btn').click();

    cy.get('.tasks ul').should('contain.text', 'First task');
    cy.get('.tasks ul').should('contain.text', 'Second task');

    cy.get('.tasks ul li').eq(1).find('label').click();
    cy.get('.tasks .clear').click();

    cy.get('.tasks ul').should('contain.text', 'First task');
    cy.get('.tasks ul').should('not.contain.text', 'Second task');

    cy.reload();

    cy.get('.tasks ul').should('contain.text', 'First task');
    cy.get('.tasks ul').should('not.contain.text', 'Second task');

    cy.end();
});