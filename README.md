# pjlnx

A NodeJS IRC bot designed for easy plugin implementation.

## Running

Install dependencies with `yarn install`, then copy `config.example.hjson` to `config.hjson` and customize. Run with `yarn start` or `node main.js`.

## Plugin Interface

Each javascript file in `plugins/` will be loaded as a plugin.

Plugin exports:

| Key      | Export                          |
| -------- | ------------------------------- |
| `name`   | The name of the module (string) |
| `plugin` | The plugin setup function       |

The plugin setup function will be executed when the bot starts.

Parameters passed to the plugin function:

1. An object that implements the irc-framework [client api](https://github.com/kiwiirc/irc-framework/blob/master/docs/clientapi.md).
2. The pjlnx database API, which implements two commands:
   1. `get(key)`: retrieve an object from the database identified by `key`
   2. `set(key, value)`: store `value` in the database identified by `key`

### pjlnx extensions to the client api

In addition to the irc-framework [client api](https://github.com/kiwiirc/irc-framework/blob/master/docs/clientapi.md) functions, pjlnx adds additional commands.

#### matchCommand

`.matchCommand(match_regex, cb)`
Call `cb()` when any incoming message matches match_regex.

#### config

Access to the config object loaded from `config.hjson`.

## License

[ISC](LICENSE.md)
