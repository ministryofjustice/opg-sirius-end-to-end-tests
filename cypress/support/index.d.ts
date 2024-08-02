declare namespace Cypress {
  interface Chainable<> {
    login(email: string): Chainable<void>
    loginAs(user: string): Chainable<void>
    postToApi(url: string, data: RequestBody, retry?: boolean): Chainable<Response<unknown>>
    putToApi(url: string, data: string): Chainable<Response<unknown>>
    waitForSearchService(searchTerm?: string, personTypes?: string[], minimumExpected?: number): Chainable<void>
  }
}
