module.exports = {
    name: 'activityset',
    description: 'Sets Bots Activity Field to Argument',
    execute (message, args, client) {
    // Wrong Argument-Count Exceptions
    if (!args.length) {
        return message.reply('No arguments found: !activityset [TEXT]')
        } else {
        const ARGS_STRING = args.join(" ")
        client.user.setActivity(ARGS_STRING)
        return message.channel.send(`Activity Set: ${ARGS_STRING} `)
        }
    }
  }