import "@cypress-audit/lighthouse/commands";
import "@cypress-audit/pa11y/commands";

Cypress.Commands.add("login", () => {
    cy.clearAllCookies
    cy.clearAllLocalStorage
    cy.visit("/");
});