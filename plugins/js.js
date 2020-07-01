const { VM } = require('vm2')

const plugin = (bot) => {
  bot.addCommand('js', 'Run Javascript and display the output')

  bot.matchCommand(/^js (.+)$/, async (event, match) => {
    const code = match[1]
    const vm = new VM()
    const result = vm.run(code)
    event.reply(`Result: ${result}`)
  })
}

module.exports = {
  name: 'js',
  plugin,
}
