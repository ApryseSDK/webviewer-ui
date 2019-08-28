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
    cy.wait('@getAccount').then((xhr) => {
      assert.isNotNull(xhr.response.body.data, '1st API call has data');
    });
    cy.wait('@getAccount').then((xhr) => {
      assert.isNotNull(xhr.response.body.data, '2nd API call has data');

      cy.window().should('have.property', 'appReady', true);
    });

    // cy.get('[data-element="menuButton"]').click();
    // cy.get( '[data-element="loadingModal"]').should("not.visible");
    // console.log(cy.window().docViewer);

    // cy.window().should('have.property', 'appReady', true);
  });

  it ('Visit the app', () => {
    // cy.get( '[data-element="progressModal"]').should("not.visible");
    cy.get('[data-element="menuButton"]').click();
  });
});