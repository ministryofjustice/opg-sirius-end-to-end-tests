declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string): Chainable<void>
    loginAs(user: string): Chainable<void>
    postToApi(url: string, data: any, retry?: boolean): Chainable<Response<any>>
    putToApi(url: string, data: string): Chainable<Response<any>>
    waitForSearchService(searchTerm?: string, personTypes?: string[], minimumExpected?: number): Chainable<void>
  }
}
