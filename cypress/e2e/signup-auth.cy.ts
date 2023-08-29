beforeEach(() => {
  cy.visit('http://localhost:3000')
  const email = cy.get('[data-cy="email-field"]')
  const password = cy.get('[data-cy="password-field"]')
  const submit = cy.get('[data-cy="submit-btn"]')
})

describe('sign up authentication spec', () => {
  it('should not allow the user to proceed - an error field should display', () => {
    // first case to prevent empty fields
    cy.get('[data-cy="email-field"]').clear()
    cy.get('[data-cy="password-field"]').clear()
    cy.get('[data-cy="submit-btn"]').click()
  })
})

describe('sign up authentication spec', () => {
  it('should not allow the user to proceed - an error field should display', () => {
    // first case to prevent empty fields
    cy.get('[data-cy="email-field"]').type("test")
    cy.get('[data-cy="password-field"]').type("test")
    cy.get('[data-cy="submit-btn"]').click()
  })
})