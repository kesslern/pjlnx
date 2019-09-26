responses = [
  [/69/i, 'nice'],
  [/what((?:!|\?)*)$/i, 'chicken butt'],
  [/why((?:!|\?)*)$/i, 'chicken thigh'],
  [/wat((?:!|\?)*)$/i, 'chicken bat'],
  [/where((?:!|\?)*)$/i, 'chicken hair'],
  [/when((?:!|\?)*)$/i, 'chicken pen'],
  [/who((?:!|\?)*)$/i, 'chicken poo'],
  [/wut((?:!|\?)*)$/i, 'chicken slut'],
  [/wot((?:!|\?)*)$/i, 'chicken thot'],
  [/whose((?:!|\?)*)$/i, 'chicken booze'],
  [/which((?:!|\?)*)$/i, 'chicken bitch'],
  [/how((?:!|\?)*)$/i, 'chicken plow'],
]

const plugin = (bot) => {
  responses.forEach(([regex, reply]) => {
    bot.matchMessage(regex, event => {
      
      const modifier = event.message.toUpperCase() === event.message
        ? it => it.toUpperCase()
        : it => it

      const punctuation = event.message.match(regex)[1]
      event.reply(modifier(reply) + punctuation);
    })
  })
}

module.exports = {
  name: 'meme-reply',
  plugin
}
