const sqlite = require('sqlite')
const SQL = require('sql-template-strings')

const databasePromise = sqlite.open('./database.sqlite')

databasePromise.then(db => db.migrate())

const getString = async (plugin, key) => {
  const db = await databasePromise
  return db.get(SQL`
    SELECT value FROM plugin_data WHERE plugin=${plugin} AND key=${key}
  `)
}

const setString = async (plugin, key, value) => {
  const db = await databasePromise
  db.run(SQL`
    INSERT OR REPLACE INTO plugin_data (plugin, key, value) VALUES (${plugin}, ${key}, ${value})
  `)
}

const getObject = async (plugin, key) => {
  const result = await getString(plugin, key)
  return JSON.parse(result.value)
}

const setObject = async (plugin, key, value) =>
  setString(plugin, key, JSON.stringify(value))

module.exports = plugin => ({
  get: (key) => getObject(plugin, key),
  set: (key, value) => setObject(plugin, key, value),
})
