const createClient = () => {
  return cy.fixture('client/minimal.json').then(client => {
    cy.postToApi('/api/v1/clients', client)
      .its('body')
      .then(res => {
        cy.wrap(res.caseRecNumber).as('courtReference');
        cy.wrap(res.id).as('clientId');
      });
  });
};

const allocateTheClientToHWTeam = () => {
  cy.request({
    url: '/api/v1/teams',
    headers: {
      'accept': 'application/json',
      'opg-bypass-membrane': 1
    }
  }).its('body')
    .then(teams => {
      for (let i in teams) {
        if (teams[i].name === 'Health & Welfare - (Supervision)') {
          cy.wrap(teams[i].id).as('hwTeamId');
          break;
        }
      }
    });

  cy.get('@hwTeamId').then(hwTeamId => {
    cy.get('@clientId').then(clientId => {
      return cy.putToApi(`/api/v1/clients/${clientId}/edit/allocate`, `{"teamId":"${hwTeamId}"}`);
    });
  });
}

before(function setupAllocatedClient () {
  cy.loginAs('Allocations User')
    .then(createClient)
    .then(allocateTheClientToHWTeam);
});

describe('Reassign client on the dashboard', { tags: ['@supervision', '@supervision-regression', '@xxx'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision and on the client dashboard page' +
    'Then the Client Dashboard page loads as expected',
    () => {
      cy.loginAs('Lay User');
      cy.visit('/supervision/#/dashboard');
      cy.get('li[class="tab-container__tab TABS_CLIENTS"]').click();

      cy.get('[data-qa="main-filter-base-dropdown"]')
       .find('select')
       .select('AnotherTeam');

      cy.get('[data-qa="main-filter-team-dropdown"]')
        .find('select')
        .select('Health & Welfare - (Supervision)');

      cy.get('[data-qa="main-filter-apply-button"]').click({force: true});

      cy.get('@courtReference').then(courtRef => {
        cy.contains(courtRef).parents().find('[type="checkbox"]').check({force: true});
      });

      cy.get('[data-qa="reassign-filter-base-dropdown"]')
        .find('select')
        .select('MyTeam');

      cy.get('[data-qa="reassign-filter-user-dropdown"]')
        .find('select')
        .select('LayTeam1 User14');

      cy.get('[data-qa="reassign-filter-reassign-button"]').click({force: true});

      cy.contains('Yes, reassign').click();

      cy.contains('Client(s) reassigned successfully');
    }
  );
});
