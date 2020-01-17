const cheerio = require('cheerio')
const axios = require('axios')

const state = {
  riddling: false,
  answer: null,
}

const plugin = bot => {
  bot.matchCommand(/^riddle$/, async event => {
    if (!state.riddling) {
      state.riddling = true
      const { data } = await axios.get(
        'https://www.riddles.fyi/random-riddles/'
      )
      const $ = cheerio.load(data)

      const riddle = $('.query-title-link')
        .text()
        .trim()
      state.answer = $('.su-spoiler-content')
        .text()
        .trim()

      event.reply(riddle)
    } else {
      event.reply("You're already being riddled!")
    }
  })

  bot.matchCommand(/^answer$/, async event => {
    if (state.riddling) {
      state.riddling = false
      event.reply(state.answer)
    } else {
      event.reply("I'm not riddling you!")
    }
  })
}
module.exports = {
  name: 'riddle',
  plugin,
}
