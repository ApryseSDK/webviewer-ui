/**
 * For these tests to work
 * npm run start must be ran in the UI project
 */
describe ('Tests for watermark modal', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    }).as('getAccount');
    cy.visit ('/');
    cy.wait('@getAccount');
    cy.wait('@getAccount').then((xhr) => {
      cy.window().should('have.property', 'appReady', true);
    });
  });

  it ('Should be able to open watermark modal from print modal', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");
  });
});