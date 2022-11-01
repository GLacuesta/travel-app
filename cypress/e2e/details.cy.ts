describe('renders the details page', () => {
  it('renders correctly', () => {
    cy.visit('https://travel-app-a1ee7.web.app/details/?originCity=Paris&intermediateCity=Marseille&destinationCity=Strasbourg&tripDate=11/02/2022&passengers=2');
    cy.get('[data-testid="details"]').should('exist');
  })
});