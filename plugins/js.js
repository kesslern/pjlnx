const { VM } = require('vm2')
const vm = new VM()

const plugin = bot => {
  bot.matchCommand(/^js (.+)$/, async (event, match) => {
    const code = match[1]
    const result = vm.run(code)
    event.reply(`Result: ${result}`)
  })
}

module.exports = {
  name: 'js',
  plugin,
}
