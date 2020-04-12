/// <reference types="cypress" />

it('should preserve added tasks in localStorage', () => {
    cy.visit('http://localhost:1234');

    // making sure no previous tasks exists that might fail my test
    localStorage.clear();

    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();
    cy.contains('Example task').should(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks[0].content).to.be.equal('Example task');
    });

    // clearing my mess
    localStorage.clear();

    cy.end();
});

it('should display tasks from localStorage', () => {
    cy.visit('http://localhost:1234');

    // making sure no previous tasks exists that might fail my test
    localStorage.clear();

    cy.get('.input > input').type('Example task');
    cy.get('.btn').click();
    cy.contains('Example task');

    cy.reload();

    cy.contains('Example task');

    // clearing my mess
    localStorage.clear();

    cy.end();
});