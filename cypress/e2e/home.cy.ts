
describe('renders the home page', () => {
  it('renders correctly', () => {
    cy.visit('https://travel-app-a1ee7.web.app/');
    cy.get('[data-testid="home"]').should('exist');
  });
});

describe('renders the home page', () => {
  it('fills out form and submit', () => {
    cy.visit('https://travel-app-a1ee7.web.app/');
    cy.get('[data-testid="search-orign-cities-input"]').click().type('P');
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.get('[data-testid="search-intermediate-cities-input"]').click().type('B');
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.get('[data-testid="search-destination-cities-input"]').click().type('N');
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.get('[data-testid="passengers-input"]').click().type('2');

    cy.get('[data-testid="travel-submit"]').click();

    cy.wait(3000);
    cy.url().should('eq', `https://travel-app-a1ee7.web.app/details/?originCity=Paris&intermediateCity=Strasbourg&destinationCity=Lyon&tripDate=11/03/2022&passengers=2`);
  });
});

