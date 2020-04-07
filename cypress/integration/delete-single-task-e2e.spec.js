/// <reference types="cypress" />

it('when clicking on the garbage icon the task should be deleted', () => {
    cy.visit('http://localhost:1234');

    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul').should('contain.text', 'Example task');

    cy.get('.tasks ul li').first().find('.text .delete').click();
    cy.wait(500);

    cy.get('.tasks ul').should('not.contain.text', 'Example task');

    cy.reload();

    cy.get('.tasks ul').should('not.contain.text', 'Example task');

    cy.end();
});