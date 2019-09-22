const bot = require('./bot')
const database = require('./database')
const plugins = require('require-all')({
  dirname: __dirname + '/plugins',
  recursive: true
});


for (key in plugins) {
  const { plugin, name } = plugins[key]
  console.log(`Loading plugin ${name}`)

  plugin(bot, database(name))
}
