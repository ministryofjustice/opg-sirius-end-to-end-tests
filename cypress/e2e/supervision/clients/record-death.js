beforeEach(() => {
  cy.loginAs('Case Manager');
  cy.createAClient();

  cy.get('@clientId').then(clientId => {
    cy.visit('/supervision/#/clients/' + clientId + '/record-death');
  });
});

describe('Record the death of a client', { tags: ['@supervision-core', '@client', '@client-record-death-notification'] }, () => {
  it('loads the Record Death page correctly', () => {
    cy.contains('Record death of Ted Tedson');
    cy.get('li[class="tab-container__tab TABS_REPORTS"]');
    cy.get('li[class="tab-container__tab TABS_ORDERS"]');
    cy.get('li[class="tab-container__tab TABS_DEPUTIES"]');
    cy.get('li[class="tab-container__tab TABS_DOCUMENTS active"]');
  });

  it('successfully records a date of death', { tags: ['@smoke-journey'] }, () => {
    cy.contains('Record death of Ted Tedson');
    cy.get('radio-button[name="proofOfDeathReceived"][label="Yes"]').find('[type="radio"]').check({force: true});
    cy.get('input[name="dateOfDeath"]').type('30/01/2020');
    cy.get('input[name="dateNotified"]').type('20/02/2020');
    cy.get('select[name="notifiedBy"]').select('0');
    cy.get('radio-button[name="notificationMethod"][label="Email"]').find('[type="radio"]').check({force: true});

    cy.contains('Confirm client is deceased').click();

    cy.contains('Are you sure you wish to mark the client as deceased?');
    cy.contains('The client is deceased').click();

    cy.get('span[class="title-person-name"]').should('be.visible').contains(`Ted Tedson`);
    cy.contains(`Client deceased`);

    cy.get('li[class="tab-container__tab TABS_TIMELINELIST"]').should('be.clickable').click();
    cy.get('ol[class="vertical-timeline"]');

    // TODO - timeline
    // Then the timeline displays the correct fields for the client death notification
    // Wait.upTo(Duration.ofSeconds(ProtractorTimeoutHelper.elementVisibleTimeoutDurationInSeconds())).until(
    // 				TabsContainer.Timeline_Tab,
    // 				isClickable()
    // 			),
    // 			Click.on(TabsContainer.Timeline_Tab),
    // 			Wait.upTo(Duration.ofSeconds(ProtractorTimeoutHelper.elementVisibleTimeoutDurationInSeconds())).until(TimelineTab.EventsList, isVisible()),
    // 			Ensure.that(
    // 				Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_DeathRecordType),
    // 				equals(createdUsingData.proofOfDeathReceived === 'Yes' ? 'confirmed' : 'notified')
    // 			),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_DateOfDeath), equals(createdUsingData.dateOfDeath)),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_DateLetterSentOut), equals(createdUsingData.dateLetterSentOut)),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_NotifiedBy), equals(createdUsingData.notifiedBy)),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_DateNotified), equals(createdUsingData.dateNotified)),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_NotificationMethod), equals(createdUsingData.notificationMethod)),
    // 			Ensure.that(Text.of(DeathRecordTimelineEventTemplate.FirstDeathRecord_Notes), equals(createdUsingData.notes)),
    // 			Ensure.that(Text.of(ClientStatusTimelineEventTemplate.FirstClientStatus_PreviousStatus), equals('Open')),
    // 			Ensure.that(Text.of(ClientStatusTimelineEventTemplate.FirstClientStatus_CurrentStatus), equals('Death notified'))
  });

  it('shows validation errors when date of death is invalid', () => {
    cy.contains('Record death of Ted Tedson');
    cy.get('radio-button[name="proofOfDeathReceived"][label="Yes"]').find('[type="radio"]').check({force: true});
    cy.get('input[name="dateOfDeath"]').type('Invalid');
    cy.get('input[name="dateNotified"]').type('20/02/2020');
    cy.get('select[name="notifiedBy"]').select('0');
    cy.get('radio-button[name="notificationMethod"][label="Email"]').find('[type="radio"]').check({force: true});

    cy.contains('Confirm client is deceased').click();

    cy.contains('Are you sure you wish to mark the client as deceased?');
    cy.contains('The client is deceased').click();

    cy.get('div[class="validation-summary"]').should('be.visible').contains('Date of death');
  });
});

