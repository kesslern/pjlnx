const eval = require('safer-eval')

const plugin = bot => {
  bot.matchCommand(/^js .+$/, async event => {
    const code = event.command.match(/^js (.+)$/)[1]
    const result = eval(code)
    event.reply(`Result: ${result}`)
  })
}

module.exports = {
  name: 'js',
  plugin,
}
