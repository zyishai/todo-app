/// <reference types="cypress" />

it('when clicking on task done label twice, the task should toggle back to undone state', () => {
    cy.visit('http://localhost:1234');

    // adding task
    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul li').first().find('label').click().click();

    cy.get('.tasks ul li').first().find('input[type="checkbox"]').should('not.be.checked');
});