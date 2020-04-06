/// <reference types="cypress" />

it('when double clicking task text, the task should move to edit mode', () => {
    cy.visit('http://localhost:1234');

    // add a task
    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();

    cy.get('.tasks ul li').first().find('.text input[type="text"]').should('not.be.visible');

    // enter "edit mode"
    cy.get('.tasks ul li').first().find('.text span').dblclick();
    cy.get('.tasks ul li').first().find('.text input[type="text"]')
        .should('be.visible')
        .should('have.value', 'Example task')
        .type('{selectall}Example task (edited)'); // edit task content

    cy.get('.tasks ul li').first().find('label').click();

    cy.get('.tasks ul li').first().find('.text span').should('have.text', 'Example task');
    cy.get('.tasks ul li').first().find('.text input[type="text"]').should('not.be.visible');
    cy.get('.tasks ul li').first().find('input[type="checkbox"]').should('be.checked');

    cy.end();
});