const plugin = (bot, database) => {

  bot.matchAdminCommand(/^set [^\s]+ .+$/, async event => {
      const [_, key, value] = event.commandBody.match(/^set ([^\s]+) (.+)$/)
      database.set(key, value)
      event.reply(`Set ${key}`)
  })

  bot.matchAdminCommand(/^get .+$/, async event => {
      const key = event.commandBody.match(/^get (.+)$/)[1]
      const value = await database.get(key)
      event.reply(`Value: ${value}`)
  })
}

module.exports = {
  name: 'database',
  plugin
}
