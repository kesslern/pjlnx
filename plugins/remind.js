const parse = require('parse-duration')
const prettyMilliseconds = require('pretty-ms')

const plugin = bot => {
  bot.matchCommand(/^in$/, async event => {
    const prefix = bot.config['command-prefix']
    event.reply(`Usage: ${prefix}in [time] [reminder]`)
  })

  bot.matchCommand(/^in .*$/, async event => {
    let command, duration, reminder

    try {
      command = event.command.match(/^in (.*?) (.*)$/)
      reminder = command[2]
    } catch (e) {
      console.log(e)
      event.reply(`${event.nick}: Remind you of what?`)
      return
    }

    duration = parse(command[1])
    if (duration <= 0) {
      event.reply(`${event.nick}: Huh? How long?`)
      return
    }

    event.reply(
      `${event.nick}: I'll remind you in ${prettyMilliseconds(duration, {
        verbose: true,
      })}`
    )
    setTimeout(() => {
      event.reply(`${event.nick}: ${reminder}`)
    }, duration)
  })
}

module.exports = {
  name: 'remind',
  plugin,
}
