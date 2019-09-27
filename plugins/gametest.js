const plugin = bot => {
  bot.matchCommand(/^gamestart$/, async event => {
    if (event.target.startsWith('#')) {
      event.reply(`Starting game in ${event.target}`)
      setTimeout(() => {
        event.reply('ya')
      }, 10000)
    } else {
      event.reply("Can't do this in private messages.")
    }
  })
}

module.exports = {
  name: 'wolfram',
  plugin,
}
