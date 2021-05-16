class WeatherUtilities {
    static celsiusToFarenheit(degree) {
        return (degree * 1.8) + 32;
    }

    static getLatestTemp(cityData) {
        const { name: cityName, main: { temp: inCelsius } } = cityData
        return { cityName, inCelsius, inFarenheit: this.celsiusToFarenheit(inCelsius) }
    }

    static getLatestWindSpeed(cityData) {
        const { name: cityName, wind: { speed } } = cityData
        return { cityName, speed };
    }
}

export default WeatherUtilities;