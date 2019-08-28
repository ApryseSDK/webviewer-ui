
describe ('Tests for watermark modal', () => {
  // it('Visit the app asynchronously', async () => {
  //   cy.visit ('/');
  //   const $iframe = await cy.wrap(cy.get("iframe"));
  //   const b = $iframe.contents().find("body")
  //   console.log(b);
  // });
  it ('Visit the app', async () => {
    // Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
    //   return new Cypress.Promise(resolve => {
    //       $iframe.on('load', () => {
    //           resolve($iframe.contents().find('body'));
    //       });
    //   });
    // });
  // for <iframe id="foo" src="bar.html"></iframe>
  // cy.get('#foo').iframe().find('.bar').should('contain', 'Success!');

    cy.visit ('/');

    // const b = await temp();
    // console.log(b);
    
    cy.get("iframe").then(($iframe) => {
      // query into the iframe
      const $body = $iframe.contents().find('body');

    cy.wrap($body).find('.HeaderItems');
    });
  });
});

async function temp() {
  // const $iframe = await cy.get("iframe");
  // return $iframe.contents().find('body');
  return cy.get("iframe");
}