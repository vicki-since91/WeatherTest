const url = Cypress.env('apiUrl')
const appId = Cypress.env('appId')

context('Testing Weather API results', () => {
    it('Validate temperature data by City Name', () => {
        cy.fixture('input').then((data) => data.city.forEach(cityName =>
            cy.request({
                method: 'GET',
                url: `${url}?q=${cityName}&appid=${appId}&units=metric`,
            }).then((response) => {
                const { body } = response;
                expect(response).to.have.property('status', 200);
                expect(response).to.have.property('statusText', 'OK');
                expect(body).has.property('name', cityName);
                expect(body.main).has.property('temp');
                expect(body).has.property('wind');
                expect(body).has.property('weather');
                expect(body).has.property('clouds');
            })
        ))
    })

    it('Validate temperature data by Zip Code', () => {
        cy.fixture('input').then((data) => data.zipcode.forEach(inputData => {
            cy.log(`Testing for zipcode and city -  ${inputData.zip} and ${inputData.name}`)
            cy.request({
                method: 'GET',
                url: `${url}?zip=${inputData.zip},in&appid=${appId}&units=metric`,
            }).then((response) => {
                const { body } = response;
                expect(response).to.have.property('status', 200);
                expect(body).has.property('name', inputData.name);
            })
        }))
    })

    it('Validate the response for invalid data', () => {
        cy.request({
            method: 'GET',
            url: `${url}?q=xefg&appid=${appId}`,
            failOnStatusCode: false
        }).then((response) => {
            const { body } = response;
            expect(response).to.have.property('status', 404);
            expect(body).has.property('message', "city not found");
        })
    })

    it('Validate the response for invalid data', () => {
        cy.getWeatherAPI('Madurai')
        cy.log(Cypress.env('apiData'))
        cy.getWeatherAPI('Pune')
        cy.log(Cypress.env('apiData'))
    })
})