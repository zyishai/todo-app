/// <reference types="cypress" />

it('when clicking on task done label, the view is updated accordingly', () => {
    cy.visit('http://localhost:1234');

    // adding task
    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul li').first().contains('Example task');
    cy.get('.tasks ul li').first().within(() => {
        cy.get('input[type="checkbox"]').should('not.be.checked');
        cy.get('label').click();
        cy.get('input[type="checkbox"]').should('be.checked');
    });

    cy.end();
});