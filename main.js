const fs = require('fs')
const hjson = require('hjson');
const IRC = require("irc-framework")

const database = require("./database")

const config = hjson.parse(fs.readFileSync(__dirname + '/config.hjson', 'utf8'))

const plugins = require('require-all')({
  dirname: __dirname + '/plugins',
  recursive: true
});

const bot = new IRC.Client();

bot.config = config

console.log(`Connecting to ${config.host}:${config.port} as ${config.nick}`)

bot.connect({
  host: config.host,
  port: config.port,

  nick: config.nick,
  username: config.username,
  gecos: config.realname,

  encoding: 'utf8',
  auto_reconnect: true,
  auto_reconnect_wait: 4000,
  auto_reconnect_max_retries: 3,
  ping_interval: 30,
  ping_timeout: 120,
})

bot.on('connected', () => {
  console.log("Successfully connected")
  const {
    nickserv_user: username,
    nickserv_pass: password,
   } = bot.config

   if (username && password) {
     console.log(`Authenticating as ${username}`)
     bot.say('nickserv', `identify ${username} ${password}`);
   }
})

function parseCommand(message) {
  const prefix = bot.config['command-prefix']
  if (message.startsWith(prefix)) {
    return message.substring(1)
  }
}

function handleCommand(event, regex, handler, adminOnly) {
  event.commandBody = parseCommand(event.message)
  if (!event.commandBody) return

  const match = event.commandBody.match(regex)
  if (!match) return

  if (adminOnly && !bot.config['admins'].includes(event.nick)) {
    console.log(`Preventing ${event.nick} from running admin command: ${event.commandBody}`)
    return
  }

  console.log(`${event.nick} invoked command: ${event.commandBody}`)
  handler(event)
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
    const channel = event.commandBody.match(/^join (.+)$/)[1]
    event.reply(`Joining ${channel}...`)
    bot.join(channel)
})

for (key in plugins) {
  const { plugin, name } = plugins[key]
  console.log(`Loading plugin ${name}`)

  plugin(bot, database(name))
}
