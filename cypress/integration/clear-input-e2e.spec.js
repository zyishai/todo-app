/// <reference types="cypress" />

it('after submitting the "add task" form, the input is cleared', () => {
    cy.cleanStart();

    cy.addTask('Example');

    cy.get('#task-list header').contains('button', 'Add item').click();
    cy.get('.new-task-modal main textarea').should('have.value', '');
    // cy.get('.input > input').type('Example task');
    // cy.get('.input > input').should('have.value', 'Example task');
    // cy.get('form .btn[type="submit"]').click();
    // cy.get('.input > input').should('have.value', '');

    cy.end();
});