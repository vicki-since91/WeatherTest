import WeatherPage from '../pages/weatherPage';
import WeatherUtilities from '../utilities/weatherUtils';
import { degreeCelsius, degreeFahrenheit } from '../constants';

const weatherPage = new WeatherPage()
let tempVariation = 0;
let tempVariationInF = 0;
let windVariation = 0;
let cityApiData = {};

context('Testing Weather UI', () => {
    beforeEach(() => {
        cy.log('Starting test')
        cy.fixture('input').then((data) => {
            tempVariation = data.allowedTempVariation
            tempVariationInF = WeatherUtilities.celsiusToFarenheit(data.allowedTempVariation)
            windVariation = data.allowedWindVariation
        })
    })

    before(() => {
        cy.clearCookies()
        weatherPage.visit('/')
        cy.fixture('input').then((data) => {
            data.validationCity.forEach(city => {
                cy.getWeatherAPI(city)
                cy.fixture(city).then(cityData => {
                    cityApiData = {...cityApiData, [city]: cityData }
                    cy.log(cityApiData)
                })
            })
        })
    })

    it('validate weather page elements', () => {
        weatherPage.validateWeatherPage()
    })

    
    it('validate Pin Your City feature', () => {
        cy.fixture('input').then((data) => {
            data.pinCities.forEach(city => { 
                weatherPage.pinCity(city)
                weatherPage.validatePinnedCity(city)
            })
            data.unpinCities.forEach(city => { 
                weatherPage.validateUnpinnedCity(city)
            })
        })
    })

    it('validate temperature from pinned city', () => {
        cy.fixture('input').then((data) => { 
            data.validationCity.forEach(city => {
                weatherPage.pinCity(city)
                const  { cityName, inCelsius, inFarenheit } = WeatherUtilities.getLatestTemp(cityApiData[city])
                // Celsius temperature validation
                weatherPage.getTempFromCityPin(cityName).invoke('text').then((value) => {
                    const temp = parseFloat(value.replace(degreeCelsius,''))
                    expect(temp).to.be.within(inCelsius - tempVariation, inCelsius + tempVariation)
                })
                // Fahrenheit temperature validation
                weatherPage.getTempFromCityPin(cityName, false).invoke('text').then((value) => {
                    const temp = parseFloat(value.replace(degreeFahrenheit,''))
                    expect(temp).to.be.within(inFarenheit - tempVariationInF, inFarenheit + tempVariationInF)
                })
            })
        })
    })

    it('validate temperature in celsius and farenheit from popup', () => {
        cy.fixture('input').then((data) => { 
            data.validationCity.forEach(city => {
                weatherPage.pinCity(city)
                weatherPage.openCityPopup(city)
                const  { cityName, inCelsius, inFarenheit } = WeatherUtilities.getLatestTemp(cityApiData[city])
                // Celsius temperature validation
                weatherPage.validateTemp(inCelsius, tempVariation, true)
                // Fahrenheit temperature validation
                weatherPage.validateTemp(inFarenheit, tempVariationInF);
            })
        })
    })

    it('validate wind data in popup', () => {
        cy.fixture('input').then((data) => { 
            data.validationCity.forEach(city => {
                weatherPage.pinCity(city)
                weatherPage.openCityPopup(city)
                const  { cityName, speed } = WeatherUtilities.getLatestWindSpeed(cityApiData[city])
                weatherPage.validateWindSpeed(speed, windVariation)
            })
        })
    })

    after(() => {
        cy.log('Finishing Test')
    })
})