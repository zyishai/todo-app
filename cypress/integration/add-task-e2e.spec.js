/// <reference types="cypress" />

it('should be displayed on screen', () => {
    cy.visit('http://localhost:1234');
    
    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul').children().contains('Example task');
    
    cy.end();
});