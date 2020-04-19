/// <reference types="cypress" />

it('after submitting the "add task" form, the input is cleared', () => {
    cy.visit('http://localhost:1234');

    // remove the created tasks
    cy.document().then(doc => {
        doc.querySelectorAll('.tasks ul li').forEach(li => {
            li.remove();
        });
    });

    cy.get('.input > input').type('Example task');
    cy.get('.input > input').should('have.value', 'Example task');
    cy.get('.btn').click();
    cy.get('.input > input').should('have.value', '');

    cy.end();
});