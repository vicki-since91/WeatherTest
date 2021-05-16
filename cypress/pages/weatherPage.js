class WeatherPage {
  constructor() {
    this.text = {
      degreeText : 'Temp in Degrees:',
      fahrenheitText : 'Temp in Fahrenheit:',
      infoText : 'Current weather conditions in your city.',
      windText: 'Wind:'
    }
    this.cssSelectors = {
      degreeClass: 'tempRedText',
      fahrenheitClass: 'tempWhiteText',
      searchField: '#searchBox',
      infoField: '.infoHolder',
      popupText: '.heading'
    }
  }
  
  visit() {
    cy.visit('/');
  }

  // Action methods
  pinCity(city) {
    cy.get(this.cssSelectors['searchField']).clear()
    cy.get(this.cssSelectors['searchField']).type(city)
    cy.get(`#${city}`).check()
  }
  
  openCityPopup(cityName) {
    cy.get('.cityText').contains(cityName).click()
  }

  getTextFromPopup() {
    return cy.get(this.cssSelectors['popupText'])
  }

  getTempFromCityPin(city, isCelsius = true) {
    return cy.get(`div[title='${city}'] .${isCelsius ? this.cssSelectors['degreeClass']: this.cssSelectors['fahrenheitClass']}`)
  }

  // Validation methods
  validateWindSpeed(windSpeed, variation) {
    this.getTextFromPopup()
    .contains(this.text['windText'])
    .invoke('text')
    .then((data) => {
      let windMin = 0;
      let windMax = 0;
      if(data) {
        cy.log(data.split(' ')[1])
        windMin = parseFloat(data.split(' ')[1]) - variation
        windMax = parseFloat(data.split(' ')[5]) + variation
        expect(windSpeed).to.be.within(windMin, windMax)
      }
    })
  }

  validateTemp(temp, variation, isCelsius = false) {
    const temperatureText = isCelsius ? this.text['degreeText'] : this.text['fahrenheitText'];
    this.getTextFromPopup()
    .contains(temperatureText)
    .invoke('text')
    .then((data) => {
      const actualTemp = parseFloat(data.replace(temperatureText, ''))
      expect(actualTemp).to.be.within(temp - variation, temp + variation)
    })
  }

  validateWeatherPage() {
    cy.get(this.cssSelectors['infoField']).should('have.text', this.text['infoText'])
    cy.get('#loading').should('not.to.be.visible')
  }

  validatePinnedCity(city) {
    cy.get(`div[title=${city}]`).should('be.visible')
  }
  
  validateUnpinnedCity(city) {
    cy.get(`div[title=${city}]`).should('not.exist')
  }
}

export default WeatherPage;