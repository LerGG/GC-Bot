module.exports = {
  name: 'status',
  description: 'Online Check',
  execute (message, args) {
    message.channel.send('Bot Online')
  }

}
