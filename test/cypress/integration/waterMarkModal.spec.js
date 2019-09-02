const ID = {
  INIT: 'initial',
  WATERMARK_APPLIED: 'watermark-applied',
  TEST_RESET: 'test-reset',
  TEST_PERSIST_CHANGE_BEFORE_SAVING: 'test-persist-change-before-saving',
  TEST_PERSIST_CHANGE: 'test-persist-change',
  TEST_PERSIST_CHANGE_EXISTING_WATERMARK: 'test-persist-change-existing-watermark',
};

const WATERMARK = {
  diagonal: {
    fontSize: 52,
    fontFamily: 'sans-serif',
    color: 'red',
    opacity: 100,
    text: 'Watermark',
  },
  headerLeft: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'blue',
    opacity: 100,
    text: 'header left',
  },
  headerRight: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'green',
    opacity: 100,
    text: 'header right',
  },
  headerCenter: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'yellow',
    opacity: 100,
    text: 'header center',
  },
  footerLeft: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'blue',
    opacity: 100,
    text: 'header left',
  },
  footerRight: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'green',
    opacity: 100,
    text: 'header right',
  },
  footerCenter: {
    fontSize: 30,
    fontFamily: 'sans-serif',
    color: 'yellow',
    opacity: 100,
    text: 'header center',
  },
};
/**
 * For these tests to work
 * npm run start must be ran in the UI project
 */

describe('Tests for watermark modal', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window()
      .then({ timeout: 30000 }, $window => new Cypress.Promise(resolve => {
        // Cypress will wait for this Promise to resolve
        const onDocloaded = () => {
          // cleanup
          $window.docViewer.off('documentLoaded', onDocloaded);
          cy.get( '[data-cy="printModal"]').as('printModal');
          // resolve and allow Cypress to continue
          resolve();
        };
        $window.docViewer.on('documentLoaded', onDocloaded);
      }));
  });

  describe('Tests for when there is no existing water mark', () => {
    beforeEach(() => {
      cy.get('[data-element="menuButton"]').click({});
      cy.get('[data-element="printButton"]').click();
      cy.get( '[data-cy="printModal"]').should('visible');
      cy.get( '@printModal').find('.apply-watermark').click();
      cy.get( '[data-cy="watermarkModal"]').as('watermarkModal').should('visible');
    });

    it('Should be able to open watermark modal from print modal',  () => {
      cy.get('@watermarkModal').find('canvas', {timeout: 5000});
      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.INIT);
    });

    it('Should be able to close watermark modal by clicking on close icon', () => {
      cy.get( '[data-element="watermarkModalCloseButton"]').click();
      cy.get( '@watermarkModal').should('not.visible');
    });

    it('Should be able to close watermark modal by clicking outside of it', () => {
      cy.get( '@watermarkModal').click('topLeft');
      cy.get( '@watermarkModal').should('not.visible');
    });

    it('Should be able to apply watermark', () => {
      cy.get('@watermarkModal').find('form').within(() => {
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

      cy.get('@watermarkModal').find('canvas', {timeout: 5000});

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.WATERMARK_APPLIED);
      cy.get('@watermarkModal').find('.ok.button').click();
    });

    it('should be able to persist location settings before saving', () => {
      const someNumber = 2;
      cy.get('@watermarkModal').find('form').within(() => {
        cy.get('select').first().find('option').eq(someNumber).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
        cy.get('.text-input').type('Pamela');
        cy.get('select').last().find('option').eq(11).invoke('val').then((val) => {
          cy.get('select').last().select(val);
          cy.get('select').first().focus().blur();
        });
      });

      // wait for changes to canvas
      cy.timeout(1000);

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);

      cy.get('@watermarkModal').find('form').within(() => {
        cy.get('select').first().find('option').eq(0).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
  
        cy.get('select').first().find('option').eq(someNumber).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
      });

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);

      
    });

    it('should be able to persist changes on save', () => {
      cy.get('@watermarkModal').find('form').within(() => {
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

      // wait for changes to canvas
      cy.timeout(1000);

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE);

      cy.get('@watermarkModal').find('.ok.button').click();

      cy.get( '@watermarkModal').should('not.visible');

      cy.get( '@printModal').find('.apply-watermark').click();

      cy.get( '@watermarkModal').should('visible');

      cy.get('@watermarkModal').find('canvas', {timeout: 5000});

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE);
    });

    it('Should be able to use reset button', () => {
      cy.get('@watermarkModal').find('canvas', {timeout: 5000});

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_RESET);

      cy.get('@watermarkModal').find('form').within(() => {
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

      cy.get('@watermarkModal').find('.ok.button').click();

      cy.get( '@printModal').find('.apply-watermark').click();

      cy.get('@watermarkModal').find('canvas', {timeout: 5000});

      cy.get('@watermarkModal').find('.reset.button').click();
      // wait for changes to canvas
      cy.timeout(2000);

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_RESET);

      cy.get('@watermarkModal').find('.ok.button').click();

      cy.get( '@printModal').find('.apply-watermark').click();

      cy.get('@watermarkModal').find('canvas', {timeout: 5000});

      cy.get('@watermarkModal').find('.form-container').matchImageSnapshot(ID.TEST_RESET);
    });
  });

  describe(('Tests for when there is existing watermark'), () => {
    beforeEach(() => {
      cy.window()
        .then({ timeout: 30000 }, window => {
          window.docViewer.setWatermark(WATERMARK);

          window.docViewer.refreshAll();
          window.docViewer.updateView();
        });
    });

    it('Should not be able to see watermark modal button', () => {
      cy.get('[data-element="menuButton"]').click({});
      cy.get('[data-element="printButton"]').click();
      cy.get( '@printModal').should('visible');
      cy.get( '@printModal').find('.apply-watermark').should('not.visible');
    });

    it('Should be able to see watermark modal button when existing watermark dissapear', () => {
      cy.window()
        .then((window) => {
          window.docViewer.setWatermark({});

          window.docViewer.refreshAll();
          window.docViewer.updateView();

          cy.get('[data-element="menuButton"]').click({});
          cy.get('[data-element="printButton"]').click();
          cy.get( '@printModal').should('visible');

          cy.get( '@printModal').find('.apply-watermark').should('visible');
        });
    });

    it('Should be able to persist watermark modal changes when existing watermark appear/dissapear', () => {
      cy.window()
        .then(async(window) => {
          window.docViewer.setWatermark({});

          window.docViewer.refreshAll();
          window.docViewer.updateView();

          await window.docViewer.getWatermark();

          cy.get('[data-element="menuButton"]').click();
          cy.get('@printModal').click();
          cy.get( '@printModal').should('visible');

          cy.get( '@printModal').find('.apply-watermark').click();

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
    
          // wait for changes to canvas
          cy.timeout(1000);
    
          cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_EXISTING_WATERMARK);
          cy.get('[data-element="watermarkModal"]').find('.ok.button').click();

          cy.get('[data-element="printModalCloseButton"]').click()
            .then(async() => {
              window.docViewer.setWatermark(WATERMARK);
              window.docViewer.refreshAll();
              window.docViewer.updateView();

              await window.docViewer.getWatermark();
            });

          cy.get('[data-element="menuButton"]').click();
          cy.get('[data-element="printButton"]').click();
          cy.get( '@printModal').find('.apply-watermark').should('not.visible');

          cy.get('[data-element="printModalCloseButton"]').click()
            .then(async() => {
              window.docViewer.setWatermark({});
              window.docViewer.refreshAll();
              window.docViewer.updateView();

              await window.docViewer.getWatermark();
            });

          cy.get('[data-element="menuButton"]').click();
          cy.get('[data-element="printButton"]').click();
          cy.get( '@printModal').find('.apply-watermark').should('visible');

          cy.get( '@printModal').find('.apply-watermark').click();

          // wait for canvas to load
          cy.get('[data-element="watermarkModal"]').find('canvas', {timeout: 5000});

          cy.get('[data-element="watermarkModal"]').find('.form-container').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_EXISTING_WATERMARK);

        });
    });
  });
});