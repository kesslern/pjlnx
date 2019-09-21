const axios = require('axios')

const plugin = (bot) => {
  bot.matchMessage(/^advice$/, async event => {
    const response = await axios.get("https://api.adviceslip.com/advice")
    event.reply(response.data.slip.advice)
  })
}

module.exports = {
  name: 'advice',
  plugin
}
