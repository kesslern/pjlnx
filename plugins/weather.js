const axios = require('axios')

const c2f = celsius => (celsius * 9) / 5 + 32
const k2c = kelvin => kelvin - 273.15
const k2f = kelvin => c2f(k2c(kelvin))

const formatNumber = num => `${num}`.slice(0, 4)
const formatDate = (date, timezone) => {
  return new Date((date + timezone) * 1000).toLocaleTimeString('en-US', {
    timeZone: 'UTC',
  })
}

const plugin = bot => {
  const apiKey = bot.config.openWeatherMap

  bot.matchCommand(/^weather \d{5}$/, async event => {
    const zip = event.command.match(/^weather (\d{5})$/)[1]

    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&APPID=${apiKey}`
    )
    const weather = response.data

    const temp = {
      currentF: formatNumber(k2f(weather.main.temp)),
      maxF: formatNumber(k2f(weather.main.temp_max)),
      minF: formatNumber(k2f(weather.main.temp_min)),
      currentC: formatNumber(k2c(weather.main.temp)),
      maxC: formatNumber(k2c(weather.main.temp_max)),
      minC: formatNumber(k2c(weather.main.temp_min)),
    }

    const conditions = weather.weather[0].description
    const humidity = weather.main.humidity
    const wind = weather.wind.speed
    const sunrise = weather.sys.sunrise
    const sunset = weather.sys.sunset
    const timezone = weather.timezone

    const currentWeather = [
      `Current conditions in ${weather.name}: ${conditions}`,
      `Current temperature: ${temp.currentF}F (${temp.currentC}C)`,
      `Max temp: ${temp.maxF}F (${temp.maxC}C)`,
      `Overnight min temp: ${temp.minF}F (${temp.minC}C)`,
      `Humidity: ${humidity}/100`,
      `Wind: ${wind}m/s`,
      `Sunrise: ${formatDate(sunrise, timezone)}`,
      `Sunset: ${formatDate(sunset, timezone)}`,
    ]

    event.reply(currentWeather.join(' | '))
  })
}

module.exports = {
  name: 'weather',
  plugin,
}
