module.exports = {
    name: 'activityclear',
    description: 'Clears current Activity Presence Field',
    execute (message, msg) {
      message.client.user.setActivity(msg)
      return message.channel.send('Activity cleared. Default Set.')
    }
  }