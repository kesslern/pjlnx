const fs = require('fs')
const hjson = require('hjson')
const IRC = require('irc-framework')

const bot = new IRC.Client()
bot.config = hjson.parse(fs.readFileSync(__dirname + '/config.hjson', 'utf8'))

const { host, port, nick, username, realname } = bot.config

console.log(`Connecting to ${host}:${port} as ${nick}`)

bot.connect({
  host: host,
  port: port,

  nick: nick,
  username: username,
  gecos: realname,

  encoding: 'utf8',
  auto_reconnect: true,
  auto_reconnect_wait: 4000,
  auto_reconnect_max_retries: 3,
  ping_interval: 30,
  ping_timeout: 120,
})

bot.on('connected', () => {
  console.log('Successfully connected')
  const { 'nickserv-user': username, 'nickserv-pass': password } = bot.config

  if (username && password) {
    console.log(`Authenticating as ${username}`)
    bot.say('nickserv', `identify ${username} ${password}`)
  }

  ;(bot.config['autojoin'] || []).forEach(channel => {
    console.log(`Autojoining ${channel}...`)
    bot.join(channel)
  })
})

function parseCommand(message) {
  const prefix = bot.config['command-prefix']
  if (message.startsWith(prefix)) {
    return message.substring(1)
  }
}

function handleCommand(event, regex, handler, adminOnly) {
  event.command = parseCommand(event.message)
  if (!event.command) return

  const match = event.command.match(regex)
  if (!match) return

  if (adminOnly && !bot.config['admins'].includes(event.nick)) {
    console.log(
      `Preventing ${event.nick} from running admin command: ${event.command}`
    )
    return
  }

  console.log(`${event.nick} invoked command: ${event.command}`)
  handler(event, match)
}

bot.matchCommand = (regex, handler) => {
  bot.on('message', event => {
    handleCommand(event, regex, handler, false)
  })
}

bot.matchAdminCommand = (regex, handler) => {
  bot.on('message', event => {
    handleCommand(event, regex, handler, true)
  })
}

bot.matchAdminCommand(/^join .+$/, async event => {
  const channel = event.command.match(/^join (.+)$/)[1]
  event.reply(`Joining ${channel}...`)
  bot.join(channel)
})

module.exports = bot
