/**
 * Comment out tests for now
 * https://trello.com/c/uq5eEsqH/454-allow-cypress-end-to-end-tests-to-be-ran-locally-on-machine
 */
const ID = {
  INIT: 'initial',
  WATERMARK_APPLIED: 'watermark-applied',
  TEST_RESET: 'test-reset',
  TEST_PERSIST_CHANGE_BEFORE_SAVING: 'test-persist-change-before-saving',
  TEST_PERSIST_CHANGE_AFTER_SAVING: 'test-persist-change-after-saving',
  TEST_PERSIST_CHANGE_EXISTING_WATERMARK: 'test-persist-change-existing-watermark',
};

const CANVAS_TIMEOUT_MS = 2000;

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

const LOCATION_DROPDOWN_INDEX = 2;

const FONT_SIZE_DROPDOWN_INDEX = 11;

const fillOutForm = () => {
  // fill out form arbitrarily
  // Note: type words in text field that don't have typos else picture diffing may cause problems
  return cy.get('#watermarkModal').find('#form').within(() => {
    cy.get('#textInput').as('textInput').type('Test');
    cy.get('@textInput').blur();
    cy.get('#fontSize').as('fontSize').find('option').eq(FONT_SIZE_DROPDOWN_INDEX).invoke('val').then((val) => {
      cy.get('@fontSize').last().select(val);
      cy.get('@fontSize').first().focus().blur();
    });
    cy.get('#currentColorCell').click();
    cy.get('[data-element="colorPalette"]').find('[style="background-color: rgb(0, 0, 0);"]').click();

    cy.get('#opacitySlider').as('opacitySlider').find('[data-element="slider"]').as('slider').trigger('mousedown');
    cy.get('@slider').trigger('mousemove', { pageX: 5 });
    cy.get('@slider').trigger('mouseup');

    cy.get('#location').as('location').first().find('option').eq(LOCATION_DROPDOWN_INDEX).invoke('val').then((val) => {
      cy.get('@location').first().select(val);
      cy.get('@location').first().focus().blur();
    });
    cy.get('@textInput').type('Test');

    cy.get('@textInput').blur();

    cy.wait(CANVAS_TIMEOUT_MS);
  });
};

describe.skip('Tests for watermark modal', () => {
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

  describe.skip('Tests for when there is no existing water mark', () => {
    beforeEach(() => {
      cy.get('@menuButton').click();
      cy.get('@printButton').click();
      cy.get('@printModal').should('visible');
      cy.get('@printModal').find('#applyWatermark').as('openWatermarkModal').click();
      cy.get('#watermarkModal').as('watermarkModal').should('visible');

      cy.get('[data-element="watermarkModalCloseButton"]').as('watermarkModalCloseButton');
      cy.get('@watermarkModal').find('#formContainer').as('formContainer');
      cy.get('@watermarkModal').find('#submit').as('submit');
      cy.get('@watermarkModal').find('#cancel').as('cancel');
      cy.get('@watermarkModal').find('#reset').as('reset');
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
      fillOutForm();

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.WATERMARK_APPLIED);
      cy.get('@submit').click();
    });

    it('should be able to persist location settings before saving', () => {
      fillOutForm();

      // wait for changes to canvas
      cy.wait(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);

      // go to another drop down option
      cy.get('@watermarkModal').find('[data-element="form"]').within(() => {
        cy.get('select').first().find('option').eq(0).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });

        cy.get('select').first().find('option').eq(LOCATION_DROPDOWN_INDEX).invoke('val').then((val) => {
          cy.get('select').first().select(val);
          cy.get('select').first().focus().blur();
        });
      });

      // wait for changes to canvas
      cy.wait(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_BEFORE_SAVING);
    });

    it('should be able to persist changes after saving', () => {

      fillOutForm();

      // wait for changes to canvas
      cy.wait(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_AFTER_SAVING);

      cy.get('@submit').click();

      cy.get('@watermarkModal').should('not.visible');

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').should('visible');

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_AFTER_SAVING);
    });

    it('Should be able to use reset button', () => {
      cy.wait(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);

      fillOutForm();

      cy.get('@submit').click();

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@reset').click();
      // wait for changes to canvas
      cy.wait(CANVAS_TIMEOUT_MS);

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);

      cy.get('@submit').click();

      cy.get('@openWatermarkModal').click();

      cy.get('@watermarkModal').find('canvas', { timeout: CANVAS_TIMEOUT_MS });

      cy.get('@formContainer').matchImageSnapshot(ID.TEST_RESET);
    });
  });

  describe.skip(('Tests for when there is existing watermark'), () => {
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
          .then(async window => {
            window.docViewer.setWatermark({});
            window.docViewer.refreshAll();
            window.docViewer.updateView();
            await window.docViewer.getWatermark();
            cy.get('@menuButton').click();
            cy.get('@printButton').click();
            cy.get('@printModal').should('visible');

            cy.get('@printModal').find('#applyWatermark').as('applyWatermark');
          });
      });

      it('Should be able to see watermark modal button when existing watermark dissapear', () => {
        cy.get('@applyWatermark').should('visible');
      });

      it('Should be able to persist watermark modal changes when existing watermark appear/dissapear', () => {
        cy.window()
          .then(window => {
            cy.get('@applyWatermark').click();

            fillOutForm();

            // wait for changes to canvas
            cy.wait(CANVAS_TIMEOUT_MS);

            cy.get('#watermarkModal').as('watermarkModal').find('#formContainer').as('formContainer').matchImageSnapshot(ID.TEST_PERSIST_CHANGE_EXISTING_WATERMARK);
            cy.get('@watermarkModal').find('#submit').click();

            cy.get('#printModalCloseButton').as('printModalCloseButton').click()
              .then(async () => {
                window.docViewer.setWatermark(WATERMARK);
                window.docViewer.refreshAll();
                window.docViewer.updateView();
                await window.docViewer.getWatermark();
              });

            cy.get('@menuButton').click();
            cy.get('@printButton').click();
            cy.get('@applyWatermark').should('not.visible');

            cy.get('@printModalCloseButton').click()
              .then(async () => {
                window.docViewer.setWatermark({});
                window.docViewer.refreshAll();
                window.docViewer.updateView();
                await window.docViewer.getWatermark();
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
