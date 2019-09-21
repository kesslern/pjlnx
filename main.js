const fs = require('fs')
const hjson = require('hjson');
const IRC = require("irc-framework")

const config = hjson.parse(fs.readFileSync(__dirname + '/config.hjson', 'utf8'))

const plugins = require('require-all')({
  dirname: __dirname + '/plugins',
  recursive: true
});

var bot = new IRC.Client();

bot.config = config

console.log(`Connecting to ${config.host}:${config.port} as ${config.nick}`)

bot.connect({
  host: config.host,
  port: config.port,
  nick: config.nick,
  encoding: 'utf8',
  auto_reconnect: true,
  auto_reconnect_wait: 4000,
  auto_reconnect_max_retries: 3,
  ping_interval: 30,
  ping_timeout: 120,
})

bot.on('connected', () => {
  console.log("Successfully connected")
})

bot.command = (regex, handler) => {
  bot.on('message', event => {
    const prefix = bot.config['command-prefix']
    const message = event.message
    bot.config['command-prefix']
    if (!message.startsWith(prefix)) return

    event.commandBody = event.message.substring(1)
    const match = event.commandBody.match(regex)

    if (match !== null) {
      handler(event)
    }
  })
}

bot.on('message', function(event) {
  if (event.message.match(/^!join /)) {
    var to_join = event.message.split(' ')[1]
    event.reply('Joining ' + to_join + '..')
    bot.join(to_join)
  }
})

for (key in plugins) {
  const { plugin } = plugins[key]
  plugin && plugin(bot)
}
