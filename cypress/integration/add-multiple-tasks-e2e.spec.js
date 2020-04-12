/// <reference types="cypress" />

it('should be able multiple tasks and control them independently', () => {
    cy.visit('http://localhost:1234');

    cy.get('.input > input').type('First task');
    cy.get('.btn').click();

    cy.get('.input > input').type('Second task');
    cy.get('.btn').click();

    // control state
    cy.get('.tasks ul li').first().find('label').click();
    cy.get('.tasks ul li').first().find('input[type="checkbox"]').should('be.checked');
    cy.get('.tasks ul li').eq(1).find('input[type="checkbox"]').should('not.be.checked');

    // control content editing
    cy.get('.tasks ul li').eq(1).find('.text .content').dblclick();
    cy.get('.tasks ul li').first().find('.text input').should('not.be.visible');
    cy.get('.tasks ul li').eq(1).find('.text input').should('be.visible');
    cy.get('.tasks ul li').eq(1).find('.text input').type('{selectall}Changed').dblclick();
    cy.get('.tasks ul li').eq(1).find('.text .content').should('have.text', 'Changed');
    cy.get('.tasks ul li').first().find('.text .content').should('have.text', 'First task');

    cy.end();
});