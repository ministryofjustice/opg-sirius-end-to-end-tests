describe('Create a relationship', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createDonor().then(({ uId: otherDonorUid }) => {
        cy.createLpa(donorId).then(({ id: lpaId }) => {
          cy.waitUntil(() =>
            cy.postToApi('/api/v1/search/persons', { personTypes: ['Donor'], term: otherDonorUid })
              .then(resp => resp.body.total.count === 1),
            { timeout: 5000, interval: 500 },
          );

          cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
          cy.wrap(otherDonorUid).as("otherDonorUid");
        });
      });
    });
  });

  it('should show the relationship', () => {
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*' }).as('personRequest');
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*/references' }).as('referenceRequest');

    cy.wait('@personRequest');

    cy.get("#Workflow").click();
    cy.contains("Create Relationship").click();

    cy.frameLoaded('.action-widget-content iframe');
    cy.enter('.action-widget-content iframe').then(getBody => {
      cy.get("@otherDonorUid").then(uid => {
        getBody().find("#f-search").type(uid);
        getBody().find(".autocomplete__menu").contains("Bob Sponge").click();
        getBody().find("#f-reason").type("Sponge");
        getBody().find('button[type=submit]').click();
      });
    });

    cy.wait('@referenceRequest');

    cy.contains('.case-summary', 'This donor has a link with Bob Sponge (Sponge)');
  });
});
