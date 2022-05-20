beforeEach(() => {
    cy.loginAs('Case Manager');
});

const getIframeBody = () => {
    return cy
        .get('.help-and-guidance__iframe-container')
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
}
//this will fail locally due to the help and guidance url in dev being hardoded to an url only accessible on the VPN
describe('Open help and guidance', { tags: ['@supervision', '@help-and-guidance'] }, () => {
    it('should load the Help And Guidance correctly', () => {
        cy.visit('/supervision/#/dashboard');
        cy.get('#open-help-and-guidance-main-menu-link').click()
        getIframeBody().should('be.visible')
        getIframeBody().find('#menu-item-2682').click()
    });
});