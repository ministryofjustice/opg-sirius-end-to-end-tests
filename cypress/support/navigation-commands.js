const headerLinks = {
  poaUrl: {
    title: "Power of Attorney",
    url: "/lpa",
    position: 1,
  },
  supervisionUrl: {
    title: "Supervision",
    url: "/supervision",
    position: 2,
  },
  adminUrl: {
    title: "Admin",
    url: "/admin",
    position: 3,
  },
  signOutUrl: {
    title: "Sign out",
    url: "/auth/login?loggedout=1",
    position: 4,
  },
};

const navigationLinks = {
  createClientUrl: {
    title: "Create client",
    url: "/supervision/#/clients/search-for-client",
    position: 1,
  },
  workflowUrl: {
    title: "Workflow",
    url: "/supervision/workflow",
    position: 2,
  },
  financeUrl: {
    title: "Finance",
    url: "/supervision/#/finance-hub/reporting",
    position: 4,
  },
};

Cypress.Commands.add(
  "assertHeaderWorks",
  (microserviceName, expectedHeaderLinks, expectedNavigationLinks) => {
    let checkLink = function (microserviceName, className, link) {
      cy.returnToMicroserviceHome(microserviceName);
      let linkIdentifier = ":nth-child(" + link.position + ") > " + className;
      cy.get(linkIdentifier).should("exist");
      cy.get(linkIdentifier).should(
        link.visible ? "be.visible" : "not.be.visible"
      );
      cy.get(linkIdentifier).should(
        link.current ? "have.attr" : "not.have.attr",
        "aria-current",
        "page"
      );
      cy.get(linkIdentifier).should("contain.text", link.title);
      if (link.visible) {
        cy.get(linkIdentifier).click();
        cy.url().should("include", link.url);
      }
    };

    for (let [name, link] of Object.entries(expectedNavigationLinks)) {
      link = { ...link, ...navigationLinks[name] };
      checkLink(microserviceName, ".moj-primary-navigation__link", link);
    }

    for (let [name, link] of Object.entries(expectedHeaderLinks)) {
      link = { ...link, ...headerLinks[name] };
      checkLink(microserviceName, ".govuk-header__link", link);
    }
  }
);

Cypress.Commands.add("returnToMicroserviceHome", (microserviceName) => {
  switch (microserviceName) {
    case "workflow":
      cy.visit("/supervision/#/dashboard");
      cy.get("#hook-workflow-button").click();
      break;
    case "deputy-hub":
      cy.get("@deputy").then(({ id }) =>
        cy.visit("/supervision/deputies/" + id)
      );
      break;
    case "firm-hub":
      cy.get("@firmId").then((firmId) =>
        cy.visit("/supervision/deputies/firm/" + firmId)
      );
      break;
    default:
      break;
  }
});
