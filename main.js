const fs = require('fs')
const hjson = require('hjson');
const IRC = require("irc-framework")

const config = hjson.parse(fs.readFileSync(__dirname + '/config.hjson', 'utf8'))

const plugins = require('require-all')({
  dirname: __dirname + '/plugins',
  recursive: true
});

var bot = new IRC.Client();
bot.connect({
  host: 'irc.freenode.net',
  port: 6667,
  nick: config.nick,
  encoding: 'utf8',
  auto_reconnect: true,
  auto_reconnect_wait: 4000,
  auto_reconnect_max_retries: 3,
  ping_interval: 30,
  ping_timeout: 120,
})

bot.on('message', function(event) {
  if (event.message.indexOf('hello') === 0) {
    event.reply('Hi!')
  }
  
  if (event.message.match(/^!join /)) {
    var to_join = event.message.split(' ')[1]
    event.reply('Joining ' + to_join + '..')
    bot.join(to_join)
  }
});


// Or a quicker to match messages...
bot.matchMessage(/^hi/, function(event) {
  event.reply('hello there!');
});

for (key in plugins) {
  const { plugin } = plugins[key]
  plugin && plugin(bot)
}
