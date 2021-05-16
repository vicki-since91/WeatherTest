Cypress.Commands.add('getWeatherAPI', (city) => {
    cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}?q=${city}&appid=${Cypress.env('appId')}&units=metric`
    }).its('body').then((body) => {
        cy.writeFile(`cypress/fixtures/${body.name}.json`, body)
      })
})