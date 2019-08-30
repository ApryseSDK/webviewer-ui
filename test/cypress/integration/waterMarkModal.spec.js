
const ID = {
  INIT: 'initial',
  WATERMARK_APPLIED: 'watermark-applied',
  TEST_RESET: 'test-reset'
};
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
      status: 206,
    }).as('temp1');
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      status: 200,
    }).as('temp2');
    cy.visit ('/');
    cy.wait(['@temp2']);
    cy.wait(2500);
  });

  describe('Tests for when there is no existing water mark', () => {
    beforeEach(() => {
      cy.get('[data-element="menuButton"]').click();
      cy.get('[data-element="printButton"]').click();
      cy.get( '[data-element="printModal"]').should('visible');
    });

    it ('Should be able to open watermark modal from print modal', () => {
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
      cy.get( '[data-element="watermarkModal"]').should('visible');
  
      // TODO try not to use wait
      cy.wait(1500);
  
      cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.INIT);
    });
  
    it ('Should be able to close watermark modal by clicking on close icon', () => {
  
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
      cy.get( '[data-element="watermarkModalCloseButton"]').click();
  
      cy.get( '[data-element="watermarkModal"]').should('not.visible');
    });
  
    it ('Should be able to close watermark modal by clicking outside of it', () => {
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
      cy.get( '[data-element="watermarkModal"]').click('topLeft');
      cy.get( '[data-element="watermarkModal"]').should('not.visible');
    });
  
    it.skip ('Should be able to apply watermark', () => {
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
  
      cy.get('[data-element="watermarkModal"]').find('form').within(() => {
        cy.get('.text-input').type('Pamela');
        cy.get('select').first().find('option').eq(2).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
        cy.get('select').last().find('option').eq(11).invoke('val').then((val) => {
          cy.get('select').last().select(val);
          cy.get('select').first().focus().blur();
        });
      });
      // TODO try not to use wait
      cy.wait(1500);
      cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.WATERMARK_APPLIED);
      cy.get('[data-element="watermarkModal"]').find('.ok.button').click();
    });
  
    // TODO write up tests to see that watermark options are persisted
  
    it.skip ('Should be able to use reset button', () => {
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
  
      // TODO try not to use wait
      cy.wait(2000);
  
      cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.TEST_RESET);
  
      cy.get('[data-element="watermarkModal"]').find('form').within(() => {
        cy.get('.text-input').type('Pamela');
        cy.get('select').first().find('option').eq(2).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
        cy.get('select').last().find('option').eq(11).invoke('val').then((val) => {
          cy.get('select').last().select(val);
          cy.get('select').first().focus().blur();
        });
      });
  
      cy.get('[data-element="watermarkModal"]').find('.ok.button').click();
  
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
  
      cy.wait(1500);
  
      cy.get('[data-element="watermarkModal"]').find('.reset.button').click();
  
      // TODO try not to use wait
      cy.wait(1500);
      cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.TEST_RESET);
  
      cy.get('[data-element="watermarkModal"]').find('.ok.button').click();
  
      cy.get( '[data-element="printModal"]').find('.apply-watermark').click();
  
      // TODO try not to use wait
      cy.wait(2000);
  
      cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.TEST_RESET);
    });
  });

  // describe(('Tests for when there is existing watermark'), () => {
  //   beforeEach(() => {

  //     // .then(() => {
  //     //             cy.get('[data-element="menuButton"]').click();
  //     //     cy.get('[data-element="printButton"]').click();
  //     //     cy.get( '[data-element="printModal"]').should('visible');
  //     // });
  //     cy.get('[data-element="menuButton"]').click();
  //     cy.get('[data-element="printButton"]').click();
  //     cy.get( '[data-element="printModal"]').should('visible');
  //   });

  //   it('Should not be able to see watermark modal button', () => {

  //     cy.get( '[data-element="printModal"]').find('.apply-watermark').should('not.visible');
  //   });
  
  //   // it('Should be able to see watermark modal button when existing watermark dissapear', () => {
  //   //   cy.window()
  //   //   .then((window) => {
  //   //     window.docViewer.setWatermark({});
  
  //   //     window.docViewer.refreshAll();
  //   //     window.docViewer.updateView();
  
  //   //     cy.get( '[data-element="printModal"]').find('.apply-watermark').should('visible');
  //   //   });
      
  //   // });
  // });
});