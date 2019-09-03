const ID = {
  INIT: 'initial',
  WATERMARK_APPLIED: 'watermark-applied',
  TEST_RESET: 'test-reset',
  TEST_PERSIST_CHANGE_BEFORE_SAVING: 'test-persist-change-before-saving',
  TEST_PERSIST_CHANGE: 'test-persist-change',
  TEST_PERSIST_CHANGE_EXISTING_WATERMARK: 'test-persist-change-existing-watermark',
};

const CANVAS_TIMEOUT_MS = 5000;

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
          cy.get('[data-element="printModal"]').as('printModal');
          cy.get('[data-element="menuButton"]').as('menuButton');
          cy.get('[data-element="printButton"]').as('printButton');
          // resolve and allow Cypress to continue
          resolve();
        };
        $window.docViewer.on('documentLoaded', onDocloaded);
      }));
  });

  describe('Tests for when there is no existing water mark', () => {
    beforeEach(() => {
      cy.get('@menuButton').click();
      cy.get('@printButton').click();
      cy.get('@printModal').should('visible');
      cy.get('@printModal').find('[data-element="applyWatermark"]').as('openWatermarkModal').click();
      cy.get('[data-element="watermarkModal"]').as('watermarkModal').should('visible');

      cy.get('[data-element="watermarkModalCloseButton"]').as('watermarkModalCloseButton');
      cy.get('@watermarkModal').find('[data-element="formContainer"]').as('formContainer');
      cy.get('@watermarkModal').find('[data-element="submit"]').as('submit');
      cy.get('@watermarkModal').find('[data-element="cancel"]').as('cancel');
      cy.get('@watermarkModal').find('[data-element="reset"]').as('reset');

      cy.get('@watermarkModal').find('[data-element="form"]').as('form');
    });

    it('Should be able to open watermark modal from print modal', () => {
      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });
      cy.get('@formContainer').matchImageSnapshot(ID.INIT);
    });

    it('Should be able to close watermark modal by clicking on close icon', () => {
      cy.get('@watermarkModalCloseButton').click();
      cy.get('@watermarkModal').should('not.visible');
    });

    it('Should be able to close watermark modal by clicking outside of it', () => {
      cy.get('@watermarkModal').click('topLeft');
      cy.get('@watermarkModal').should('not.visible');
    });

    it('Should be able to close watermark modal by clicking on cancel', () => {
      cy.get('@cancel').click();
      cy.get('@watermarkModal').should('not.visible');
    });

    it('Should be able to apply watermark', () => {
      cy.get('@form').within(() => {
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

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.WATERMARK_APPLIED);
      cy.get('@submit').click();
    });

    it('should be able to persist location settings before saving', () => {
      const someNumber = 2;
      cy.get('@form').within(() => {
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
      cy.timeout(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);

      cy.get('@form').within(() => {
        cy.get('select').first().find('option').eq(0).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });

        cy.get('select').first().find('option').eq(someNumber).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
      });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);
    });

    it('should be able to persist changes on save', () => {
      cy.get('@form').within(() => {
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
      cy.timeout(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE);

      cy.get('@submit').click();

      cy.get('@watermarkModal').should('not.visible');

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').should('visible');

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE);
    });

    it('Should be able to use reset button', () => {
      cy.get('@watermarkModal').find('canvas', {timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);

      cy.get('@form').within(() => {
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

      cy.get('@submit').click();

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@reset').click();
      // wait for changes to canvas
      cy.timeout(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);

      cy.get('@submit').click();

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);
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

    describe('Tests for when print modal is already opened', () => {
      beforeEach(() => {
        cy.get('@menuButton').click();
        cy.get('@printButton').click();
        cy.get('@printModal').should('visible');
      });

      it('Should not be able to see watermark modal button', () => {
        cy.get('@printModal').find('.apply-watermark').should('not.visible');
      });
    });

    describe('Tests of when existings watermarks are programtically removed', () => {
      beforeEach(() => {
        cy.window()
          .then(window => {
            window.docViewer.setWatermark({});
            window.docViewer.refreshAll();
            window.docViewer.updateView();

            cy.get('@menuButton').click();
            cy.get('@printButton').click();
            cy.get('@printModal').should('visible');

            cy.get('@printModal').find('[data-element="applyWatermark"]').as('applyWatermark');
          });
      });

      it('Should be able to see watermark modal button when existing watermark dissapear', () => {
        cy.get('@applyWatermark').should('visible');
      });

      it('Should be able to persist watermark modal changes when existing watermark appear/dissapear', () => {
        cy.window()
          .then(window => {
            cy.get('@applyWatermark').click();

            cy.get('[data-element="watermarkModal"]').as('watermarkModal').find('[data-element="form"]').as('form').within(() => {
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
            cy.timeout(CANVAS_TIMEOUT_MS);

            cy.get('@watermarkModal').find('[data-element="formContainer"]').as('formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_EXISTING_WATERMARK);
            cy.get('@watermarkModal').find('[data-element="submit"]').click();

            cy.get('[data-element="printModalCloseButton"]').as('printModalCloseButton').click()
              .then(() => {
                window.docViewer.setWatermark(WATERMARK);
                window.docViewer.refreshAll();
                window.docViewer.updateView();
              });

            cy.get('@menuButton').click();
            cy.get('@printButton').click();
            cy.get('@applyWatermark').should('not.visible');

            cy.get('@printModalCloseButton').click()
              .then(() => {
                window.docViewer.setWatermark({});
                window.docViewer.refreshAll();
                window.docViewer.updateView();
              });

            cy.get('@menuButton').click();
            cy.get('@printButton').click();
            cy.get('@applyWatermark').should('visible');

            cy.get('@applyWatermark').click();

            // wait for canvas to load
            cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

            cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_EXISTING_WATERMARK);
          });
      });
    });
  });
});