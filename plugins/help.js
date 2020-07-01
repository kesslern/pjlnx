const plugin = (bot) => {
  const prefix = bot.config['command-prefix']

  bot.addCommand(
    'help',
    'List all available commands, or get help on a specific action'
  )

  bot.matchCommand(/^help$/, async (event) => {
    const result = Object.keys(bot.commands).join(', ')
    event.reply(`I know how to do: ${result}`)
  })

  bot.matchCommand(/^help\s+(.+)$/, async (event, match) => {
    const helpText = bot.commands[match[1]]
    const result = helpText
      ? `${prefix}${match[1]}: ${helpText}`
      : `I don't know how to do ${prefix}${match[1]}`
    event.reply(`${result}`)
  })
}

module.exports = {
  name: 'help',
  plugin,
}
