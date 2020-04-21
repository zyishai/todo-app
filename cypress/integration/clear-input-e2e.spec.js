/// <reference types="cypress" />

it('after submitting the "add task" form, the input is cleared', () => {
    cy.visit('http://localhost:1234');

    // remove the created tasks
    cy.document().clearTaskItems();

    cy.get('.input > input').type('Example task');
    cy.get('.input > input').should('have.value', 'Example task');
    cy.get('form .btn[type="submit"]').click();
    cy.get('.input > input').should('have.value', '');

    cy.end();
});