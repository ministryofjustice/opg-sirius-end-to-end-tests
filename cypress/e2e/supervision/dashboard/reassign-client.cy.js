const allocateTheClientToLayTeam = () => {
  cy.request({
    url: "/supervision-api/v1/teams",
    headers: {
      accept: "application/json",
      "opg-bypass-membrane": 1,
    },
  })
    .its("body")
    .then((teams) => {
      for (let i in teams) {
        if (teams[i].name === "Lay Team 1 - (Supervision)") {
          cy.wrap(teams[i].id).as("hwTeamId");
          break;
        }
      }
    });

  cy.get("@hwTeamId").then((hwTeamId) => {
    cy.get("@clientId").then((clientId) => {
      return cy.putToApi(
        `/supervision-api/v1/clients/${clientId}/edit/allocate`,
        `{"teamId":"${hwTeamId}"}`
      );
    });
  });
};

before(function setupAllocatedClient() {
  cy.loginAs("Allocations User");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => cy.setSupervisionLevel(orderId));
  cy.get("@orderId").then((orderId) => cy.changeOrderStatus(orderId));
  allocateTheClientToLayTeam();
});

describe(
  "Reassign client on the dashboard",
  {
    tags: [
      "@supervision",
      "@supervision-core",
      "@supervision-regression",
      "@reassign-client-dashboard",
      "@smoke-journey",
    ],
  },
  () => {
    it("reassigns the client via the Dashboard", () => {
      cy.loginAs("Lay User");
      cy.visit("/supervision/#/dashboard");

      cy.get('li[class="tab-container__tab TABS_CLIENTS"]').click();

      cy.get('[data-role="main-filter-base-dropdown"]')
        .find("select")
        .select("MyTeamsClients");

      cy.get('[data-role="main-filter-user-dropdown"]')
        .find("select")
        .select("Team unallocated");

      cy.get('[data-role="main-filter-apply-button"]').click({ force: true });

      cy.get("@clientCourtReference").then((courtRef) => {
        cy.contains(courtRef)
          .parents()
          .find('[type="checkbox"]')
          .check({ force: true });
      });

      cy.get('[data-role="reassign-filter-base-dropdown"]')
        .find("select")
        .select("AnotherTeam");

      cy.get('[data-role="reassign-filter-other-team-dropdown"]')
        .find("select")
        .select("Lay Team 2 - (Supervision)");

      cy.get('[data-role="reassign-filter-other-team-user-dropdown"]')
        .find("select")
        .select("LayTeam2 User1");

      cy.get('[data-role="reassign-filter-reassign-button"]').click({
        force: true,
      });

      cy.contains("Yes, reassign").click();

      cy.contains("Client(s) reassigned successfully");
    });
  }
);
