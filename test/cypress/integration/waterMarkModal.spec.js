/**
 * For these tests to work
 * npm run start must be ran in the UI project
 */
describe ('Tests for watermark modal', () => {
  // it(() => {
  //   cy.server();
  //   cy.route({
  //     method: 'GET',
  //     url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
  //   }).as('getAccount');
  // });
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      status: 206,
    }).as('temp1');
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      status: 200,
    }).as('temp2');
    cy.visit ('/');

    cy.wait(['@temp2']).then((xhr) => {
      // assert.isNotNull(xhr.response.body.data, '1st API call has data');
      cy.window({ timeout: 10000 }).should('have.property', 'appReady', true);
    });
  });

  xit ('Should be able to open watermark modal from print modal', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");
  });

  xit ('Should be able to close watermark modal by clicking on close icon', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");

    cy.get( '[data-element="watermarkModalCloseButton"]').click();

    cy.get( '[data-element="watermarkModal"]').should("not.visible");
  });

  xit ('Should be able to close watermark modal by clicking outside of it', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");

    cy.get( '[data-element="watermarkModal"]').click('topLeft');

    cy.get( '[data-element="watermarkModal"]').should("not.visible");
  });

  it ('Should be able to apply watermark', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");

        // TODO try not to use wait
        cy.wait(500);

    // cy.get('[data-element="watermarkModal"]').find('.form-container').first().screenshot();
    cy.get('[data-element="watermarkModal"]').find('.form-container').first().matchImageSnapshot('b4-watermark');

    cy.get('[data-element="watermarkModal"]').find('form').within(() => {
      cy.get('.text-input').type('Pamela') // Only yield inputs within form
      // cy.get('textarea').type('is a developer') // Only yield textareas within form
      cy.get('select').first().find('option').eq(2).invoke('val').then((val) => {
        // TODO https://stackoverflow.com/questions/51943474/how-to-use-result-of-length-in-selector-cypress
        cy.get('select').first().select(val);
      });
      cy.get('select').last().find('option').eq(11).invoke('val').then((val) => {
        // TODO https://stackoverflow.com/questions/51943474/how-to-use-result-of-length-in-selector-cypress
        cy.get('select').last().select(val);
      });
    });
    // TODO try not to use wait
    cy.wait(500);
    // cy.get('[data-element="watermarkModal"]').find('.form-container').first().screenshot();
    cy.get('[data-element="watermarkModal"]').find('.form-container').first().matchImageSnapshot('after-watermark');
    // cy.screenshot();

    // cy.window().then((window) => {
    //   console.log(window.docViewer);
    // });

    cy.get('[data-element="watermarkModal"]').find('.ok.button').click();

    cy.get( '[data-element="watermarkModal"]').should("not.visible");

    // cy.get('[data-element="watermarkModal"]').find('.text-input').type('blah');
    // const dropdowns = cy.get('[data-element="watermarkModal"]').find('select');

    // if (dropdowns) {
    //   dropdowns.forEach(dropdown => dropdown.eq(2));
    // }
  });
});