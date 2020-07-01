const axios = require('axios')
const parseString = require('xml2js').parseString

const plugin = (bot) => {
  const prefix = bot.config['command-prefix']
  const api = {
    url: 'http://api.wolframalpha.com/v2/query',
    key: bot.config['wolfram-alpha'],
  }

  bot.addCommand(
    'wolfram',
    `Usage: ${prefix}wolfram [query] or ${prefix}wa [query]`
  )

  bot.matchCommand(/^(wa|wolfram) .+/, async (event) => {
    const { command } = event
    const input = command.slice(command.indexOf(' ') + 1)
    const { data } = await axios.get(
      `${api.url}?appid=${api.key}&input=${input}`
    )

    parseString(data, (err, xml) => {
      const { pod: pods } = xml.queryresult
      const result = pods
        .filter((pod) => pod['$'].primary)
        .filter((pod) => pod['$'].id !== 'Input')
        .map((pod) => pod.subpod.map((subpod) => subpod.plaintext).flat())
        .join('-')

      event.reply(`Result: ${result.replace(/\n/g, ' ')} | Input: ${input}`)
    })
  })
}

module.exports = {
  name: 'wolfram',
  plugin,
}
