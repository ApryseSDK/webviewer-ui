/**
 * For these tests to work
 * npm run start must be ran in the UI project
 */
describe ('Tests for watermark modal', () => {
  beforeEach(() => {
    cy.visit ('/');
  });
  it ('Visit the app', () => {
    cy.get('[data-element="menuButton"]');
  });
});