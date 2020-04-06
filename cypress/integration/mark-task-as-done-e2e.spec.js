/// <reference types="cypress" />

it('when marking task as done, the view is updated accordingly', () => {
    cy.visit('http://localhost:1234');

    // adding task
    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul li').first().contains('Example task');
    cy.get('.tasks ul li').first().within(() => {
        cy.get('label').click();
        cy.get('input[type="checkbox"]').should('be.checked');
    });

    cy.end();
});