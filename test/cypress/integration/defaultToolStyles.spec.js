/// <reference types="Cypress" />

describe('Default tool styles', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1');
  });

  it('should save default tool styles to localStorage', () => {
    const expectedStyles = {
      StrokeColor: { R: 255, G: 230, B: 162, A: 1 },
      Opacity: 1
    };

    expect(localStorage.getItem('toolData-AnnotationCreateSticky')).to.equal(JSON.stringify(expectedStyles));
  });

  it('should update localStorage when tool styles change', () => {
    // cy.get('.ToggleElementButton')
    //   .click();  
  });
});