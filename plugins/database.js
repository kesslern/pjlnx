const plugin = (bot, database) => {
  bot.matchAdminCommand(/^set ([^\s]+) (.+)$/, async (event, match) => {
    const [_, key, value] = match
    database.set(key, value)
    event.reply(`Set ${key}`)
  })

  bot.matchAdminCommand(/^get (.+)$/, async (event, match) => {
    const key = match[1]
    const value = await database.get(key)
    event.reply(`Value: ${value}`)
  })
}

module.exports = {
  name: 'database',
  plugin,
}
