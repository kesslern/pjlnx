const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

const databasePromise = sqlite
  .open({ filename: './database.sqlite', driver: sqlite3.Database })
  .then(db => {
    db.migrate()
    return db
  })
  .then(db => db)

const getString = async (plugin, key) => {
  const db = await databasePromise
  console.log(`Retrieving key [${key}] for plugin [${plugin}]`)
  return db.get(`SELECT value FROM plugin_data WHERE plugin= ? AND key= ?`, [
    plugin,
    key,
  ])
}

const setString = async (plugin, key, value) => {
  const db = await databasePromise
  console.log(`Setting key [${key}] for plugin [${plugin}]`)
  db.run(
    'INSERT OR REPLACE INTO plugin_data (plugin, key, value) VALUES (?, ?, ?)',
    [plugin, key, value]
  )
}

const getObject = async (plugin, key) => {
  const result = await getString(plugin, key)
  return JSON.parse(result.value)
}

const setObject = async (plugin, key, value) =>
  setString(plugin, key, JSON.stringify(value))

module.exports = plugin => ({
  get: key => getObject(plugin, key),
  set: (key, value) => setObject(plugin, key, value),
})
